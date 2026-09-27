import { create } from 'zustand';
import { authApi } from '../services/authApi';
import { tokenStorage } from '../services/tokenStorage';
import type { AuthUser } from '../types/auth';

interface AuthState {
  user: AuthUser | null;
  hydrated: boolean;
  authenticated: boolean;
  loading: boolean;
  error: string | null;

  hydrate: () => Promise<void>;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (input: {
    email: string;
    username: string;
    displayName?: string;
    password: string;
    timezone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  clearLocalSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  hydrated: false,
  authenticated: false,
  loading: false,
  error: null,

  hydrate: async () => {
    const accessToken = await tokenStorage.getAccessToken();
    set({
      hydrated: true,
      authenticated: Boolean(accessToken),
      user: accessToken ? ({} as AuthUser) : null,
    });
  },

  login: async (emailOrUsername, password) => {
    set({ loading: true, error: null });
    try {
      const result = await authApi.login({ emailOrUsername, password });
      await tokenStorage.save(result.accessToken, result.refreshToken);
      set({ user: result.user, authenticated: true, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      });
      throw error;
    }
  },

  register: async (input) => {
    set({ loading: true, error: null });
    try {
      const result = await authApi.register(input);
      await tokenStorage.save(result.accessToken, result.refreshToken);
      set({ user: result.user, authenticated: true, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      });
      throw error;
    }
  },

  logout: async () => {
    const refreshToken = await tokenStorage.getRefreshToken();
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // Local logout still succeeds if the server token is already stale.
    } finally {
      await tokenStorage.clear();
      set({ user: null, authenticated: false, error: null });
    }
  },

  clearLocalSession: async () => {
    await tokenStorage.clear();
    set({ user: null, authenticated: false, error: null });
  },

  clearError: () => set({ error: null }),
}));
