import type { AuthorizerState } from "@authorizerdev/authorizer-svelte/types";
import { get, type Readable } from 'svelte/store';

export default class ApiHandler {
  static baseUrl = 'https://api.akademia.cc';
  static context: Readable<AuthorizerState>;
  constructor(context: Readable<AuthorizerState>) {
    ApiHandler.context = context
  }

  getDocuments() {
    return this.callApi('/documents/Dansk')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callApi(endpoint: string, options?: any, method: string = 'GET') {
    const url = ApiHandler.baseUrl + endpoint;
    // Add bearer token to headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${get(ApiHandler.context)?.token || ''}`,
    };

    return fetch(url, {
      method,
      ...options,
      headers,
    })
  }
}
