import { useEffect } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { usePreferencesStore } from '../store/preferencesStore';
import { SoundProvider } from '../providers/SoundProvider';
import { ThemeProvider, useTheme } from '../providers/ThemeProvider';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 20_000 } } });

function NavigationGuard() {
  const segments = useSegments();
  const hydrated = useAuthStore((state) => state.hydrated);
  const authenticated = useAuthStore((state) => state.authenticated);
  useEffect(() => {
    if (!hydrated) return;
    const first = segments[0] as string | undefined;
    const inAuth = first === '(auth)';
    const inProtected = ['(tabs)', 'lesson', 'settings', 'edit-profile', 'change-password', 'delete-account', 'appearance', 'feature'].includes(first ?? '');
    if (!authenticated && inProtected) { router.replace('/'); return; }
    if (authenticated && (inAuth || !first)) router.replace('/learn');
  }, [authenticated, hydrated, segments]);
  return null;
}

function AppStack() {
  const { colors, isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background} />
      <NavigationGuard />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }, animation: 'slide_from_right' }} />
    </>
  );
}

export default function RootLayout() {
  const hydrateAuth = useAuthStore((state) => state.hydrate);
  const hydratePreferences = usePreferencesStore((state) => state.hydrate);
  useEffect(() => { void hydrateAuth(); void hydratePreferences(); }, [hydrateAuth, hydratePreferences]);
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <SoundProvider><AppStack /></SoundProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
