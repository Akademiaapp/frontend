import { get, writable } from 'svelte/store';
import api from '.';
import { goto } from '$app/navigation';

export class FileInfo {
	id: string;
	name: string;
	data: { type: string; data: [] };
	created_at: string;
	updated_at: string;

	fileType: string = 'document';

	constructor(info) {
		this.id = `${this.fileType}.${info.id}`;
		this.name = info.name;
		this.data = info.data;
		this.created_at = info.created_at;
		this.updated_at = info.updated_at;
	}

	get path() {
		return `/documents/${this.id}`;
	}

	rename = api.debounce((newName: string) => {
		return this.updateInfo({ name: newName });
	});

	open() {
		currentFile.set(this);
		goto(`/workspace/editor?id=${this.id}`);
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
	getMembers() {
		return api.callApi(this.path + '/users');
	}

	// Requests the api to update information
	updateInfo(info) {
		return api.callApi(this.path, info, 'PUT');
	}
}

export class DocumentInfo extends FileInfo {
	fileType = 'document';

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

	fileType = 'assignments';

	constructor(info) {
		super(info);
		this.due_date = info.due_date;
		this.assignment_answers = info.assignment_answers;
		this.asigned_groups_ids = info.asigned_groups_ids;
		this.isPublic = info.isPublic;
		this.teacherId = info.teacherId;
	}
}

export class AssignmentAnswer extends Assignment {
	progress: AssignmentProgress;
	answer_id: string;

	fileType = 'assignmentAnswer';

	constructor(info) {
		super(info);
		this.id = `${this.fileType}.${info.id}`;
		this.due_date = info.due_date;
		this.answer_id = info.answer_id;
		this.progress = AssignmentProgress[info.status as keyof typeof AssignmentProgress];
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

export async function newDocument(name: string, open: boolean = true) {
	const response = await api.createDocument(name);
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

export const apiDownStore = writable<boolean>(false);
