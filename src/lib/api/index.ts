import type { AuthorizerState } from 'akademia-authorizer-svelte/types';
import { get, type Readable } from 'svelte/store';
import { apiDownStore } from './apiStore';

export default class ApiHandler {
	static baseUrl = 'https://akademia-api.arctix.dev';
	static context: Readable<AuthorizerState>;

	constructor(context: Readable<AuthorizerState>) {
		ApiHandler.context = context;
	}

	getContext = () => {
		return get(ApiHandler.context);
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	debounce(func: any, timeout = 300) {
		let timer: NodeJS.Timeout;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (...args: any) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				func.apply(this, args);
			}, timeout);
		};
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	callApi(endpoint: string, options?: any, method: string = 'GET') {
		const url = ApiHandler.baseUrl + endpoint;
		// Add bearer token to headers
		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${get(ApiHandler.context)?.token?.access_token || ''}`
		};

		return fetch(
			url +
				'?' +
				new URLSearchParams({
					...options
				}),
			{
				method,
				headers
			}
		).catch((error) => {
			// Handle CORS-related errors
			if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
				console.log('API seems to be down at the moment');
				apiDownStore.set(true);
			} else {
				console.error('Other error:', error);
			}

			return undefined;
		});
	}

	getDocument = (documentId: string) => {
		return this.callApi('/documents/' + documentId);
	};

	getDocumentJson = (documentId: string) => {
		return '';
		//return this.callApi('/documents/' + documentId + '/json');
	};

	getUserDocuments = () => {
		return this.callApi('/documents');
	};

	createDocument = (documentName: string) => {
		return this.callApi(
			'/documents',
			{
				name: documentName,
				user_id: get(ApiHandler.context).user?.id
			},
			'POST'
		);
	};
	getAssignments = () => {
		return this.callApi('/assignments');
	};

	createAssignment = (documentId: string, assignmentName: string, due_date: Date) => {
		return this.callApi(
			'/assignments',
			{
				document_id: documentId,
				name: assignmentName,
				due_date: due_date.toISOString()
			},
			'POST'
		);
	};
}
