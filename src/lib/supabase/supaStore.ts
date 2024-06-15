/* eslint-disable @typescript-eslint/no-unused-vars */
import { SupabaseClient, type PostgrestError } from '@supabase/supabase-js';
import { Compare, EQ } from './compare';
import { get, writable } from 'svelte/store';
import type { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types';

export type GenericDatabase = {
	public: GenericSchema;
};

export type TableRow<
	D extends GenericDatabase,
	T extends keyof D['public']['Tables']
> = D['public']['Tables'][T]['Row'];
type TableInsert<
	D extends GenericDatabase,
	T extends keyof D['public']['Tables']
> = D['public']['Tables'][T]['Insert'];
// type TableUpdate<T extends keyof Database['public']['Tables']> =
// 	Database['public']['Tables'][T]['Row'];

type SelectResult<TableRow> = {
	data: TableRow[];
	error: PostgrestError;
};

function cDB() {
	const request = indexedDB.open('supabase', 1);
	request.onupgradeneeded = (event) => {
		const db = event.target.result;
		db.createObjectStore('names', { keyPath: 'name' });
	};
}
cDB();

export class svelteSupabase<D extends GenericDatabase> extends SupabaseClient<D> {
	isInited = false;

	db;
	request;
	store<T extends keyof D['public']['Tables'] & string>(
		table: T,
		settings: SupaStoreSettings = {},
		IndexedDBName: string = 'supabase'
	): SupaStore<D, T> {
		return new SupaStore<D, T>(table, this, settings, IndexedDBName);
	}

	keyedStore<T extends keyof D['public']['Tables'] & string>(
		table: T,
		settings: SupaStoreSettings = {},
		IndexedDBName: string = 'supabase'
	): KeyedSupaStore<D, T> {
		return new KeyedSupaStore<D, T>(table, this, settings, IndexedDBName);
	}
}

type SupaStoreSettings = {
	unique?: string;
	filter?: Compare;
	useServer?: boolean;
	useIndexedDB?: boolean;
};

export class SupaStore<
	D extends GenericDatabase,
	T extends keyof D['public']['Tables'] & string = keyof D['public']['Tables'] & string,
	// Using hack to create type alias
	TRow extends TableRow<D, T> = TableRow<D, T>,
	TInsert extends TableInsert<D, T> = TableInsert<D, T>
> {
	tableName: T & string;
	supabase: SupabaseClient<D>;

	// Settigns:
	unique: keyof TRow;
	filter?: Compare;
	useServer: boolean;
	useIndexedDB: boolean;

	// The cid should be used in svelte to identify the row. NOT the id
	// We can't use the id because, when we insert a new row from this client, the id is not set by the server yet.
	store = writable<(TRow & { cid: number })[]>([]);
	subscribe = this.store.subscribe;
	set = this.store.set;

	indexedDBHandler;

	constructor(
		table: T,
		supabase: SupabaseClient<D>,
		settings: SupaStoreSettings = {},
		IndexedDBName: string = 'supabase'
	) {
		this.unique = settings.unique || 'id';
		this.filter = settings.filter;
		this.useServer = settings.useServer === null ? true : settings.useServer;
		this.useIndexedDB = settings.useIndexedDB == undefined ? true : settings.useIndexedDB;

		if (this.useIndexedDB) {
			console.log('SupaStore created', this.useIndexedDB);
			this.indexedDBHandler = new IndexedDBHandler(table, this.unique, IndexedDBName);
		}

		if (!this.useServer) {
			this.supabase = supabase;
			this.subscribeSupabase();
		}

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

	useFilter(filter: Compare) {
		this.filter = filter;
		return this;
	}

	// This function should be set to generete the same deafult values as the server
	// eg. things like created_at and updated_at
	deafults: () => Partial<TRow> = () => ({});

	setDeafults(deafults: typeof this.deafults) {
		this.deafults = deafults;
		return this;
	}

	getData() {
		return get(this.store);
	}

	async forceFetch(update = true): Promise<TRow[]> {
		const { data, error } = (await this.supabase
			.from('document')
			.select('*')) as SelectResult<TRow>;

		if (error) {
			console.error(error);
			return null;
		}

		if (update) {
			this.store.set(data.map((row) => ({ ...row, cid: row.cid })) as (TRow & { cid: number })[]);
		}
		return data;
	}

	async insert(d: TInsert[] | TInsert, server = this.useServer) {
		const insertData = Array.isArray(d) ? d : [d as D['public']['Tables'][T]['Insert']];
		const cid = this.getData().length + 1;
		const clientRow = {
			...this.deafults(),
			...(d as undefined as TRow),
			cid
		};
		this.store.update((prev) => [...prev, clientRow]);

		if (!server) return clientRow;

		const { data, error } = (await this.supabase
			.from(this.tableName)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.insert([d] as any)) as SelectResult<TRow>;

		if (error) {
			console.error(error);
			return;
		}

		this.store.update((prev) => {
			const index = prev.findIndex((row) => row.cid === cid);
			if (index !== -1) {
				prev[index] = { ...data[0], cid };
			}
			return prev;
		});
	}

	async delete(value, colomn: keyof TRow = 'id' as keyof TRow, server = this.useServer) {
		return this._delete(new EQ(colomn, value), server);
	}

	async update(d, value, colomn: keyof TRow = 'id' as keyof TRow, server = this.useServer) {
		return this._update(d, new EQ(colomn, value), server);
	}

	async _update(changes, compare: Compare, server = this.useServer) {
		// apply the changes to the localy
		this.store.update((prev) =>
			prev.map((row) => (compare.checkRow(row) ? { ...row, ...changes } : row))
		);
		if (!server) return;

		const { error } = (await compare
			.query(this.supabase.from(this.tableName).update(changes))
			// here we use the compare to find the correct row
			.select()) as SelectResult<TRow>;
	}

	async _delete(compare: Compare, server = this.useServer) {
		this.store.update((prev) => prev.filter((row) => !compare.checkRow(row)));

		if (!server) return;

		const { error } = (await compare
			.query(this.supabase.from(this.tableName).delete())
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
				{ event: '*', schema: 'public', table: this.tableName },
				(payload) => {
					if (payload.eventType === 'INSERT') {
						this.insert(payload.new as TInsert, false);
					}
					if (payload.eventType === 'DELETE') {
						this.delete((payload.old as TRow)[this.unique], undefined, false);
					}
					if (payload.eventType === 'UPDATE') {
						// If the row is not in the local store, we insert it
						if (
							this.getData().findIndex(
								(row) => row[this.unique] === (payload.old as TRow)[this.unique]
							) === -1
						) {
							this.insert(payload.new as TInsert, false);
						} else {
							this.update(payload.new, (payload.old as TRow)[this.unique], undefined, false);
						}
					}
				}
			)
			.subscribe();
	}
}

export class KeyedSupaStore<
	D extends GenericDatabase,
	T extends keyof D['public']['Tables'] & string = keyof D['public']['Tables'] & string,
	// Using hack to create type alias
	TRow extends TableRow<D, T> = TableRow<D, T>,
	TInsert extends TableInsert<D, T> = TableInsert<D, T>
> extends SupaStore<D, T> {
	keyedStore = writable<Partial<Record<string | number, (TableRow<D, T> & { cid: number })[]>>>({});
	key: keyof TableRow<D, T> = 'path';

	setKey(key: keyof TableRow<D, T>) {
		this.key = key;
		return this;
	}

	init() {
		this.store.subscribe((data) => {
			this.keyedStore.set(Object.groupBy(data, (d) => d[this.key] as string));
		});
	}

	override insert(
		d: TableInsert<D, T>[] | TInsert,
		server?: boolean
	): Promise<Partial<TableRow<D, T>> & TableRow<D, T> & { cid: number }> {
		this.keyedStore.update((prev) => {
			const cid = this.getData().length + 1;
			const clientRow = {
				...this.deafults(),
				...(d as undefined as TRow),
				cid
			};
			prev[clientRow[this.key] as string] = [
				...(prev[clientRow[this.key] as string] ?? []),
				clientRow
			];

			return prev;
		});
		return super.insert(d, server);
	}

	async _delete(compare: Compare, server?: boolean) {
		const r = await super._delete(compare, server);

		// this.keyedStore.update((prev) => {
		// 	Object.entries(prev).forEach(([k, v]) => {
		// 		prev[k] = v.filter((row) => compare.checkRow(row));
		// 	});

		// 	return prev;
		// });
		this._group();

		return r;
	}

	_group() {
		this.keyedStore.set(Object.groupBy(this.getData(), (d) => d[this.key] as string));
	}

	override async _update(changes, compare: Compare, server?: boolean): Promise<void> {
		const r = await super._update(changes, compare, server);
		this._group();
		return r;
	}

	override async forceFetch(update = true): Promise<TRow[]> {
		const r = await super.forceFetch(update);
		this._group();
		return r;
	}
}

class IndexedDBHandler {
	db: IDBOpenDBRequest;
	table: string;
	key: string;
	dbName: string;

	constructor(table: string, key: string, dbName: string) {
		console.log('IndexedDBHandler created');
		this.table = table;
		this.key = key;
		this.dbName = dbName;

		const request = indexedDB.open('supadb_' + table, 1);

		request.onupgradeneeded = (event) => {
			const db = event.target.result;

			if (!db.objectStoreNames.contains(table)) {
				const productStore = db.createObjectStore(table, {
					keyPath: this.key,
					autoIncrement: true
				});
				console.log('products store created');
			}
			setTimeout(() => {
				const objectStore = db.transaction([this.table], 'readwrite').objectStore(this.table);
				const request = objectStore.add({ name: 'John Doe', id: 1 });
				request.onsuccess = (event) => {
					console.log('Item added to the database');
				};
				request.onerror = (event) => {
					console.error('Error adding item to the database:', event.target.error);
				};
			}, 100);
			// Initial setup, no 'category' index yet
		};
		request.onerror = (event) => {
			console.error('Database error:', event.target.errorCode);
		};
		request.onsuccess = (event) => {
			console.log('Database opened successfully');
		};
	}
}
