import { createContext, useContext, useEffect, useMemo, type PropsWithChildren } from 'react';
import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { usePreferencesStore } from '../store/preferencesStore';

type SoundName = 'tap' | 'correct' | 'wrong' | 'complete';
type SoundContextValue = { play: (name: SoundName) => void };
const SoundContext = createContext<SoundContextValue>({ play: () => {} });

export function SoundProvider({ children }: PropsWithChildren) {
  const soundEnabled = usePreferencesStore((state) => state.soundEnabled);
  const tap = useAudioPlayer(require('../assets/sounds/tap.wav'));
  const correct = useAudioPlayer(require('../assets/sounds/correct.wav'));
  const wrong = useAudioPlayer(require('../assets/sounds/wrong.wav'));
  const complete = useAudioPlayer(require('../assets/sounds/complete.wav'));

  useEffect(() => {
    [tap, correct, wrong, complete].forEach((p) => { p.volume = 1; });
  }, [tap, correct, wrong, complete]);

  const value = useMemo<SoundContextValue>(() => ({
    play(name) {
      if (name === 'tap') void Haptics.selectionAsync().catch(() => {});
      if (name === 'correct') void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      if (name === 'wrong') void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      if (name === 'complete') void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      if (!soundEnabled) return;
      const player = { tap, correct, wrong, complete }[name];
      void player.seekTo(0).then(() => player.play()).catch(() => {});
    },
  }), [complete, correct, soundEnabled, tap, wrong]);

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
export function useSound() { return useContext(SoundContext); }
