import { useQuery } from '@tanstack/react-query';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Screen } from '../../components/ui/Screen';
import { profileApi } from '../../services/profileApi';
import { colors } from '../../theme/colors';

export default function QuestsScreen() {
  const meQuery = useQuery({ queryKey: ['me'], queryFn: profileApi.me });
  const xp = meQuery.data?.stats.xpTotal ?? 0;
  const lessons = meQuery.data?.stats.lessonsCompleted ?? 0;
  const streak = meQuery.data?.stats.streak ?? 0;

  const quests = [
    { title: 'Earn 20 XP', value: Math.min(xp, 20), max: 20, icon: 'flash' as const, color: colors.yellow },
    { title: 'Complete 2 lessons', value: Math.min(lessons, 2), max: 2, icon: 'book' as const, color: colors.blue },
    { title: 'Keep your streak going', value: Math.min(streak, 1), max: 1, icon: 'flame' as const, color: colors.orange },
  ];

  return (
    <Screen edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Quests</Text>
        <Text style={styles.subtitle}>Today's goals</Text>

        <View style={styles.banner}>
          <View style={styles.bannerIcon}><Ionicons name="gift" size={30} color={colors.purple} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Daily reward</Text>
            <Text style={styles.bannerText}>Complete your quests to keep the momentum going.</Text>
          </View>
        </View>

        <View style={styles.list}>
          {quests.map((quest) => {
            const progress = quest.max ? quest.value / quest.max : 0;
            const done = progress >= 1;
            return (
              <View key={quest.title} style={styles.card}>
                <View style={[styles.iconWrap, { backgroundColor: `${quest.color}22` }]}>
                  <Ionicons name={done ? 'checkmark' : quest.icon} size={28} color={done ? colors.green : quest.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{quest.title}</Text>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${Math.max(5, progress * 100)}%`, backgroundColor: done ? colors.green : quest.color }]} />
                  </View>
                </View>
                <Text style={styles.progress}>{quest.value}/{quest.max}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.friendQuest}>
          <Ionicons name="people" size={31} color={colors.blue} />
          <View style={{ flex: 1 }}>
            <Text style={styles.friendTitle}>Friend Quests</Text>
            <Text style={styles.friendText}>Social quests are planned if there is time after the core clone is complete.</Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 110 },
  title: { color: colors.textPrimary, fontSize: 29, fontWeight: '900' },
  subtitle: { color: colors.textSecondary, fontSize: 15, fontWeight: '800', marginTop: 4 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 13, borderRadius: 18, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.border, backgroundColor: colors.surface, padding: 15, marginTop: 22 },
  bannerIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: '#38244A', alignItems: 'center', justifyContent: 'center' },
  bannerTitle: { color: colors.textPrimary, fontSize: 17, fontWeight: '900' },
  bannerText: { color: colors.textSecondary, fontSize: 12, lineHeight: 17, fontWeight: '600', marginTop: 3 },
  list: { gap: 11, marginTop: 22 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 13, borderWidth: 2, borderColor: colors.border, borderRadius: 17, padding: 14, backgroundColor: colors.surface },
  iconWrap: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: colors.textPrimary, fontWeight: '900', fontSize: 15 },
  progressTrack: { height: 12, borderRadius: 8, backgroundColor: colors.border, overflow: 'hidden', marginTop: 10 },
  progressFill: { height: '100%', borderRadius: 8 },
  progress: { color: colors.textSecondary, fontWeight: '900', fontSize: 12 },
  friendQuest: { flexDirection: 'row', alignItems: 'center', gap: 13, borderTopWidth: 2, borderColor: colors.border, marginTop: 26, paddingTop: 20 },
  friendTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '900' },
  friendText: { color: colors.textSecondary, fontSize: 12, lineHeight: 17, fontWeight: '600', marginTop: 3 },
});
