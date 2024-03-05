import { writable } from 'svelte/store';
import type ApiHandler from '.';
import type { AuthorizerState } from 'akademia-authorizer-svelte/types';
import { getContext } from 'svelte';

export class FileInfo {
	id: string;
	name: string;
	data: { type: string; data: [] };
	created_at: string;
	updated_at: string;

	fileType: string = 'documents';

	constructor(info) {
		this.id = info.id;
		this.name = info.name;
		this.data = info.data;
		this.created_at = info.created_at;
		this.updated_at = info.updated_at;
	}

	get path() {
		return `/documents/${this.fileType}.${this.id}`;
	}

	rename(newName: string, api: ApiHandler) {
		return this.updateInfo({ name: newName }, api);
	}

	delete(api: ApiHandler) {
		return api.callApi(this.path, {}, 'DELETE');
	}

	addUser(user_email: string, api: ApiHandler) {
		return api.callApi(
			this.path + '/users',
			{
				user_email
			},
			'PUT'
		);
	}

	// Gets the members of the file from the api
	getMembers(api: ApiHandler) {
		return api.callApi(this.path + '/users');
	}

	// Requests the api to update information
	updateInfo(info, api: ApiHandler) {
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
	NotStarted,
	InProgress,
	Submitted,
	Graded
}

export class Assignment extends FileInfo {
	due_date: string;
	progress: AssignmentProgress;

	fileType = 'assignments';

	constructor(info) {
		super(info);
		this.due_date = info.due_date;
		this.progress = AssignmentProgress[info.progress as keyof typeof AssignmentProgress];
	}
}

export async function updateDocuments() {
	const api = getContext('api') as ApiHandler;

	const response = await api.getUserDocuments();
	if (!response) {
		throw new Error('Could not update files due to no response');
	}
	const json = await response.json();
	console.log(json);

	documentStore.set(json.map((docuemntInfo) => new DocumentInfo(docuemntInfo)));
	console.log('updated files');
}

function getUserName(state: AuthorizerState): string {
	if (!state?.user) return '';
	const name =
		state.user?.given_name === ''
			? state.user?.preferred_username.split(/[@.]/)[0]
			: state.user?.given_name;
	if (typeof name === 'string') {
		return name;
	} else {
		return 'User';
	}
}
export function updateUserInfo(state: AuthorizerState) {
	userInfo.set({ name: getUserName(state) });
}

// Explicitly specify the type of the store
export const documentStore = writable<DocumentInfo[]>([]);
export const assignmentStore = writable<Assignment[]>([]);

export const currentFile = writable<FileInfo>(null);

interface userInfo {
	name: string;
}
export const userInfo = writable<userInfo>();

export async function updateAssignments() {
	const api = getContext('api') as ApiHandler;

	const response = await api.getAssignments();
	if (!response) {
		throw new Error('Could not update assignments due to no response');
	}
	const json = await response.json();

	assignmentStore.set(json.map((assignmentInfo) => new Assignment(assignmentInfo)));
	console.log('updated assignments', json);
}

export const apiDownStore = writable<boolean>(false);
