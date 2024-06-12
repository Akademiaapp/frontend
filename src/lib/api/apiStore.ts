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
import { supabase } from '@/supabase/supabaseClient';
import { session } from '../../routes/store';

export { FileInfo, Folder };

export async function updateDocuments() {
	const { data, error } = await supabase.from('document').select('*');
	if (error) {
		throw new Error('Could not update files due to no response' + error);
	}
	const oldDocs = get(documentStore);
	documentStore.set(data.map((docuemntInfo) => new DocumentInfo(docuemntInfo, documentStore)));
	folders.update((prev) => {
		const docs = get(documentStore).filter((doc) => !oldDocs.find((f) => f.id === doc.id));

		prev.find((f) => f.name === 'Andet').files.push(...docs);
		return prev;
	});
}

export async function updateSessionInfo() {
	session.set((await supabase.auth.getSession()).data.session);
}

// Explicitly specify the type of the store
export const documentStore = writable<DocumentInfo[]>([]);
export const assignmentAnswerStore = writable<AssignmentAnswer[]>([]);
export const assignmentStore = writable<Assignment[]>([]);

export const currentFile = writable<FileInfo | Assignment | AssignmentAnswer>(null);
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

interface FilePermission {
	id: string;
	user_id: string;
	permission: string;
	document_id: string;
}

interface School {
	id: string;
	name: string;
	address: string;
}

interface UserInfo {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	created_at: string;
	updated_at: string;
	schoolId: string;
	type: string;
	school: School;
	user_group: [];
	assignment: [];
	assignment_answer: [];
	file_permission: FilePermission[];
}

export async function updateAssignmentsAnswers() {
	const response = await api.getAssignmentAnswers();
	if (!response || response.status == 401) {
		som++;
		console.log('SOM');
		if (som > 2) {
			location.reload();
			som = 0;
		}
		throw new Error('Could not update assignments due to no response');
	}

	const json = await response.json();
	if (!json) {
		som++;
		if (som > 2) {
			location.reload();
			som = 0;
		}

		throw new Error('Could not update assignments due to no response');
	}

	som = 0;

	assignmentAnswerStore.set(
		json.map((assignmentInfo) => new AssignmentAnswer(assignmentInfo, assignmentAnswerStore))
	);
}

let som = 0;

export async function updateAssignments() {
	console.log('updating assignments');
	const user = get(session).user;
	if (!user) return;
	if (user.type != 'TEACHER' && user.type != 'TESTER') return;
	const response = await api.getAssignments();
	if (!response || response.status == 401) {
		som++;
		console.log('SOM');
		if (som > 2) {
			location.reload();
			som = 0;
		}
		throw new Error('Could not update assignments due to no response');
	}

	const json = await response.json();
	if (!json) {
		som++;
		if (som > 2) {
			location.reload();
			som = 0;
		}

		throw new Error('Could not update assignments due to no response');
	}

	som = 0;
	assignmentStore.set(
		json.map((assignmentInfo) => new Assignment(assignmentInfo, assignmentStore))
	);
}

export async function newDocument(name: string, open: boolean = true, isNote = false) {
	const { data, error } = await supabase.from('document').insert([{ name, isNote }]).select();

	const newDoc = new DocumentInfo(data[0], documentStore);

	if (open) {
		newDoc.open();
	}

	documentStore.update((files) => [...files, newDoc]);
	// if (!response) {
	// 	throw new Error('Could not create document due to no response');
	// }
	// const json = await response.json();	const newDoc = new DocumentInfo(json, documentStore);

	// if (open) {
	// 	newDoc.open();
	// }
	// documentStore.update((files) => [...files, newDoc]);
}
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

export const apiDownStore = writable<boolean>(false);
