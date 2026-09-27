import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { CatMascot } from '../components/mascot/CatMascot';
import { DuoButton } from '../components/ui/DuoButton';
import { Screen } from '../components/ui/Screen';
import { colors } from '../theme/colors';

export default function WelcomeScreen() {
  return (
    <Screen style={styles.screen}>
      <View style={styles.brandRow}>
        <View style={styles.brandDot} />
        <Text style={styles.brand}>lingocat</Text>
      </View>

      <View style={styles.hero}>
        <CatMascot size={174} mood="happy" />
        <Text style={styles.title}>Learn a language,{`\n`}one win at a time.</Text>
        <Text style={styles.subtitle}>
          Short lessons, real progress, and a very persistent cat.
        </Text>
      </View>

      <View style={styles.actions}>
        <DuoButton title="Get started" onPress={() => router.push('/register')} />
        <DuoButton
          title="I already have an account"
          variant="outline"
          onPress={() => router.push('/login')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 16 },
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 42 },
  brandDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.green },
  brand: { color: colors.green, fontSize: 25, fontWeight: '900', letterSpacing: -0.7 },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 12 },
  title: { color: colors.textPrimary, fontSize: 30, lineHeight: 37, fontWeight: '900', textAlign: 'center', marginTop: 24, letterSpacing: -0.6 },
  subtitle: { color: colors.textSecondary, fontSize: 16, lineHeight: 23, fontWeight: '600', textAlign: 'center', maxWidth: 330, marginTop: 12 },
  actions: { gap: 13, paddingBottom: 6 },
});
