import { get, writable } from 'svelte/store';

import { folders } from '../../routes/workspace/sidebar/sidebarStore';
import { Folder } from './fileClasses';
import { documents, supabase, type fileInfo } from '@/supabase/supabaseClient';
import { session } from '../../routes/store';
import type { Tables } from '@/supabase.types';

export { Folder };

export async function updateSessionInfo() {
	session.set((await supabase.auth.getSession()).data.session);
}

const oldDocs = [];
documents.subscribe((data) => {
	folders.update((prev) => {
		const docs = data.filter((doc) => !oldDocs.find((f) => f.id === doc.id));

		prev.find((f) => f.name === 'Andet').files.push(...docs);
		return prev;
	});
});

export const currentFile = writable<Tables<'assignment' | 'assignment_answer' | 'document'>>(null);
export const currentStatus = writable<AssignmentStatus>(null);

currentFile.subscribe((file) => {
	if ('status' in file) {
		currentStatus.set(file.status);
	} else {
		currentStatus.set(null);
	}
});

currentStatus.subscribe((status) => {
	if ('status' in get(currentFile)) {
		currentFile.update((file: Tables<'assignment_answer'>) => {
			file.status = status;
			return file;
		});
	}
});

function canEditFile(file: fileInfo) {
	if ('status' in file) {
		// students should only be able to edit files that are NOT submitted or graded
		return file.status !== 'submitted' && file.status !== 'graded';
	}

	if ('isPublic' in file) {
		// teachers should only be able to edit files that are NOT public
		return !file.isPublic;
	}
}
