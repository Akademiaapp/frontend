import type { AnyStore } from './types';

export class IndexedDBHandler {
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
			const { table, ...data } = row;
			try {
				objectStore.put(data);
			} catch (e) {
				console.error('Error while putting data:', e, 'Row:', data);
			}
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
export function createIndexedDB(supaStores: AnyStore[], version = 2) {
	const storeName = 'supaStore';
	const request = indexedDB.open(storeName, version);

	request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
		const db = (event.target as IDBOpenDBRequest).result;

		for (const store of supaStores) {
			if (!db.objectStoreNames.contains(store.tableName)) {
				db.createObjectStore(store.tableName, {
					keyPath: store.unique,
					autoIncrement: true
				});
			}
		}

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
