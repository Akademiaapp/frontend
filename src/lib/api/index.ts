
export default class ApiHandler {
  static baseUrl = 'https://api.akademia.cc';
  static token: string;
  constructor(token: string) {
    ApiHandler.token = token;
  }

  getDocuments() {
    return this.callApi('/documents')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callApi(endpoint: string, options?: any, method: string = 'GET') {
    const url = ApiHandler.baseUrl + endpoint;
    // Add bearer token to headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      'Authorization': `Bearer ${ApiHandler.token}`,
    };

    return fetch(url, {
      method,
      ...options,
      headers,
    })
  }
}
