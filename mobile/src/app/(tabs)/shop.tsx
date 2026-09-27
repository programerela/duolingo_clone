import { useQuery } from '@tanstack/react-query';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Screen } from '../../components/ui/Screen';
import { profileApi } from '../../services/profileApi';
import { colors } from '../../theme/colors';

export default function ShopScreen() {
  const meQuery = useQuery({ queryKey: ['me'], queryFn: profileApi.me });
  const stats = meQuery.data?.stats;
  const energyFull = stats ? stats.energy.current >= stats.energy.max : false;

  return (
    <Screen edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Text style={styles.title}>Shop</Text>
          <View style={styles.gems}><Ionicons name="diamond" size={19} color={colors.blue} /><Text style={styles.gemText}>{stats?.gems ?? 0}</Text></View>
        </View>

        <Text style={styles.sectionTitle}>Energy</Text>
        <View style={styles.heroCard}>
          <View style={styles.energyArt}><Ionicons name="flash" size={58} color={colors.blue} /></View>
          <Text style={styles.cardTitle}>{stats?.energy.current ?? 0}/{stats?.energy.max ?? 25} energy</Text>
          <Text style={styles.description}>Energy keeps lesson mistakes meaningful and refills over time.</Text>
          <View style={[styles.shopButton, energyFull && styles.shopButtonDisabled]}>
            <Text style={[styles.shopButtonText, energyFull && styles.shopButtonTextDisabled]}>{energyFull ? 'FULL' : 'REFILL'}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Power-ups</Text>
        <View style={styles.itemCard}>
          <View style={styles.freezeIcon}><Ionicons name="snow" size={32} color={colors.blue} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>Streak Freeze</Text>
            <Text style={styles.itemText}>Protects your streak for one missed day.</Text>
          </View>
          <View style={styles.price}><Text style={styles.priceText}>200</Text><Ionicons name="diamond" size={16} color={colors.blue} /></View>
        </View>

        <View style={styles.superCard}>
          <Ionicons name="sparkles" size={34} color={colors.purple} />
          <View style={{ flex: 1 }}>
            <Text style={styles.superTitle}>Lingocat Plus</Text>
            <Text style={styles.superText}>Optional premium-style card kept visual-only for the project demo.</Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 110 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: colors.textPrimary, fontSize: 29, fontWeight: '900' },
  gems: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 2, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: colors.surface },
  gemText: { color: colors.blue, fontSize: 15, fontWeight: '900' },
  sectionTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: '900', marginTop: 25, marginBottom: 12 },
  heroCard: { alignItems: 'center', borderWidth: 2, borderBottomWidth: 4, borderColor: colors.border, borderRadius: 20, backgroundColor: colors.surface, padding: 20 },
  energyArt: { width: 100, height: 100, borderRadius: 32, backgroundColor: colors.blueSoft, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: '900', marginTop: 14 },
  description: { color: colors.textSecondary, textAlign: 'center', fontSize: 13, lineHeight: 19, fontWeight: '600', marginTop: 6, maxWidth: 290 },
  shopButton: { marginTop: 16, minWidth: 150, minHeight: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blue, borderBottomWidth: 4, borderBottomColor: colors.bluePressed },
  shopButtonDisabled: { backgroundColor: colors.surfaceRaised, borderBottomColor: colors.border },
  shopButtonText: { color: colors.white, fontSize: 14, fontWeight: '900' },
  shopButtonTextDisabled: { color: colors.textMuted },
  itemCard: { flexDirection: 'row', alignItems: 'center', gap: 13, borderWidth: 2, borderColor: colors.border, borderRadius: 18, backgroundColor: colors.surface, padding: 15 },
  freezeIcon: { width: 54, height: 54, borderRadius: 17, backgroundColor: colors.blueSoft, alignItems: 'center', justifyContent: 'center' },
  itemTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '900' },
  itemText: { color: colors.textSecondary, fontSize: 12, lineHeight: 17, fontWeight: '600', marginTop: 3 },
  price: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  priceText: { color: colors.blue, fontWeight: '900' },
  superCard: { flexDirection: 'row', alignItems: 'center', gap: 13, borderRadius: 18, backgroundColor: '#2B1D36', borderWidth: 2, borderColor: '#57356D', padding: 16, marginTop: 16 },
  superTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '900' },
  superText: { color: colors.textSecondary, fontSize: 12, lineHeight: 17, fontWeight: '600', marginTop: 3 },
});
