import { useState } from 'react';
import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PageHeader } from '../../components/navigation/PageHeader';
import { CatMascot } from '../../components/mascot/CatMascot';
import { DuoButton } from '../../components/ui/DuoButton';
import { DuoInput } from '../../components/ui/DuoInput';
import { Screen } from '../../components/ui/Screen';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../theme/colors';

export default function RegisterScreen() {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading, error, clearError } = useAuthStore();

  const valid = username.trim().length >= 3 && email.includes('@') && password.length >= 8;

  const submit = async () => {
    clearError();
    try {
      await register({
        displayName: displayName.trim() || undefined,
        username: username.trim(),
        email: email.trim(),
        password,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Belgrade',
      });
      router.replace('/learn');
    } catch {}
  };

  return (
    <Screen>
      <PageHeader title="Create profile" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <CatMascot size={86} mood="happy" />
          <Text style={styles.title}>Create your profile</Text>
          <Text style={styles.subtitle}>Save your progress, XP, streak, and courses.</Text>

          <View style={styles.form}>
            <DuoInput value={displayName} onChangeText={setDisplayName} placeholder="Name (optional)" />
            <DuoInput value={username} onChangeText={setUsername} placeholder="Username" autoCapitalize="none" autoCorrect={false} />
            <DuoInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" autoCorrect={false} keyboardType="email-address" />
            <DuoInput value={password} onChangeText={setPassword} placeholder="Password (8+ characters)" secureTextEntry />
            {!!error && <Text style={styles.error}>{error}</Text>}
            <DuoButton title="Create account" loading={loading} disabled={!valid} onPress={submit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32, alignItems: 'center' },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '900', marginTop: 16 },
  subtitle: { color: colors.textSecondary, fontSize: 15, lineHeight: 21, fontWeight: '600', textAlign: 'center', marginTop: 7, maxWidth: 320 },
  form: { width: '100%', gap: 12, marginTop: 25 },
  error: { color: colors.red, fontWeight: '800', fontSize: 13 },
});
