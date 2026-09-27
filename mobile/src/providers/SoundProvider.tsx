import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { usePreferencesStore } from '../store/preferencesStore';

type SoundName = 'tap' | 'correct' | 'wrong' | 'complete';

type SoundContextValue = {
  play: (name: SoundName) => void;
};

const SoundContext = createContext<SoundContextValue>({ play: () => {} });

export function SoundProvider({ children }: PropsWithChildren) {
  const soundEnabled = usePreferencesStore((state) => state.soundEnabled);
  const tap = useAudioPlayer(require('../sounds/tap.wav'));
  const correct = useAudioPlayer(require('../sounds/correct.wav'));
  const wrong = useAudioPlayer(require('../sounds/wrong.wav'));
  const complete = useAudioPlayer(require('../sounds/complete.wav'));

  const value = useMemo<SoundContextValue>(() => ({
    play(name) {
      if (!soundEnabled) return;
      const player = { tap, correct, wrong, complete }[name];
      void player.seekTo(0).then(() => player.play()).catch(() => {});
    },
  }), [complete, correct, soundEnabled, tap, wrong]);

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  return useContext(SoundContext);
}
