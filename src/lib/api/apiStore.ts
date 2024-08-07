import { get, writable } from 'svelte/store';

import { folders } from '../../routes/workspace/sidebar/sidebarStore';
import { Folder } from './fileClasses';
import { documents } from '@/supabase/supabaseClient';
import type { Database, Tables } from '@/supabase.types';
import type { ClientRow } from '@/supastore/types';

export { Folder };

let oldDocs = [];
documents.subscribe((data) => {
	folders.update((prev) => {
		const docs = data.filter((doc) => !oldDocs.find((f) => f.id === doc.id));

		prev.find((f) => f.name === 'Andet').files.push(...docs);
		return prev;
	});

	oldDocs = data;
});

export type ClientFile =
	| ClientRow<Database, 'assignment'>
	| ClientRow<Database, 'assignment_answer'>
	| ClientRow<Database, 'document'>;
export const currentFile = writable<ClientFile>(null);
export const currentStatus = writable<Tables<'assignment_answer'>['status']>(null);

currentFile.subscribe((file) => {
	if (!file) {
		currentStatus.set(null);
		return;
	}
	if ('status' in file) {
		currentStatus.set(file.status);
	} else {
		currentStatus.set(null);
	}
});

currentStatus.subscribe((status) => {
	const theCurrentFile = get(currentFile);
	if (!theCurrentFile) return;
	if ('status' in theCurrentFile) {
		currentFile.update((file: ClientRow<Database, 'assignment_answer'>) => {
			file.status = status;
			return file;
		});
	}
});

export function canEditFile(file: ClientFile) {
	if (!file) return;
	if ('status' in file) {
		// students should only be able to edit files that are NOT submitted or graded
		return file.status !== 'submitted' && file.status !== 'graded';
	}

	if ('is_public' in file) {
		// teachers should only be able to edit files that are NOT public
		return !file.is_public;
	}
	return true;
}
