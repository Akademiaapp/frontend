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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyStore = SupaStore<any, string, any, any>;

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
	realtime?: boolean;
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
	unique: keyof TRow & string;
	filter?: Compare;

	useServer: boolean;
	useIndexedDB: boolean;
	realtime: boolean;

	// The cid should be used in svelte to identify the row. NOT the id
	// We can't use the id because, when we insert a new row from this client, the id is not set by the server yet.
	store = writable<(TRow & { cid: number })[]>([]);
	subscribe = this.store.subscribe;
	set = this.store.set;

	indexedDBHandler: IndexedDBHandler;

	constructor(
		table: T,
		supabase: SupabaseClient<D>,
		settings: SupaStoreSettings = {},
		IndexedDBName: string = 'supabase'
	) {
		this.tableName = table;
		this.unique = settings.unique ?? 'id';
		this.filter = settings.filter;
		this.useServer = settings.useServer ?? true;
		this.useIndexedDB = settings.useIndexedDB ?? true;
		this.realtime = settings.realtime ?? true;

		if (this.useIndexedDB) {
			console.log('SupaStore created', this.useIndexedDB);
		}

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
		console.log('creating indexedDB');
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

	setDeafults(deafults: typeof this.deafults) {
		this.deafults = deafults;
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
			this.store.set(data.map((row) => ({ ...row, cid: row.id })) as (TRow & { cid: number })[]);

			if (this.useIndexedDB) {
				this.indexedDBHandler.set(data);
			}
		}
		return data;
	}

	async insert(d: TInsert, server = this.useServer) {
		const cid = this.getData().length + 1;
		const clientRow = {
			...this.deafults(),
			...(d as undefined as TRow),
			cid
		};
		this.store.update((prev) => [...prev, clientRow]);

		if (!server && this.useIndexedDB) {
			this.indexedDBHandler.put(clientRow);
		}

		if (!server) return clientRow;

		const { data, error } = await this.supabase
			.from(this.tableName)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.insert([d] as any)
			.select();

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

		if (this.useIndexedDB) {
			this.indexedDBHandler.put(data[0]);
		}
	}

	async delete(value, colomn: keyof TRow = 'id' as keyof TRow, server = this.useServer) {
		this.indexedDBHandler.delete(value);
		return this._delete(new EQ(colomn, value), server);
	}

	async update(d, value, colomn: keyof TRow = 'id' as keyof TRow, server = this.useServer) {
		this.indexedDBHandler.update(value, d);
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

	async find(d, value, colomn: keyof TRow = 'id' as keyof TRow) {
		return this._find(d, new EQ(colomn, value));
	}

	async findAll(d, value, colomn: keyof TRow) {
		return this._findAll(d, new EQ(colomn, value));
	}

	async _find(changes, compare: Compare) {
		// find the first row that matches locally
		return this.getData().find((row) => compare.checkRow(row));
	}

	async _findAll(changes, compare: Compare) {
		// find all the rows that match locally
		return this.getData().filter((row) => compare.checkRow(row));
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
		d: TInsert,
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
		return r as TRow[];
	}
}

class IndexedDBHandler {
	tableName: string;
	key: string;
	dbName: string;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	supaStore: AnyStore;

	constructor(
		tableName: string,
		key: string,
		dbName: string,
		objectStore: IDBObjectStore,
		supaStore: AnyStore
	) {
		this.tableName = tableName;
		this.key = key;
		this.dbName = dbName;
		this.supaStore = supaStore;

		objectStore.getAll().onsuccess = (event: Event) => {
			if (this.supaStore.getData().length !== 0) return;
			this.supaStore.set((event.target as IDBRequest).result);
		};
	}

	set(data) {
		this.writeDB((objectStore) => {
			objectStore.clear();
			for (const row of data) {
				objectStore.put(row);
			}
		});
	}

	openDB() {
		return indexedDB.open(this.dbName);
	}

	writeDB(action: (db: IDBObjectStore) => void) {
		const request = this.openDB();

		request.onsuccess = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;

			const objectStore = db.transaction(this.tableName, 'readwrite').objectStore(this.tableName);

			action(objectStore);
		};
	}

	put(row) {
		this.writeDB((objectStore) => {
			objectStore.put(row);
		});
	}

	putArray(data: []) {
		this.writeDB((objectStore) => {
			for (const row of data) {
				objectStore.put(row);
			}
		});
	}

	delete(key) {
		this.writeDB((objectStore) => {
			objectStore.delete(key);
		});
	}

	clear() {
		this.writeDB((objectStore) => {
			objectStore.clear();
		});
	}

	update(key, changes) {
		this.writeDB((objectStore) => {
			const request = objectStore.get(key);

			request.onsuccess = (event) => {
				const data = (event.target as IDBRequest).result;
				objectStore.put({ ...data, ...changes });
			};
		});
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createIndexedDB(supaStores: AnyStore[], version = 1) {
	const storeName = 'supaStore';
	const request = indexedDB.open(storeName, version);

	request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
		const db = (event.target as IDBOpenDBRequest).result;

		for (const store of supaStores) {
			if (!db.objectStoreNames.contains(store.tableName)) {
				const table = db.createObjectStore(store.tableName, {
					keyPath: store.unique,
					autoIncrement: true
				});
			}
		}

		if (!db.objectStoreNames.contains('table')) {
			const productStore = db.createObjectStore('table', {
				keyPath: 'id',
				autoIncrement: true
			});
			console.log('products store created');
		}
		setTimeout(() => {
			const objectStore = db.transaction(['table'], 'readwrite').objectStore('table');
			const request = objectStore.add({ name: 'John Doe', id: 1 });
			request.onsuccess = (event) => {
				console.log('Item added to the database');
			};
			request.onerror = (event) => {
				console.error('Error adding item to the database:', (event.target as IDBRequest).error);
			};
		}, 100);
		// Initial setup, no 'category' index yet
	};
	request.onerror = (event) => {
		console.error('Database error:', (event.target as IDBRequest).error);
	};
	request.onsuccess = (event) => {
		console.log('Database opened successfully');

		const db = (event.target as IDBOpenDBRequest).result as IDBDatabase;

		const transaction = db.transaction(
			supaStores.map((s) => s.tableName),
			'readonly'
		);

		for (const supaStore of supaStores) {
			const tableName = supaStore.tableName;
			const objectStore = transaction.objectStore(tableName);

			supaStore.initIndexedDB(objectStore, storeName);

			objectStore.getAll().onsuccess = function (event: Event) {
				console.log(`Data from ${tableName}: `, (event.target as IDBRequest).result);
			};
		}
	};
}
