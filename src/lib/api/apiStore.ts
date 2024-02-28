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

	constructor(info) {
		this.id = info.id;
		this.name = info.name;
		this.data = info.data;
		this.created_at = info.created_at;
		this.updated_at = info.updated_at;
	}
}

export class DocumentInfo extends FileInfo {
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

	constructor(info) {
		super(info);
		this.due_date = info.due_date;
		this.progress = AssignmentProgress[info.progress as keyof typeof AssignmentProgress];
	}
}

export async function updateFiles() {
	const api = getContext('api') as ApiHandler;

	const response = await api.getUserDocuments();
	if (!response) {
		throw new Error('Could not update files due to no response');
	}
	const userDocumentsJson = await response.json();
	console.log(userDocumentsJson);

	fileStore.set(userDocumentsJson);
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
export const fileStore = writable<FileInfo[]>([]);
export const assignmentStore = writable<Assignment[]>([]);

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
