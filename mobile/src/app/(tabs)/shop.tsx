import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Screen } from '../../components/ui/Screen';
import { shopApi } from '../../services/shopApi';
import { useTheme } from '../../providers/ThemeProvider';
import { useSound } from '../../providers/SoundProvider';

export default function ShopScreen() {
  const { colors } = useTheme();
  const { play } = useSound();
  const qc = useQueryClient();
  const shopQuery = useQuery({ queryKey: ['shop'], queryFn: shopApi.get });
  const shop = shopQuery.data;

  const refillMutation = useMutation({
    mutationFn: shopApi.refillEnergy,
    onSuccess: async () => { play('complete'); await Promise.all([qc.invalidateQueries({ queryKey: ['shop'] }), qc.invalidateQueries({ queryKey: ['me'] })]); },
    onError: (error) => Alert.alert('Could not refill energy', error instanceof Error ? error.message : 'Please try again.'),
  });
  const freezeMutation = useMutation({
    mutationFn: shopApi.buyStreakFreeze,
    onSuccess: async () => { play('complete'); await Promise.all([qc.invalidateQueries({ queryKey: ['shop'] }), qc.invalidateQueries({ queryKey: ['me'] })]); },
    onError: (error) => Alert.alert('Could not buy Streak Freeze', error instanceof Error ? error.message : 'Please try again.'),
  });

  const open = (title: string, description: string, icon = 'sparkles') => {
    play('tap'); router.push({ pathname: '/feature', params: { title, description, icon } });
  };
  const energyFull = shop ? shop.energy.current >= shop.energy.max : false;
  const canRefill = Boolean(shop && !energyFull && shop.gems >= shop.prices.energyRefill);
  const canFreeze = Boolean(shop && shop.gems >= shop.prices.streakFreeze);

  return (
    <Screen edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View><Text style={{ color: colors.textPrimary, fontSize: 29, fontWeight: '900' }}>Shop</Text><Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: '700', marginTop: 3 }}>Power up your learning</Text></View>
          <Pressable onPress={() => open('Gems', 'Earn gems from lessons and spend them on useful power-ups.', 'diamond')} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 2, borderColor: colors.border, borderRadius: 15, paddingHorizontal: 11, paddingVertical: 8, backgroundColor: pressed ? colors.surfaceRaised : colors.surface })}><Ionicons name="diamond" size={19} color={colors.blue} /><Text style={{ color: colors.blue, fontSize: 15, fontWeight: '900' }}>{shop?.gems ?? 0}</Text></Pressable>
        </View>

        <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '900', marginTop: 26, marginBottom: 12 }}>Energy</Text>
        <View style={{ borderWidth: 2, borderBottomWidth: 4, borderColor: colors.border, borderRadius: 22, backgroundColor: colors.surface, padding: 19 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={{ width: 86, height: 86, borderRadius: 27, backgroundColor: colors.blueSoft, alignItems: 'center', justifyContent: 'center' }}><Ionicons name="flash" size={50} color={colors.blue} /></View>
            <View style={{ flex: 1 }}><Text style={{ color: colors.textPrimary, fontSize: 21, fontWeight: '900' }}>{shop?.energy.current ?? 0}/{shop?.energy.max ?? 25}</Text><Text style={{ color: colors.textSecondary, fontSize: 12, lineHeight: 18, fontWeight: '600', marginTop: 4 }}>Wrong answers use energy. Refill when you need a fresh start.</Text></View>
          </View>
          <View style={{ height: 13, borderRadius: 8, backgroundColor: colors.border, overflow: 'hidden', marginTop: 18 }}><View style={{ height: '100%', width: `${shop ? Math.max(4, (shop.energy.current / shop.energy.max) * 100) : 4}%`, backgroundColor: colors.blue, borderRadius: 8 }} /></View>
          <Pressable disabled={energyFull || refillMutation.isPending} onPress={() => Alert.alert('Refill energy?', `Restore your energy to full for ${shop?.prices.energyRefill ?? 20} gems.`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Refill', onPress: () => refillMutation.mutate() }])} style={({ pressed }) => ({ marginTop: 17, minHeight: 49, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: energyFull ? colors.surfaceRaised : canRefill ? colors.blue : colors.surfaceRaised, borderBottomWidth: pressed && !energyFull ? 1 : 4, borderBottomColor: energyFull ? colors.border : canRefill ? colors.bluePressed : colors.border, transform: [{ translateY: pressed && !energyFull ? 3 : 0 }], opacity: refillMutation.isPending ? 0.6 : 1 })}><Text style={{ color: energyFull || !canRefill ? colors.textMuted : colors.white, fontSize: 14, fontWeight: '900' }}>{energyFull ? 'ENERGY FULL' : 'REFILL'}</Text>{!energyFull && <><Text style={{ color: canRefill ? colors.white : colors.textMuted, fontWeight: '900' }}>·</Text><Text style={{ color: canRefill ? colors.white : colors.textMuted, fontWeight: '900' }}>{shop?.prices.energyRefill ?? 20}</Text><Ionicons name="diamond" size={16} color={canRefill ? colors.white : colors.textMuted} /></>}</Pressable>
        </View>

        <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '900', marginTop: 27, marginBottom: 12 }}>Power-ups</Text>
        <Pressable onPress={() => canFreeze ? Alert.alert('Buy Streak Freeze?', `Protect one missed day for ${shop?.prices.streakFreeze ?? 30} gems.`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Buy', onPress: () => freezeMutation.mutate() }]) : open('Streak Freeze', 'Protect a day when life gets in the way.', 'snow')} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 13, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.border, borderRadius: 18, backgroundColor: pressed ? colors.surfaceRaised : colors.surface, padding: 15 })}>
          <View style={{ width: 55, height: 55, borderRadius: 17, backgroundColor: colors.blueSoft, alignItems: 'center', justifyContent: 'center' }}><Ionicons name="snow" size={31} color={colors.blue} /></View>
          <View style={{ flex: 1 }}><Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '900' }}>Streak Freeze</Text><Text style={{ color: colors.textSecondary, fontSize: 12, lineHeight: 17, fontWeight: '600', marginTop: 3 }}>{shop?.streakFreezes ?? 0} owned · protects one missed day</Text></View>
          <View style={{ alignItems: 'flex-end' }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Text style={{ color: canFreeze ? colors.blue : colors.textMuted, fontWeight: '900' }}>{shop?.prices.streakFreeze ?? 30}</Text><Ionicons name="diamond" size={16} color={canFreeze ? colors.blue : colors.textMuted} /></View><Text style={{ color: colors.textMuted, fontSize: 10, fontWeight: '800', marginTop: 4 }}>{canFreeze ? 'TAP TO BUY' : 'NEED MORE GEMS'}</Text></View>
        </Pressable>

        <Pressable onPress={() => open('Lingocat Plus', 'Practice without limits and unlock premium-style learning tools.', 'sparkles')} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 13, borderRadius: 19, backgroundColor: colors.purpleSoft, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.purple, padding: 16, marginTop: 16, opacity: pressed ? 0.78 : 1 })}><View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' }}><Ionicons name="sparkles" size={29} color={colors.white} /></View><View style={{ flex: 1 }}><Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '900' }}>Lingocat Plus</Text><Text style={{ color: colors.textSecondary, fontSize: 12, lineHeight: 17, fontWeight: '600', marginTop: 3 }}>Unlimited practice, premium review and extra insights.</Text></View><Ionicons name="chevron-forward" size={22} color={colors.purple} /></Pressable>

        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', marginTop: 26 }}><Ionicons name="information-circle" size={16} color={colors.textMuted} /><Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700' }}>Complete lessons to earn 5 gems, or 10 with 90%+ accuracy.</Text></View>
      </ScrollView>
    </Screen>
  );
}
