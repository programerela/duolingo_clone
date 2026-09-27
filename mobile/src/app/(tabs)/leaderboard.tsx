import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Screen } from '../../components/ui/Screen';
import { leaderboardApi } from '../../services/leaderboardApi';
import { colors } from '../../theme/colors';

export default function LeaderboardScreen() {
  const query = useQuery({ queryKey: ['leaderboard'], queryFn: leaderboardApi.weekly });

  if (query.isLoading) {
    return <Screen edges={['top', 'left', 'right']} style={styles.center}><ActivityIndicator color={colors.yellow} size="large" /></Screen>;
  }

  return (
    <Screen edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={styles.heroBadge}>
          <Ionicons name="shield" size={55} color={colors.yellow} />
        </View>
        <Text style={styles.title}>Bronze League</Text>
        <Text style={styles.subtitle}>Earn XP to climb the weekly rankings</Text>
        <View style={styles.rule} />
        <View style={styles.list}>
          {query.data?.entries.length ? query.data.entries.map((entry) => (
            <View key={entry.userId} style={[styles.row, entry.isCurrentUser && styles.mine]}>
              <Text style={[styles.rank, entry.rank <= 3 && styles.topRank]}>{entry.rank}</Text>
              <View style={styles.avatar}><Text style={styles.avatarText}>🐱</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{entry.displayName || entry.username}</Text>
                <Text style={styles.league}>{entry.isCurrentUser ? 'You' : entry.league}</Text>
              </View>
              <View style={styles.xpWrap}>
                <Ionicons name="flash" size={15} color={colors.yellow} />
                <Text style={styles.xp}>{entry.xp}</Text>
              </View>
            </View>
          )) : (
            <View style={styles.emptyCard}>
              <Ionicons name="trophy-outline" size={42} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>Join the league</Text>
              <Text style={styles.empty}>Finish a lesson to earn XP and enter the leaderboard.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  screen: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 110, alignItems: 'center' },
  heroBadge: { width: 96, height: 96, borderRadius: 30, backgroundColor: '#3C3210', borderWidth: 2, borderColor: colors.yellowPressed, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '900', marginTop: 16 },
  subtitle: { color: colors.textSecondary, fontWeight: '700', textAlign: 'center', marginTop: 6 },
  rule: { height: 2, backgroundColor: colors.border, width: '100%', marginTop: 24 },
  list: { width: '100%', marginTop: 12 },
  row: { minHeight: 68, borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11, gap: 10, marginBottom: 4 },
  mine: { backgroundColor: colors.blueSoft, borderWidth: 2, borderColor: '#245B75' },
  rank: { color: colors.textSecondary, width: 27, textAlign: 'center', fontWeight: '900', fontSize: 16 },
  topRank: { color: colors.yellow },
  avatar: { width: 44, height: 44, borderRadius: 16, backgroundColor: colors.surfaceRaised, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 23 },
  name: { color: colors.textPrimary, fontWeight: '900', fontSize: 15 },
  league: { color: colors.textSecondary, fontSize: 11, fontWeight: '700', marginTop: 2 },
  xpWrap: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  xp: { color: colors.textSecondary, fontWeight: '900' },
  emptyCard: { alignItems: 'center', borderWidth: 2, borderColor: colors.border, borderRadius: 18, backgroundColor: colors.surface, padding: 24, marginTop: 14 },
  emptyTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '900', marginTop: 10 },
  empty: { color: colors.textSecondary, textAlign: 'center', lineHeight: 20, fontWeight: '600', marginTop: 6 },
});
