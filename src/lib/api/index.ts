// import { apiDownStore } from './apiStore';
import { keycloakState, keycloakUserInfo } from '../../authStore';
import { get } from 'svelte/store';
import { getApiUrl } from '@/utils';

class ApiHandler {
	static baseUrl = getApiUrl();

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
		console.log('calling api');
		const url = ApiHandler.baseUrl + endpoint;
		// Add bearer token to headers
		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${get(keycloakState).token}`
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
			console.log('hdhdhd');
			if (error.message.includes('Unauthorized - Token verification failed')) {
				location.reload();
			}
			// Handle CORS-related errors
			if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
				// apiDownStore.set(true);
				console.error('Failed to fetch:', error);
			} else {
				console.error('Other error:', error);
			}

			return undefined;
		});
	}

	getDocument = (documentId: string) => {
		return this.callApi('/documents/' + documentId);
	};

	// getDocumentJson = (documentId: string) => {
	// 	return '';
	// 	//return this.callApi('/documents/' + documentId + '/json');
	// };

	getUserDocuments = () => {
		return this.callApi('/documents');
	};

	createDocument = (documentName: string, isNote: boolean = false) => {
		return this.callApi(
			'/documents',
			{
				name: documentName,
				user_id: get(keycloakUserInfo).sub,
				isNote: isNote
			},
			'POST'
		);
	};
	getAssignmentAnswers = () => {
		return this.callApi('/assignmentAnswers');
	};
	getAssignments = () => {
		return this.callApi('/assignments');
	};

	// getAssignments = () => {
	// 	return this.callApi('/assignments');
	// };

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

	getSchools = () => {
		return this.callApi('/public/schools');
	};

	getSchoolClasses = (schoolId) => {
		return this.callApi('/public/schools/' + schoolId + '/groups');
	};

	getSchoolMembers = (schoolId) => {
		return this.callApi('/public/schools/' + schoolId + '/users');
	};

	getAssignmentAnswer = (assignmentId: string) => {
		return this.callApi('/assignmentAnswers/' + assignmentId);
	};

	deleteProfile = () => {
		return this.callApi('/users/self', {}, 'DELETE');
	};
}

export default new ApiHandler();
