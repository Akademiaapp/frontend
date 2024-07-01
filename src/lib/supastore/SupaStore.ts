import type { SupabaseClient } from '@supabase/supabase-js';
import type {
	ClientRow,
	GenericDatabase,
	SelectResult,
	SupaStoreSettings,
	TableInsert,
	TableRow
} from './types';
import { EQ, type Compare } from './compare';
import { get, writable } from 'svelte/store';
import { IndexedDBHandler } from './indexedDB';
import { EventHandler } from './EventHandler';

export class SupaStore<
	D extends GenericDatabase,
	T extends keyof D['public']['Tables'] & string = keyof D['public']['Tables'] & string, // The main Table
	// Using hack to create type alias
	TRow extends TableRow<D, T> = TableRow<D, T>,
	TInsert extends TableInsert<D, T> = TableInsert<D, T>
> {
	// Should ONLY be used for fetching data
	tableName: T & string;
	// Should ALWAYS be used for realtime, inserting, deleting and updating
	baseTableName?: string;
	supabase: SupabaseClient<D>;

	// Settigns:
	unique: keyof TRow & string;
	filter?: Compare;

	useServer: boolean;
	useIndexedDB: boolean;
	realtime: boolean;

	// The cid should be used in svelte to identify the row. NOT the id
	// We can't use the id because, when we insert a new row from this client, the id is not set by the server yet.
	store = writable<ClientRow<D, T>[]>([]);
	subscribe = this.store.subscribe;
	set = this.store.set;

	eventHandler = new EventHandler();

	indexedDBHandler: IndexedDBHandler;

	constructor(table: T, supabase: SupabaseClient<D>, settings: SupaStoreSettings = {}) {
		// set needed things
		this.tableName = table;
		this.baseTableName = table;

		this.setSettings(settings);

		this.initSupabase(supabase);
	}

	setSettings(settings: SupaStoreSettings) {
		this.unique = settings.unique ?? this.unique;
		this.filter = settings.filter ?? this.filter;
		this.useServer = settings.useServer ?? this.useServer;
		this.useIndexedDB = settings.useIndexedDB ?? this.useIndexedDB;
		this.realtime = settings.realtime ?? this.realtime;
	}

	initSupabase(supabase) {
		// init supabase
		if (this.useServer) {
			this.supabase = supabase;
			if (this.realtime) this.subscribeSupabase();

			this.supabase.auth.onAuthStateChange(async (event) => {
				if (event === 'SIGNED_IN') {
					setTimeout(async () => {
						await this.forceFetch();
					}, 0);
				} else if (event === 'SIGNED_OUT') {
					this.store.set([]);
				}
			});
		}
	}

	initIndexedDB(objectStore, dbName) {
		console.log('setting up indexededDB for ', this.tableName);
		this.indexedDBHandler = new IndexedDBHandler(
			this.tableName,
			this.unique,
			dbName,
			objectStore,
			this
		);
	}

	useFilter(filter: Compare) {
		this.filter = filter;
		return this;
	}
	// This function should be set to generete the same deafult values as the server
	// eg. things like created_at and updated_at
	deafults: () => Partial<TRow> = () => ({});
	sendDeafults: boolean = false;

	setDeafults(deafults: typeof this.deafults, server = false) {
		this.deafults = deafults;
		this.sendDeafults = server;
		return this;
	}

	getData() {
		return get(this.store);
	}

	async forceFetch(update = true): Promise<TRow[]> {
		const { data, error } = (await this.supabase
			.from(this.tableName)
			.select('*')) as SelectResult<TRow>;

		if (error) {
			console.error(error);
			return null;
		}

		if (update) {
			this.store.set(
				data.map((row: TRow) => ({ ...row, cid: String(row[this.unique]), table: this }))
			);

			if (this.useIndexedDB) {
				this.indexedDBHandler.set(data);
			}
		}
		this.eventHandler.emit('force-fetch');
		return data;
	}

	async insert(d: TInsert, server = this.useServer): Promise<ClientRow<D, T>> {
		const cid = this.getData().length + 1;
		const clientRow: ClientRow<D, T> = {
			...this.deafults(),
			...(d as undefined as TRow),
			cid,
			table: this
		};
		this.store.update((prev) => [...prev, clientRow]);
		this.eventHandler.emit('insert', clientRow);

		if (!server && this.useIndexedDB) {
			this.indexedDBHandler.put(clientRow);
		}

		if (!server) return clientRow;

		const { data, error } = (await this.supabase
			.from(this.baseTableName)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.insert([this.sendDeafults ? d : { ...this.deafults(), ...d }] as any)
			.select()) as SelectResult<TRow>;

		if (error) {
			console.error(error);
			return;
		}

		const serverConfirmedData = { ...data[0], cid, table: this };

		this.store.update((prev) => {
			const index = prev.findIndex((row) => row.cid === cid);
			if (index !== -1) {
				prev[index] = serverConfirmedData;
			}
			return prev;
		});

		if (this.useIndexedDB) {
			this.indexedDBHandler.put(data[0]);
		}

		this.eventHandler.emit('insert-confirmation', serverConfirmedData);

		return serverConfirmedData;
	}

	async delete(value, colomn: keyof TRow = this.unique as keyof TRow, server = this.useServer) {
		this.indexedDBHandler.delete(value);
		return this._delete(new EQ(colomn, value), server);
	}

	async update(
		key,
		d: Partial<TRow>,
		colomn: keyof TRow = this.unique as keyof TRow,
		server = this.useServer
	) {
		this.indexedDBHandler.update(key, d);
		this.eventHandler.emit('update', key, d);
		return this._update(d, new EQ(colomn, key), server);
	}

	async _update(changes, compare: Compare, server = this.useServer) {
		// apply the changes to the localy
		this.store.update((prev) =>
			prev.map((row) => (compare.checkRow(row) ? { ...row, ...changes } : row))
		);

		if (!server) return;

		const { error } = (await compare
			.query(this.supabase.from(this.baseTableName).update(changes))
			// here we use the compare to find the correct row
			.select()) as SelectResult<TRow>;

		if (error) {
			console.error(error);
			return;
		}
	}

	find(value, colomn: keyof TRow = this.unique as keyof TRow) {
		return this._find(new EQ(colomn, value));
	}

	findAll(value, colomn: keyof TRow) {
		return this._findAll(new EQ(colomn, value));
	}

	_find(compare: Compare) {
		// find the first row that matches locally
		return this.getData().find((row) => compare.checkRow(row));
	}

	_findAll(compare: Compare) {
		// find all the rows that match locally
		return this.getData().filter((row) => compare.checkRow(row));
	}

	async _delete(compare: Compare, server = this.useServer) {
		this.store.update((prev) => prev.filter((row) => !compare.checkRow(row)));

		if (!server) return;

		const { error } = (await compare
			.query(this.supabase.from(this.baseTableName).delete())
			.select()) as SelectResult<TRow>;

		if (error) {
			console.error(error);
		}
	}

	async subscribeSupabase() {
		this.supabase
			.channel('custom-all-channel')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: this.baseTableName },
				(payload) => {
					if (payload.eventType === 'INSERT') {
						this.insert(payload.new as TInsert, false);
					}
					if (payload.eventType === 'DELETE') {
						this.delete((payload.old as TRow)[this.unique], undefined, false);
					}
					if (payload.eventType === 'UPDATE') {
						if (this.find((payload.old as TRow)[this.unique]) == null) {
							// If the row is not in the local store, we Insert it
							this.insert(payload.new as TInsert, false);
						} else {
							// If the row IS in the local store, we Update it
							this.update(
								(payload.old as TRow)[this.unique as keyof TRow],
								payload.new as Partial<TRow>,
								undefined,
								false
							);
						}
					}
				}
			)
			.subscribe();
	}
}
