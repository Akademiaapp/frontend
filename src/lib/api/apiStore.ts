import { get, writable } from 'svelte/store';
import api from '.';
import { goto } from '$app/navigation';

export class FileInfo {
	id: string;
	name: string;
	data: { type: string; data: [] };
	created_at: string;
	updated_at: string;

	fileType: string = 'documents';

	store = documentStore;

	constructor(info, fileType = 'documents') {
		this.fileType = fileType;
		this.id = info.id;
		this.name = info.name;
		this.data = info.data;
		this.created_at = info.created_at;
		this.updated_at = info.updated_at;
	}

	get path() {
		return `/${this.fileType}/${this.id}`;
	}

	_rename: (newName: string) => void = api.debounce((newName: string) => {
		return this.updateInfo({ name: newName == '' ? 'Unavngivet' : newName });
	});

	rename(newName: string) {
		this._rename(newName);
	}

	open() {
		currentFile.set(this);
		console.log(`going to /workspace/editor?id=${this.id}?type=${this.fileType}`);
		goto(`/workspace/editor?id=${this.id}?type=${this.fileType}`);
	}

	delete() {
		documentStore.update((files) => files.filter((file) => file.id !== this.id));
		return api.callApi(this.path, {}, 'DELETE');
	}

	addUser(user_email: string) {
		return api.callApi(
			this.path + '/users',
			{
				user_email
			},
			'PUT'
		);
	}

	// Gets the members of the file from the api
	async getMembers() {
		const res = await api.callApi(this.path + '/users');
		const json = await res.json();
		return json;
	}

	// Requests the api to update information
	updateInfo(info) {
		return api.callApi(this.path, info, 'PUT');
	}
}

export class DocumentInfo extends FileInfo {
	fileType = 'documents';

	constructor(info) {
		super(info);
	}
}

export enum AssignmentProgress {
	NOT_STARTED,
	IN_PROGRESS,
	SUBMITTED,
	GRADED
}

export class Assignment extends FileInfo {
	due_date: string;
	assignment_answers;
	asigned_groups_ids: string[];
	isPublic: boolean;
	teacherId: string;

	store = assignmentStore;

	constructor(info, fileType = 'assignments') {
		super(info, fileType);
		this.due_date = info.due_date;
		this.assignment_answers = info.assignment_answers;
		this.asigned_groups_ids = info.asigned_groups_ids;
		this.isPublic = info.isPublic;
		this.teacherId = info.teacherId;
	}

	async getMembers() {
		return [];
	}

	async assign() {
		this.isPublic = true;
		return api.callApi(this.path + '/deploy', null, 'POST');
	}

	rename(newName) {
		this.store.update((assignments) => {
			const index = assignments.findIndex((assignment) => assignment.id === this.id);
			if (index == -1) return assignments;
			assignments[index].name = newName;
			return assignments;
		});
		return super.rename(newName);
	}
}

export class AssignmentAnswer extends FileInfo {
	progress: AssignmentProgress;
	assignment_id: string;
	due_date: string;
	assignment_answers;
	asigned_groups_ids: string[];
	isPublic: boolean;
	teacherId: string;

	store = assignmentAnswerStore;

	constructor(info) {
		super(info, 'assignmentAnswers');
		this.assignment_answers = info.assignment_answers;
		this.asigned_groups_ids = info.asigned_groups_ids;
		this.isPublic = info.isPublic;
		this.teacherId = info.teacherId;
		this.due_date = info.due_date;
		this.assignment_id = info.assignment_id;
		this.progress = AssignmentProgress[info.status as keyof typeof AssignmentProgress];
		this.store = assignmentAnswerStore;
	}

	async getMembers() {
		return [];
	}

	// rename(newName) {
	// 	assignmentAnswerStore.update((assignments) => {
	// 		const index = assignments.findIndex((assignment) => assignment.id === this.id);
	// 		if (index == -1) return assignments;
	// 		assignments[index].name = newName;
	// 		return assignments;
	// 	});
	// 	return super.rename(newName);
	// }
}

export class Folder {
	name: string;
	subFolders: Folder[];
	files: FileInfo[];
	emoji: string = '';

	constructor(info: { name: string; subFolders: Folder[]; files: FileInfo[]; emoji?: string }) {
		this.name = info.name;
		this.subFolders = info.subFolders;
		this.files = info.files;
		if (info.emoji) {
			this.emoji = info.emoji;
		}
	}
}

export async function updateDocuments() {
	const response = await api.getUserDocuments();
	console.log('response: ', response);
	if (!response) {
		throw new Error('Could not update files due to no response');
	}
	const json = await response.json();
	console.log(json);

	documentStore.set(json.map((docuemntInfo) => new DocumentInfo(docuemntInfo)));
	console.log('updated files');
}

export async function updateUserInfo() {
	userInfo.set(await api.callApi('/users/self').then((response) => response.json()));
}

// Explicitly specify the type of the store
export const documentStore = writable<DocumentInfo[]>([]);
export const assignmentAnswerStore = writable<AssignmentAnswer[]>([]);
export const assignmentStore = writable<Assignment[]>([]);

export const currentFile = writable<FileInfo>(null);

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

	assignmentAnswerStore.set(json.map((assignmentInfo) => new AssignmentAnswer(assignmentInfo)));
	console.log('updated assignments', get(assignmentAnswerStore));
}

export async function updateAssignments() {
	const response = await api.getAssignments();
	if (!response) {
		throw new Error('Could not update assignments due to no response');
	}
	const json = await response.json();
	console.log(json);

	assignmentStore.set(json.map((assignmentInfo) => new Assignment(assignmentInfo)));
	console.log('updated assignments');
}

export async function newDocument(name: string, open: boolean = true, isNote = false) {
	const response = await api.createDocument(name, isNote);
	if (!response) {
		throw new Error('Could not create document due to no response');
	}
	const json = await response.json();
	const newDoc = new DocumentInfo(json);

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
			name: name == '' ? 'Unavngivet' : name,
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
	const newAssignment = new Assignment(json);

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
