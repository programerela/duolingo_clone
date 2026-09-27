import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../components/navigation/PageHeader';
import { SettingsRow } from '../components/settings/SettingsRow';
import { Screen } from '../components/ui/Screen';
import { profileApi } from '../services/profileApi';
import { useAuthStore } from '../store/authStore';
import { usePreferencesStore } from '../store/preferencesStore';
import { colors } from '../theme/colors';

export default function SettingsScreen() {
  const meQuery = useQuery({ queryKey: ['me'], queryFn: profileApi.me });
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();
  const soundEnabled = usePreferencesStore((state) => state.soundEnabled);
  const setSoundEnabled = usePreferencesStore((state) => state.setSoundEnabled);

  const doLogout = () => {
    Alert.alert('Log out?', 'You can log back in anytime.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          queryClient.clear();
          router.replace('/');
        },
      },
    ]);
  };

  const me = meQuery.data;

  return (
    <Screen>
      <PageHeader title="Settings" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.group}>
          <SettingsRow icon="person-circle" title="Profile" subtitle="Name, username and profile details" onPress={() => router.push('/edit-profile')} />
          <SettingsRow icon="at" title="Username" value={me?.username ? `@${me.username}` : ''} onPress={() => router.push('/edit-profile')} />
          <SettingsRow icon="mail" title="Email" value={me?.email ?? ''} />
          <SettingsRow icon="key" title="Password" subtitle="Change your password" onPress={() => router.push('/change-password')} last />
        </View>

        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <View style={styles.group}>
          <SettingsRow icon="volume-high" title="Sound effects" subtitle="Feedback, buttons and lesson sounds" toggle toggleValue={soundEnabled} onToggle={(next) => void setSoundEnabled(next)} />
          <SettingsRow icon="moon" title="Appearance" value="Dark" />
          <SettingsRow icon="language" title="Learning language" value={me?.activeCourse?.title ?? 'Choose'} onPress={() => router.replace('/learn')} last />
        </View>

        <Text style={styles.sectionLabel}>ABOUT</Text>
        <View style={styles.group}>
          <SettingsRow icon="information-circle" title="About Lingocat" subtitle="Duolingo-style HCI project" last />
        </View>

        <Text style={styles.sectionLabel}>ACCOUNT ACTIONS</Text>
        <View style={styles.group}>
          <SettingsRow icon="log-out" title="Log out" danger onPress={doLogout} />
          <SettingsRow icon="trash" title="Delete account" subtitle="Permanently removes your progress" danger onPress={() => router.push('/delete-account')} last />
        </View>

        <Text style={styles.version}>Lingocat · development build</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 36 },
  sectionLabel: { color: colors.textSecondary, fontWeight: '900', fontSize: 12, letterSpacing: 0.8, marginTop: 22, marginBottom: 9, marginLeft: 4 },
  group: { borderWidth: 2, borderColor: colors.border, borderRadius: 18, overflow: 'hidden', backgroundColor: colors.surface },
  version: { color: colors.textMuted, fontWeight: '600', fontSize: 11, textAlign: 'center', marginTop: 28 },
});
