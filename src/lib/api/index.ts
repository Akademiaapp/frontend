import type { AuthorizerState } from 'akademia-authorizer-svelte/types';
import { get, type Readable } from 'svelte/store';

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
		let timer: number;
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
		);
	}

	getDocument = (documentId: string) => {
		return this.callApi('/documents/' + documentId);
	};

	getDocumentJson = (documentId: string) => {
		return this.callApi('/documents/' + documentId + '/json');
	}

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

	addUserToDocument = (documentId: string, user_email: string) => {
		return this.callApi(
			'/documents/' + documentId + '/users',
			{
				user_email
			},
			'PUT'
		);
	};

	renameDocument = this.debounce((documentId: string, documentName: string) => {
		this.callApi('/documents/' + documentId, { name: documentName }, 'PUT');
	}, 350);

	deleteDocument = (documentId: string) => {
		return this.callApi('/documents/' + documentId, {}, 'DELETE');
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

	// Get all users in a document
	getMembers = (documentId: string) => {
		return this.callApi('/documents/' + documentId + '/users');
	};
}
