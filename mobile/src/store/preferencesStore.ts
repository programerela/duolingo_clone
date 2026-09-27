import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

const SOUND_KEY = 'lingocat_sound_enabled';
const APPEARANCE_KEY = 'lingocat_appearance';
const STREAK_REMINDER_KEY = 'lingocat_streak_reminder';
const PRACTICE_REMINDER_KEY = 'lingocat_practice_reminder';
const MOTIVATION_KEY = 'lingocat_motivation_messages';

export type Appearance = 'dark' | 'light';

interface PreferencesState {
  hydrated: boolean;
  soundEnabled: boolean;
  appearance: Appearance;
  streakReminder: boolean;
  practiceReminder: boolean;
  motivationMessages: boolean;
  hydrate: () => Promise<void>;
  setSoundEnabled: (enabled: boolean) => Promise<void>;
  setAppearance: (appearance: Appearance) => Promise<void>;
  setStreakReminder: (enabled: boolean) => Promise<void>;
  setPracticeReminder: (enabled: boolean) => Promise<void>;
  setMotivationMessages: (enabled: boolean) => Promise<void>;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  hydrated: false,
  soundEnabled: true,
  appearance: 'dark',
  streakReminder: true,
  practiceReminder: true,
  motivationMessages: true,
  hydrate: async () => {
    const [savedSound, savedAppearance, streakReminder, practiceReminder, motivationMessages] = await Promise.all([
      SecureStore.getItemAsync(SOUND_KEY),
      SecureStore.getItemAsync(APPEARANCE_KEY),
      SecureStore.getItemAsync(STREAK_REMINDER_KEY),
      SecureStore.getItemAsync(PRACTICE_REMINDER_KEY),
      SecureStore.getItemAsync(MOTIVATION_KEY),
    ]);
    set({
      hydrated: true,
      soundEnabled: savedSound === null ? true : savedSound === 'true',
      appearance: savedAppearance === 'light' ? 'light' : 'dark',
      streakReminder: streakReminder === null ? true : streakReminder === 'true',
      practiceReminder: practiceReminder === null ? true : practiceReminder === 'true',
      motivationMessages: motivationMessages === null ? true : motivationMessages === 'true',
    });
  },
  setSoundEnabled: async (enabled) => { set({ soundEnabled: enabled }); await SecureStore.setItemAsync(SOUND_KEY, String(enabled)); },
  setAppearance: async (appearance) => { set({ appearance }); await SecureStore.setItemAsync(APPEARANCE_KEY, appearance); },
  setStreakReminder: async (enabled) => { set({ streakReminder: enabled }); await SecureStore.setItemAsync(STREAK_REMINDER_KEY, String(enabled)); },
  setPracticeReminder: async (enabled) => { set({ practiceReminder: enabled }); await SecureStore.setItemAsync(PRACTICE_REMINDER_KEY, String(enabled)); },
  setMotivationMessages: async (enabled) => { set({ motivationMessages: enabled }); await SecureStore.setItemAsync(MOTIVATION_KEY, String(enabled)); },
}));
