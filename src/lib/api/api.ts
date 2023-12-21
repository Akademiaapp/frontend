const baseUrl = 'https://api.akademia.cc';

	import { getContext } from 'svelte';
	import type { AuthorizerState } from '@authorizerdev/authorizer-svelte/types';
	import type { Readable } from 'svelte/store';

	let state: AuthorizerState;

	const store = <Readable<AuthorizerState>>getContext('authorizerContext');

	store.subscribe((data: AuthorizerState) => {
		state = data;
	});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function callApi(endpoint: string, options?: any, method: string = 'GET') {
  const url = baseUrl + endpoint;
  // Add bearer token to headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    Authorization: `Bearer ${state?.token?.access_token}`,
  };

  return fetch(url, {
    method,
    ...options,
    headers,
  })
}

export const getDocuments = () => {
  return callApi('/documents')
}
