import { getAulaUrl } from '@/utils';
import { get, writable } from 'svelte/store';

export const loginInfo = writable(null);

const URL = getAulaUrl();

export async function logintoAula(username: string, password: string) {
	const payload = {
		username,
		password
	};

	const loginRes = await fetch(URL + 'login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	});

	loginInfo.set(await loginRes.json());
}

export async function fetchAula(endpoint: string, payload) {
	const res = await fetch(URL + endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ ...payload, login_info: get(loginInfo) })
	});

	return res;
}
