import { createClient } from './index';
import * as authService from '../../services/authService';
import { accessTokenService } from '../../services/accessTokenService';

export const httpClient = createClient();

httpClient.interceptors.request.use(req => {
  const accessToken = accessTokenService.get();

  if (accessToken) {
    // eslint-disable-next-line no-param-reassign, @typescript-eslint/dot-notation
    req.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return req;
});

httpClient.interceptors.response.use(
  res => res.data,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      throw error;
    }

    const { accessToken } = await authService.refresh();

    accessTokenService.save(accessToken);

    return httpClient.request(originalRequest);
  },
);

// #region When using axios API without Instance and interceptors:
// import axios, { AxiosRequestConfig } from 'axios';

// A promise resolved after a given delay:
// function wait(delay: number) {
//   return new Promise(resolve => {
//     setTimeout(resolve, delay);
//   });
// }

// Server API:
// const BASE_URL = process.env.REACT_APP_API_URL;

// type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

// function request<T>(
//   url: string,
//   method: RequestMethod = 'GET',
//   data: any = null, // we can send any data to the server
// ): Promise<T> {
//   const options: AxiosRequestConfig = {
//     baseURL: BASE_URL,
//     url,
//     method,
//     // withCredentials: true,
//     // responseType: 'json', // json(default), arraybuffer, text, stream
//   };

//   if (data) {
//     options.data = JSON.stringify(data);
//     options.headers = {
//       'Content-Type': 'application/json; charset=UTF-8',
//     };
//   }

//   return axios(options)
//     .then(response => {
//       // #region When use build-in 'fetch' method
//       // if (!response.ok) {
//       //   throw new Error(`${response.status} - ${response.statusText}`);
//       // }

//       // if (!response.headers.get('content-type')?.includes('application/json')) {
//       //   throw new Error('Content-type is not supported');
//       // }

//       // return response.json();
//       // #endregion

//       if (!response.headers['content-type']?.includes('application/json')) {
//         throw new Error('Content-type is not supported');
//       }

//       return response.data;
//     });
// }

// export const client = {
//   get: <T>(url: string) => request<T>(url),
//   post: <T>(url: string, data: any) => request<T>(url, 'POST', data),
//   patch: <T>(url: string, data: any) => request<T>(url, 'PATCH', data),
//   delete: <T>(url: string) => request<T>(url, 'DELETE'),
// };
// #endregion
