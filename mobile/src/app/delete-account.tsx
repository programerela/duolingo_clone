import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PageHeader } from '../components/navigation/PageHeader';
import { DuoButton } from '../components/ui/DuoButton';
import { DuoInput } from '../components/ui/DuoInput';
import { Screen } from '../components/ui/Screen';
import { profileApi } from '../services/profileApi';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/colors';

export default function DeleteAccountScreen() {
  const [password, setPassword] = useState('');
  const clearLocalSession = useAuthStore((state) => state.clearLocalSession);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => profileApi.deleteAccount(password),
    onSuccess: async () => {
      await clearLocalSession();
      queryClient.clear();
      router.replace('/');
    },
  });

  const submit = () => {
    Alert.alert('Delete account permanently?', 'Your XP, streak and course progress will be removed. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => mutation.mutate() },
    ]);
  };

  return (
    <Screen>
      <PageHeader title="Delete account" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.warningIcon}><Ionicons name="warning" size={38} color={colors.red} /></View>
          <Text style={styles.title}>This is permanent</Text>
          <Text style={styles.subtitle}>Deleting your account removes your profile, progress, lesson attempts, XP and streak data.</Text>
          <DuoInput value={password} onChangeText={setPassword} placeholder="Enter your password to confirm" secureTextEntry style={{ width: '100%' }} />
          {!!mutation.error && <Text style={styles.error}>{mutation.error instanceof Error ? mutation.error.message : 'Could not delete account'}</Text>}
          <DuoButton title="Delete my account" variant="red" disabled={!password} loading={mutation.isPending} onPress={submit} style={{ width: '100%' }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 22, paddingBottom: 36, alignItems: 'center' },
  warningIcon: { width: 76, height: 76, borderRadius: 24, backgroundColor: colors.redSoft, alignItems: 'center', justifyContent: 'center', marginTop: 26 },
  title: { color: colors.textPrimary, fontSize: 27, fontWeight: '900', marginTop: 20 },
  subtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 21, fontWeight: '600', textAlign: 'center', marginTop: 9, marginBottom: 28 },
  error: { color: colors.red, fontWeight: '800', alignSelf: 'stretch', marginTop: 12 },
});
