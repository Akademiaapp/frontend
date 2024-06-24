import { get, writable } from 'svelte/store';
import api from '.';

import { folders } from '../../routes/workspace/sidebar/sidebarStore';
import {
	Assignment,
	AssignmentAnswer,
	AssignmentStatus,
	AssignmentStatusStrings,
	DocumentInfo,
	FileInfo,
	Folder
} from './fileClasses';
import { tomorrow } from '@/utils/dateUtils';
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
export async function newAssignment(
	name: string = '',
	dueDate: Date = tomorrow(),
	open: boolean = true
) {
	const response = await api.callApi(
		'/assignments',
		{
			name: name == '' ? 'Uden titel' : name,
			due_date: new Date(
				dueDate.getFullYear(),
				dueDate.getMonth(),
				dueDate.getDate(),
				23,
				45
			).toISOString()
		},
		'POST'
	);
	if (!response) {
		throw new Error('Could not create document due to no response');
	}
	const json = await response.json();
	const newAssignment = new Assignment(json, assignmentStore);

	if (open) {
		newAssignment.open();
	}
	assignmentStore.update((files) => [...files, newAssignment]);
}
