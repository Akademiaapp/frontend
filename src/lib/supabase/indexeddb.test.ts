// Function to open IndexedDB
function openDatabase(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open('MyDatabase', 1);

		request.onerror = () => {
			reject(request.error);
		};

		request.onsuccess = () => {
			resolve(request.result);
		};

		request.onupgradeneeded = (event) => {
			const db = request.result;

			// Create object store if it doesn't exist
			if (!db.objectStoreNames.contains('Users')) {
				db.createObjectStore('Users', { keyPath: 'id' });
			}
		};
	});
}

// Function to add a user to the Users object store
async function addUser(user: User): Promise<void> {
	const db = await openDatabase();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction('Users', 'readwrite');
		const store = transaction.objectStore('Users');

		const request = store.add(user);

		request.onerror = () => {
			reject(request.error);
		};

		request.onsuccess = () => {
			resolve();
		};
	});
}

// Function to get a user by ID from the Users object store
async function getUserById(id: number): Promise<User | undefined> {
	const db = await openDatabase();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction('Users', 'readonly');
		const store = transaction.objectStore('Users');

		const request = store.get(id);

		request.onerror = () => {
			reject(request.error);
		};

		request.onsuccess = () => {
			resolve(request.result);
		};
	});
}
