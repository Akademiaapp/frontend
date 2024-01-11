import type { AuthorizerState } from "@authorizerdev/authorizer-svelte/types";
import { get, type Readable } from 'svelte/store';

export default class ApiHandler {
  static baseUrl = 'https://api.akademia.cc';
  static context: Readable<AuthorizerState>;
  constructor(context: Readable<AuthorizerState>) {
    ApiHandler.context = context
  }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callApi(endpoint: string, options?: any, method: string = 'GET') {
    const url = ApiHandler.baseUrl + endpoint;
    // Add bearer token to headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${get(ApiHandler.context)?.token?.access_token || ''}`,
    };

    return fetch(url + '?' + new URLSearchParams({
      ...options
    }), {
      method,
      headers
    })
  }

  getDocument(documentId: string) {
    return this.callApi('/documents/' + documentId)
  }

  getUserDocuments() {
    return this.callApi('/documents')
  }

  createDocument(documentName: string) {
    return this.callApi('/documents', {
      name: documentName,
      user_id: get(ApiHandler.context).user?.id,
    }, 'POST')
  }

  addUserToDocument(documentId: string, user_email: string) {
    return this.callApi('/documents/' + documentId + '/users', {
      user_email
    }, 'PUT')
  }

  renameDocument(documentId: string, documentName: string) {
    return this.callApi('/documents/' + documentId, {
      name: documentName
    }, 'PUT')
  }
}
