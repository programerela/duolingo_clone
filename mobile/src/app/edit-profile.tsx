import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PageHeader } from '../components/navigation/PageHeader';
import { CatMascot } from '../components/mascot/CatMascot';
import { DuoButton } from '../components/ui/DuoButton';
import { DuoInput } from '../components/ui/DuoInput';
import { Screen } from '../components/ui/Screen';
import { profileApi } from '../services/profileApi';
import { colors } from '../theme/colors';
import { useSound } from '../providers/SoundProvider';

export default function EditProfileScreen() {
  const queryClient = useQueryClient();
  const { play } = useSound();
  const meQuery = useQuery({ queryKey: ['me'], queryFn: profileApi.me });
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!meQuery.data) return;
    setDisplayName(meQuery.data.displayName ?? '');
    setUsername(meQuery.data.username);
  }, [meQuery.data]);

  const mutation = useMutation({
    mutationFn: () => profileApi.update({
      displayName: displayName.trim() || null,
      username: username.trim(),
    }),
    onSuccess: async () => {
      play('correct');
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      router.back();
    },
  });

  if (meQuery.isLoading) {
    return <Screen style={styles.center}><ActivityIndicator color={colors.green} size="large" /></Screen>;
  }

  return (
    <Screen>
      <PageHeader title="Edit profile" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.avatarCard}>
            <CatMascot size={94} mood="happy" />
            <View style={{ flex: 1 }}>
              <Text style={styles.avatarTitle}>Your Lingocat profile</Text>
              <Text style={styles.avatarText}>Avatar customization can be expanded later; account details already save to the backend.</Text>
            </View>
          </View>

          <Text style={styles.label}>NAME</Text>
          <DuoInput value={displayName} onChangeText={setDisplayName} placeholder="Name" />
          <Text style={styles.label}>USERNAME</Text>
          <DuoInput value={username} onChangeText={setUsername} placeholder="Username" autoCapitalize="none" autoCorrect={false} />
          <Text style={styles.label}>EMAIL</Text>
          <View style={styles.readOnly}><Text style={styles.readOnlyText}>{meQuery.data?.email}</Text></View>
          <Text style={styles.hint}>Email editing is disabled in the current backend.</Text>

          {!!mutation.error && <Text style={styles.error}>{mutation.error instanceof Error ? mutation.error.message : 'Could not update profile'}</Text>}
          <DuoButton title="Save changes" disabled={username.trim().length < 3} loading={mutation.isPending} onPress={() => mutation.mutate()} style={{ marginTop: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20, paddingBottom: 36 },
  avatarCard: { flexDirection: 'row', alignItems: 'center', gap: 16, borderWidth: 2, borderColor: colors.border, borderRadius: 18, backgroundColor: colors.surface, padding: 16, marginBottom: 24 },
  avatarTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '900' },
  avatarText: { color: colors.textSecondary, fontSize: 12, lineHeight: 17, fontWeight: '600', marginTop: 4 },
  label: { color: colors.textSecondary, fontSize: 12, fontWeight: '900', letterSpacing: 0.8, marginBottom: 8, marginTop: 14 },
  readOnly: { minHeight: 56, borderWidth: 2, borderColor: colors.border, borderRadius: 16, backgroundColor: colors.surfaceSoft, justifyContent: 'center', paddingHorizontal: 16, opacity: 0.78 },
  readOnlyText: { color: colors.textSecondary, fontSize: 16, fontWeight: '600' },
  hint: { color: colors.textMuted, fontSize: 11, fontWeight: '600', marginTop: 7 },
  error: { color: colors.red, fontWeight: '800', marginTop: 14 },
});
