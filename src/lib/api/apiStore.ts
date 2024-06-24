import { get, writable } from 'svelte/store';

import { folders } from '../../routes/workspace/sidebar/sidebarStore';
import {
	AssignmentAnswer,
	AssignmentStatus,
	AssignmentStatusStrings,
	FileInfo,
	Folder
} from './fileClasses';
import { documents, supabase } from '@/supabase/supabaseClient';
import { session } from '../../routes/store';
import type { Tables } from '@/supabase.types';

export { FileInfo, Folder };

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

export async function updateSessionInfo() {
	session.set((await supabase.auth.getSession()).data.session);
}

export const currentFile = writable<Tables<'assignment' | 'assignment_answer' | 'document'>>(null);
export const currentStatus = writable<AssignmentStatus>(null);

currentFile.subscribe((file) => {
	if (file instanceof AssignmentAnswer) {
		currentStatus.set(file.status);
	} else {
		currentStatus.set(null);
	}
});

currentStatus.subscribe((status) => {
	const file = get(currentFile);
	if (file instanceof AssignmentAnswer) {
		file.updateInfo({
			status: AssignmentStatusStrings[status]
		});
	}
});
