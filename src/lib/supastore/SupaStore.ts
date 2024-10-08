import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import type {
	ClientRow,
	GenericDatabase,
	SelectResult,
	SupaStoreSettings,
	TableInsert,
	TableRow
} from './types';
import { Compare, EQ } from './compare';
import { get, writable } from 'svelte/store';
import { IndexedDBHandler } from './indexedDB';
import { EventHandler } from './EventHandler';
import { RealtimeHandler } from './RealtimeHandler';
import type { Database } from '@/supabase.types';

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
	baseTableName?: T & string;
	supabase: SupabaseClient<D>;

	// Settigns:
	unique: keyof TRow & string;
	filter?: Compare;

	useServer: boolean;
	useIndexedDB: boolean;
	realtime: boolean;

	realtimeHandler: RealtimeHandler<D, T>;

	// The cid should be used in svelte to identify the row. NOT the id
	// We can't use the id because, when we insert a new row from this client, the id is not set by the server yet.
	store = writable<ClientRow<D, T>[]>([]);
	subscribe = this.store.subscribe;
	set = this.store.set;

	eventHandler = new EventHandler();

	indexedDBHandler: IndexedDBHandler;

	constructor(
		table: T,
		supabase: SupabaseClient<D>,
		settings: SupaStoreSettings = {},
		realtimeChannel: RealtimeChannel
	) {
		// set needed things
		this.tableName = table;
		this.baseTableName = table;

		this.setSettings(settings);

		this.initSupabase(supabase, realtimeChannel);
	}

	setSettings(settings: SupaStoreSettings) {
		this.unique = settings.unique ?? 'id';
		this.filter = settings.filter;
		this.useServer = settings.useServer ?? true;
		this.useIndexedDB = settings.useIndexedDB ?? true;
		this.realtime = settings.realtime ?? true;
	}

	initSupabase(supabase, realtimeChannel: RealtimeChannel) {
		// init supabase
		if (this.useServer) {
			this.supabase = supabase;

			if (this.realtime) {
				this.realtimeHandler = new RealtimeHandler(this.baseTableName, this, realtimeChannel);
			}

			this.supabase.auth.onAuthStateChange(async (event) => {
				if (event === 'SIGNED_IN') {
					setTimeout(async () => {
						await this.forceFetch();
					}, 1000);
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

	applyFilter(q) {
		if (this.filter) {
			return this.filter.query(q);
		}
		return q;
	}

	async forceFetch(update = true): Promise<TRow[]> {
		const { data, error } = (await this.applyFilter(this.supabase.from(this.tableName)).select(
			'*'
		)) as SelectResult<TRow>;

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

	genClientRow(row: TInsert, cid = this.getData().length + 1): ClientRow<D, T> {
		return {
			...this.deafults(),
			...(row as undefined as TRow),
			cid,
			table: this
		};
	}

	async insert(d: TInsert, server = this.useServer): Promise<ClientRow<D, T>> {
		const clientRow = this.genClientRow(d);
		const cid = clientRow.cid;
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
		this.eventHandler.emit('delete', value, colomn);
		return this._delete(new EQ(colomn, value), server);
	}

	async update(
		key,
		d: Partial<TRow>,
		colomn: keyof TRow = this.unique as keyof TRow,
		server = this.useServer
	) {
		this.indexedDBHandler.update(key, d);
		this.eventHandler.emit('update', key, d, colomn, server, false);
		return this._update(d, new EQ(colomn, key), server, false);
	}
	async updateAll(
		key,
		d: Partial<TRow>,
		colomn: keyof TRow = this.unique as keyof TRow,
		server = this.useServer
	) {
		this.indexedDBHandler.update(key, d);
		this.eventHandler.emit('update', key, d, colomn, server, true);
		return this._update(d, new EQ(colomn, key), server, true);
	}

	async upsert(
		key,
		d: TInsert,
		colomn: keyof TRow = this.unique as keyof TRow,
		server = this.useServer,
		oldKey = key
	) {
		if (this.find(oldKey, colomn)) {
			return this.update(key, d as unknown as TRow, colomn, server);
		} else {
			return this.insert(d, server);
		}
	}

	async _update(changes, compare: Compare, server = this.useServer, multiple = false) {
		// apply the changes to the localy

		this.store.update((prev) => {
			const rowsToUpdate = multiple
				? prev.filter((row) => compare.checkRow(row))
				: [prev.find((row) => compare.checkRow(row))];

			for (const row of rowsToUpdate) {
				// We use Object.assign to apply it directly to the row, instead of chaning it
				// This makes it possible to change to keep a reference to the row
				Object.assign(row, changes);
			}
			return prev;
		});

		if (!server) return;

		const { data, error } = (await compare
			.query(this.supabase.from(this.baseTableName).update(changes))
			// here we use the compare to find the correct row
			.select()) as SelectResult<TRow>;

		if (error) {
			console.error(error);
			return;
		}
		return data;
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

		const { error } = await compare.query(this.supabase.from(this.baseTableName).delete());

		if (error) {
			console.error(error);
		}
	}
}

class Row<T> {
	constructor(public data: T) {
		Object.assign(this, data);
	}
}

const row: ClientRow<Database, 'document'> = new Row<ClientRow<Database, 'document'>>({});
row.table;
