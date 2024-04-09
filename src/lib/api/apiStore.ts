import { get, writable } from 'svelte/store';
import api from '.';

import { folders } from '../../routes/workspace/sidebar/sidebarStore';
import { Assignment, AssignmentAnswer, DocumentInfo, FileInfo } from './fileClasses';

export async function updateDocuments() {
	const response = await api.getUserDocuments();
	console.log('response: ', response);
	if (!response) {
		throw new Error('Could not update files due to no response');
	}
	const json = await response.json();
	console.log(json);

	documentStore.set(json.map((docuemntInfo) => new DocumentInfo(docuemntInfo, documentStore)));
	folders.update((prev) => {
		const docs = json.map((docuemntInfo) => new DocumentInfo(docuemntInfo, documentStore));
		docs.forEach((doc) => {
			prev.find((f) => f.name === 'Andet').files.push(doc);
		});
		return prev;
	});
	console.log('updated files');
}

export async function updateUserInfo() {
	userInfo.set(await api.callApi('/users/self').then((response) => response.json()));
}

// Explicitly specify the type of the store
export const documentStore = writable<DocumentInfo[]>([]);
export const assignmentAnswerStore = writable<AssignmentAnswer[]>([]);
export const assignmentStore = writable<Assignment[]>([]);

export const currentFile = writable<FileInfo | Assignment | AssignmentAnswer>(null);

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
export const userInfo = writable<UserInfo>();

export async function updateAssignmentsAnswers() {
	const response = await api.getAssignmentAnswers();
	if (!response) {
		throw new Error('Could not update assignments due to no response');
	}
	const json = await response.json();

	assignmentAnswerStore.set(
		json.map((assignmentInfo) => new AssignmentAnswer(assignmentInfo, assignmentAnswerStore))
	);
	console.log('updated assignments', get(assignmentAnswerStore));
}

export async function updateAssignments() {
	const response = await api.getAssignments();
	if (!response) {
		throw new Error('Could not update assignments due to no response');
	}
	const json = await response.json();
	console.log(json);

	assignmentStore.set(
		json.map((assignmentInfo) => new Assignment(assignmentInfo, assignmentStore))
	);
	console.log('updated assignments');
}

export async function newDocument(name: string, open: boolean = true, isNote = false) {
	const response = await api.createDocument(name, isNote);
	if (!response) {
		throw new Error('Could not create document due to no response');
	}
	const json = await response.json();
	const newDoc = new DocumentInfo(json, documentStore);

	if (open) {
		newDoc.open();
	}
	documentStore.update((files) => [...files, newDoc]);
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

function tomorrow(): Date {
	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	return tomorrow;
}

export const apiDownStore = writable<boolean>(false);
