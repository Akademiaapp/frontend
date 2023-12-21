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

  getDocument(documentName: string) {
    return this.callApi('/documents/' + documentName)
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

  addUserToDocument(documentName: string, user_id: string) {
    return this.callApi('/documents/' + documentName + '/users', {
      user_id
    }, 'PUT')
  }
}
