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

	constructor(
		id: string,
		name: string,
		data: { type: string; data: [] },
		created_at: string,
		updated_at: string
	) {
		this.id = id;
		this.name = name;
		this.data = data;
		this.created_at = created_at;
		this.updated_at = updated_at;
	}
}

export class DocumentInfo extends FileInfo {
	constructor(
		id: string,
		name: string,
		data: { type: string; data: [] },
		created_at: string,
		updated_at: string
	) {
		super(id, name, data, created_at, updated_at);
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

	constructor(
		id: string,
		name: string,
		data: { type: string; data: [] },
		created_at: string,
		updated_at: string,
		due_date: string,
		progress: AssignmentProgress
	) {
		super(id, name, data, created_at, updated_at);
		this.due_date = due_date;
		this.progress = progress;
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
	const json = await response.json().map((it) => ({ ...it, type: 'Assignment' }));

	assignmentStore.set(
		json.map((it) => ({
			...it,
			type: 'Assignment'
		}))
	);
	console.log('updated assignments', json);
}

export const apiDownStore = writable<boolean>(false);
