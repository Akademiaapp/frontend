import type { AuthorizerState } from "@authorizerdev/authorizer-svelte/types";

export default class ApiHandler {
  static baseUrl = 'https://api.akademia.cc';
  static state: AuthorizerState;
  constructor(state: AuthorizerState) {
    ApiHandler.state = state;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callApi(endpoint: string, options?: any, method: string = 'GET') {
    const url = ApiHandler.baseUrl + endpoint;
    // Add bearer token to headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ApiHandler.state.token?.access_token}`,
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
      user_id: ApiHandler.state.user?.id,
    }, 'POST')
  }
}
