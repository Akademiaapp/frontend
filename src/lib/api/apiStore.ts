import { writable } from 'svelte/store';
import type ApiHandler from '.';

export interface FileInfo {
	user_id: string;
	name: string;
	data: { type: string; data: [] };
	created_at: string;
	updated_at: string;
	id: string;
}

export async function updateFiles(api: ApiHandler) {
	const userDocuments = await api.getUserDocuments();

	fileStore.set(await userDocuments.json());
	console.log('updated files');
}

// Explicitly specify the type of the store
export const fileStore = writable<FileInfo[]>([]);
fileStore.subscribe((value) => {
	console.log(value);
}); // logs '0'
