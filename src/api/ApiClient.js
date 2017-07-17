import axios from 'axios';

const methods = ['get', 'post', 'put', 'patch', 'del'];

export default class ApiClient {
  constructor() {
    methods.forEach(method => {
      this[method] = (path, { token, params = {} }) => {
        const headers = {
          Accept: 'application/vnd.github.v3+json',
          'Cache-Control': 'no-cache',
        };

        if (token) {
          headers.Authorization = `token ${token}`;
        }

        return axios({
          method,
          url: path,
          responseType: 'json',
          headers: {
            ...headers,
            ...params,
          },
        });
      };
    });
  }
}
