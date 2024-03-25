import { get, writable } from 'svelte/store';
import api from '.';
import type { UserInfo } from '../../authStore';

export class FileInfo {
	id: string;
	name: string;
	data: { type: string; data: [] };
	created_at: string;
	updated_at: string;

	fileType: string = 'document';

	constructor(info) {
		this.fileType = 'document';
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

	delete() {
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
		this.isPublic = info.isPublic;
		this.teacherId = info.teacherId;
	}
}

export class AssignmentAnswer extends Assignment {
	progress: AssignmentProgress;
	answer_id: string;

	fileType = 'assignments';

	constructor(info) {
		super(info);
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

function getUserName(state: UserInfo): string {
	if (!state.sub) return '';
	const name =
		state.given_name === '' ? state.preferred_username.split(/[@.]/)[0] : state.given_name;
	if (typeof name === 'string') {
		return name;
	} else {
		return 'User';
	}
}
export function updateUserInfo(state: UserInfo) {
	userInfo.set({ name: getUserName(state) });
}

// Explicitly specify the type of the store
export const documentStore = writable<DocumentInfo[]>([]);
export const assignmentStore = writable<AssignmentAnswer[]>([]);

export const currentFile = writable<FileInfo>(null);

interface userInfo {
	name: string;
}
export const userInfo = writable<userInfo>();

export async function updateAssignmentsAnswers() {
	const response = await api.getAssignmentAnswers();
	if (!response) {
		throw new Error('Could not update assignments due to no response');
	}
	const json = await response.json();

	assignmentStore.set(json.map((assignmentInfo) => new AssignmentAnswer(assignmentInfo)));
	console.log('updated assignments', get(assignmentStore));
}

export const apiDownStore = writable<boolean>(false);
