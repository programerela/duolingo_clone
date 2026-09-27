import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';
import { darkColors, lightColors, type AppColors } from '../theme/colors';
import { usePreferencesStore } from '../store/preferencesStore';

type ThemeValue = { colors: AppColors; isDark: boolean };
const ThemeContext = createContext<ThemeValue>({ colors: darkColors, isDark: true });

export function ThemeProvider({ children }: PropsWithChildren) {
  const appearance = usePreferencesStore((s) => s.appearance);
  const value = useMemo(() => ({ colors: appearance === 'light' ? lightColors : darkColors, isDark: appearance !== 'light' }), [appearance]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
export function useTheme() { return useContext(ThemeContext); }
