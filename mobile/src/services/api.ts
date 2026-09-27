import axios from 'axios';
import { config } from '../constants/config';
import { tokenStorage } from './tokenStorage';

export const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 12_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (request) => {
  const token = await tokenStorage.getAccessToken();
  if (token) request.headers.Authorization = `Bearer ${token}`;
  return request;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error?.config as (typeof error.config & { _retry?: boolean }) | undefined;
    const status = error?.response?.status;

    if (
      status === 401 &&
      request &&
      !request._retry &&
      !String(request.url ?? '').includes('/auth/refresh')
    ) {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (refreshToken) {
        request._retry = true;
        try {
          const { data } = await axios.post<{
            accessToken: string;
            refreshToken: string;
          }>(`${config.apiUrl}/auth/refresh`, { refreshToken });

          await tokenStorage.save(data.accessToken, data.refreshToken);
          (request.headers as any).Authorization = `Bearer ${data.accessToken}`;
          return api(request);
        } catch {
          await tokenStorage.clear();
        }
      }
    }

    const message =
      error?.response?.data?.error ??
      error?.message ??
      'Something went wrong';

    return Promise.reject(new Error(message));
  }
);
