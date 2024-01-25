import { writable } from 'svelte/store';
import type ApiHandler from '.';
import type { AuthorizerState } from 'akademia-authorizer-svelte/types';

export interface FileInfo {
	user_id: string;
	name: string;
	data: { type: string; data: [] };
	created_at: string;
	updated_at: string;
	id: string;
}

export async function updateFiles(api: ApiHandler) {
	const userDocuments = await api.getUserDocuments();

	fileStore.set(await userDocuments.json());
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

interface userInfo {
	name: string;
}
export const userInfo = writable<userInfo>();
