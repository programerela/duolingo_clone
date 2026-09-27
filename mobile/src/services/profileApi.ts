import { api } from './api';
import type { Me } from '../types/auth';

export const profileApi = {
  async me() {
    const { data } = await api.get<Me>('/me');
    return data;
  },

  async profile() {
    const { data } = await api.get<Me>('/profile');
    return data;
  },

  async update(input: {
    displayName?: string | null;
    username?: string;
    timezone?: string;
    avatarKey?: string | null;
  }) {
    const { data } = await api.patch<{ message: string; profile: Me }>(
      '/profile',
      input
    );
    return data;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const { data } = await api.patch<{ message: string }>('/profile/password', {
      currentPassword,
      newPassword,
    });
    return data;
  },

  async deleteAccount(password: string) {
    await api.delete('/me', { data: { password } });
  },
};
