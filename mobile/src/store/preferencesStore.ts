import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

const SOUND_KEY = 'lingocat_sound_enabled';

interface PreferencesState {
  hydrated: boolean;
  soundEnabled: boolean;
  hydrate: () => Promise<void>;
  setSoundEnabled: (enabled: boolean) => Promise<void>;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  hydrated: false,
  soundEnabled: true,

  hydrate: async () => {
    const saved = await SecureStore.getItemAsync(SOUND_KEY);
    set({
      hydrated: true,
      soundEnabled: saved === null ? true : saved === 'true',
    });
  },

  setSoundEnabled: async (enabled) => {
    set({ soundEnabled: enabled });
    await SecureStore.setItemAsync(SOUND_KEY, String(enabled));
  },
}));
