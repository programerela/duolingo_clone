import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';

type Mood = 'happy' | 'thinking' | 'celebrate' | 'sleepy';

export function CatMascot({ size = 112, mood = 'happy' }: { size?: number; mood?: Mood }) {
  const s = size;
  const eyeH = mood === 'sleepy' ? 2 : s * 0.105;

  return (
    <View style={[styles.stage, { width: s, height: s * 0.92 }]}>
      <View style={[styles.shadow, { width: s * 0.72, height: s * 0.12, borderRadius: s * 0.06 }]} />
      <View style={[styles.ear, styles.leftEar, { width: s * 0.27, height: s * 0.32, borderRadius: s * 0.07 }]} />
      <View style={[styles.ear, styles.rightEar, { width: s * 0.27, height: s * 0.32, borderRadius: s * 0.07 }]} />
      <View style={[styles.head, { width: s * 0.82, height: s * 0.7, borderRadius: s * 0.28, borderBottomWidth: Math.max(5, s * 0.055) }]}>
        <View style={styles.faceRow}>
          <View style={[styles.eyeWhite, { width: s * 0.21, height: s * 0.24, borderRadius: s * 0.1 }]}>
            <View style={[styles.eye, { width: s * 0.085, height: eyeH, borderRadius: s * 0.05 }]} />
          </View>
          <View style={[styles.eyeWhite, { width: s * 0.21, height: s * 0.24, borderRadius: s * 0.1 }]}>
            <View style={[styles.eye, { width: s * 0.085, height: eyeH, borderRadius: s * 0.05 }]} />
          </View>
        </View>
        <View style={[styles.muzzle, { width: s * 0.34, height: s * 0.18, borderRadius: s * 0.09 }]}>
          <View style={[styles.nose, { width: s * 0.07, height: s * 0.055, borderRadius: s * 0.03 }]} />
          <View style={[styles.mouth, mood === 'thinking' && styles.mouthThinking, { width: s * 0.13, height: s * 0.055, borderRadius: s * 0.04 }]} />
        </View>
        {mood === 'celebrate' && (
          <>
            <View style={[styles.spark, styles.sparkOne]} />
            <View style={[styles.spark, styles.sparkTwo]} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { alignItems: 'center', justifyContent: 'flex-end' },
  shadow: { position: 'absolute', bottom: 0, backgroundColor: '#0A1215', opacity: 0.35 },
  ear: { position: 'absolute', top: '4%', backgroundColor: colors.green, transform: [{ rotate: '45deg' }] },
  leftEar: { left: '13%' },
  rightEar: { right: '13%' },
  head: {
    backgroundColor: colors.green,
    borderBottomColor: colors.greenPressed,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  faceRow: { flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: '4%' },
  eyeWhite: { backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  eye: { backgroundColor: colors.textDark },
  muzzle: { backgroundColor: '#D9F5B7', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  nose: { backgroundColor: colors.textDark, marginBottom: 2 },
  mouth: { borderBottomWidth: 3, borderBottomColor: colors.textDark },
  mouthThinking: { borderBottomWidth: 0, backgroundColor: colors.textDark, height: 4 },
  spark: { position: 'absolute', width: 7, height: 18, borderRadius: 4, backgroundColor: colors.yellow },
  sparkOne: { right: -12, top: 8, transform: [{ rotate: '24deg' }] },
  sparkTwo: { left: -12, top: 25, transform: [{ rotate: '-32deg' }] },
});
