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

export default function LoginScreen() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, clearError } = useAuthStore();

  const submit = async () => {
    clearError();
    try {
      await login(emailOrUsername.trim(), password);
      router.replace('/learn');
    } catch {}
  };

  return (
    <Screen>
      <PageHeader title="Log in" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <CatMascot size={104} mood="happy" />
          <Text style={styles.title}>Welcome back!</Text>
          <Text style={styles.subtitle}>Your streak has been asking about you.</Text>

          <View style={styles.form}>
            <DuoInput
              value={emailOrUsername}
              onChangeText={setEmailOrUsername}
              placeholder="Email or username"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <DuoInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
              onSubmitEditing={submit}
            />
            {!!error && <Text style={styles.error}>{error}</Text>}
            <DuoButton
              title="Log in"
              loading={loading}
              disabled={!emailOrUsername.trim() || !password}
              onPress={submit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 34, paddingBottom: 30, alignItems: 'center' },
  title: { color: colors.textPrimary, fontSize: 29, fontWeight: '900', marginTop: 18 },
  subtitle: { color: colors.textSecondary, fontSize: 15, fontWeight: '600', textAlign: 'center', marginTop: 7 },
  form: { width: '100%', gap: 13, marginTop: 30 },
  error: { color: colors.red, fontWeight: '800', fontSize: 13, paddingHorizontal: 2 },
});
