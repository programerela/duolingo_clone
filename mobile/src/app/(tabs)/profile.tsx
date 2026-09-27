import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CatMascot } from '../../components/mascot/CatMascot';
import { Screen } from '../../components/ui/Screen';
import { profileApi } from '../../services/profileApi';
import { colors } from '../../theme/colors';
import { useSound } from '../../providers/SoundProvider';

export default function ProfileScreen() {
  const query = useQuery({ queryKey: ['me'], queryFn: profileApi.me });
  const me = query.data;
  const { play } = useSound();

  if (query.isLoading) {
    return <Screen edges={['top', 'left', 'right']} style={styles.center}><ActivityIndicator color={colors.green} size="large" /></Screen>;
  }

  const joined = me?.createdAt
    ? new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(me.createdAt))
    : '';

  return (
    <Screen edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Text style={styles.title}>Profile</Text>
          <Pressable
            hitSlop={12}
            onPress={() => {
              play('tap');
              router.push('/settings');
            }}
            style={({ pressed }) => [styles.settings, pressed && { opacity: 0.55 }]}
          >
            <Ionicons name="settings-sharp" size={25} color={colors.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.identity}>
          <CatMascot size={116} mood="happy" />
          <Text style={styles.name}>{me?.displayName || me?.username}</Text>
          <Text style={styles.username}>@{me?.username}</Text>
          {!!joined && <Text style={styles.joined}>Joined {joined}</Text>}
        </View>

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsGrid}>
          <Stat label="Day streak" value={me?.stats.streak ?? 0} icon="flame" color={colors.orange} />
          <Stat label="Total XP" value={me?.stats.xpTotal ?? 0} icon="flash" color={colors.yellow} />
          <Stat label="Longest streak" value={me?.stats.longestStreak ?? 0} icon="trophy" color={colors.yellow} />
          <Stat label="Lessons" value={me?.stats.lessonsCompleted ?? 0} icon="book" color={colors.blue} />
        </View>

        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementCard}>
          <View style={[styles.badge, { backgroundColor: colors.greenSoft }]}>
            <Ionicons name="flame" size={28} color={colors.green} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.achievementTitle}>Streak starter</Text>
            <Text style={styles.achievementText}>{me?.stats.streak ? `${me.stats.streak}-day streak in progress` : 'Complete a lesson today to start a streak'}</Text>
          </View>
        </View>
        <View style={styles.achievementCard}>
          <View style={[styles.badge, { backgroundColor: colors.blueSoft }]}>
            <Ionicons name="school" size={27} color={colors.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.achievementTitle}>Scholar</Text>
            <Text style={styles.achievementText}>{me?.stats.lessonsCompleted ?? 0} lessons completed</Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function Stat({ label, value, icon, color }: { label: string; value: number; icon: keyof typeof Ionicons.glyphMap; color: string }) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={25} color={color} />
      <View style={{ flex: 1 }}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  screen: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 110 },
  topRow: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '900' },
  settings: { width: 44, height: 44, borderRadius: 14, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  identity: { alignItems: 'center', marginTop: 18 },
  name: { color: colors.textPrimary, fontSize: 25, fontWeight: '900', marginTop: 13 },
  username: { color: colors.textSecondary, fontWeight: '700', marginTop: 4 },
  joined: { color: colors.textMuted, fontSize: 12, fontWeight: '600', marginTop: 6 },
  divider: { height: 2, backgroundColor: colors.border, marginTop: 28 },
  sectionTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: '900', marginTop: 28, marginBottom: 13 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 11 },
  statCard: { width: '48.4%', minHeight: 88, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.border, borderRadius: 16, padding: 13, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: 10 },
  statValue: { color: colors.textPrimary, fontSize: 20, fontWeight: '900' },
  statLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: '700', marginTop: 2 },
  achievementCard: { minHeight: 82, borderWidth: 2, borderColor: colors.border, borderRadius: 16, padding: 13, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 10 },
  badge: { width: 50, height: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  achievementTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '900' },
  achievementText: { color: colors.textSecondary, fontSize: 12, lineHeight: 17, fontWeight: '600', marginTop: 3 },
});
