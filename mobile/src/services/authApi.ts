import { api } from './api';
import type { AuthResponse } from '../types/auth';

export const authApi = {
  async register(input: {
    email: string;
    username: string;
    displayName?: string;
    password: string;
    timezone?: string;
  }) {
    const { data } = await api.post<AuthResponse>('/auth/register', input);
    return data;
  },

  async login(input: { emailOrUsername: string; password: string }) {
    const { data } = await api.post<AuthResponse>('/auth/login', input);
    return data;
  },

  async refresh(refreshToken: string) {
    const { data } = await api.post<{
      accessToken: string;
      refreshToken: string;
    }>('/auth/refresh', { refreshToken });
    return data;
  },

  async logout(refreshToken: string) {
    const { data } = await api.post<{ message: string }>('/auth/logout', {
      refreshToken,
    });
    return data;
  },
};
