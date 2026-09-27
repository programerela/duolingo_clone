import { View } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';

type Mood = 'happy' | 'thinking' | 'celebrate' | 'sleepy';

export function CatMascot({ size = 112, mood = 'happy' }: { size?: number; mood?: Mood }) {
  const { colors } = useTheme();
  const s = size;
  const eyeHeight = mood === 'sleepy' ? Math.max(2, s * 0.018) : s * 0.07;

  return (
    <View style={{ width: s, height: s * 1.03, alignItems: 'center', justifyContent: 'flex-end' }}>
      <View style={{ position: 'absolute', bottom: s * 0.015, width: s * 0.62, height: s * 0.07, borderRadius: s * 0.04, backgroundColor: colors.shadow, opacity: 0.16 }} />

      {/* tail */}
      <View style={{ position: 'absolute', right: s * 0.01, bottom: s * 0.16, width: s * 0.16, height: s * 0.42, borderRadius: s * 0.12, borderWidth: Math.max(5, s * 0.045), borderColor: colors.green, borderLeftColor: 'transparent', transform: [{ rotate: '22deg' }] }} />

      {/* small body makes the silhouette read as a cat instead of a bear */}
      <View style={{ position: 'absolute', bottom: s * 0.06, width: s * 0.56, height: s * 0.42, borderRadius: s * 0.2, backgroundColor: colors.green, borderBottomWidth: Math.max(4, s * 0.04), borderBottomColor: colors.greenPressed }} />
      <View style={{ position: 'absolute', bottom: s * 0.04, left: s * 0.24, width: s * 0.15, height: s * 0.12, borderRadius: s * 0.07, backgroundColor: colors.greenPressed }} />
      <View style={{ position: 'absolute', bottom: s * 0.04, right: s * 0.24, width: s * 0.15, height: s * 0.12, borderRadius: s * 0.07, backgroundColor: colors.greenPressed }} />

      {/* ears */}
      <View style={{ position: 'absolute', top: s * 0.02, left: s * 0.13, width: 0, height: 0, borderLeftWidth: s * 0.16, borderRightWidth: s * 0.04, borderBottomWidth: s * 0.31, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: colors.green, transform: [{ rotate: '-12deg' }] }} />
      <View style={{ position: 'absolute', top: s * 0.02, right: s * 0.13, width: 0, height: 0, borderLeftWidth: s * 0.04, borderRightWidth: s * 0.16, borderBottomWidth: s * 0.31, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: colors.green, transform: [{ rotate: '12deg' }] }} />
      <View style={{ position: 'absolute', top: s * 0.095, left: s * 0.22, width: 0, height: 0, borderLeftWidth: s * 0.08, borderRightWidth: s * 0.02, borderBottomWidth: s * 0.15, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: colors.purpleSoft, transform: [{ rotate: '-12deg' }] }} />
      <View style={{ position: 'absolute', top: s * 0.095, right: s * 0.22, width: 0, height: 0, borderLeftWidth: s * 0.02, borderRightWidth: s * 0.08, borderBottomWidth: s * 0.15, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: colors.purpleSoft, transform: [{ rotate: '12deg' }] }} />

      {/* head */}
      <View style={{ position: 'absolute', top: s * 0.16, width: s * 0.78, height: s * 0.57, borderRadius: s * 0.24, backgroundColor: colors.green, borderBottomWidth: Math.max(5, s * 0.045), borderBottomColor: colors.greenPressed, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap: s * 0.055, marginTop: s * 0.14 }}>
          {[0, 1].map((i) => (
            <View key={i} style={{ width: s * 0.16, height: s * 0.19, borderRadius: s * 0.08, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: s * 0.052, height: eyeHeight, borderRadius: s * 0.03, backgroundColor: colors.textDark }} />
            </View>
          ))}
        </View>
        <View style={{ width: s * 0.07, height: s * 0.05, borderRadius: s * 0.025, backgroundColor: '#263238', marginTop: s * 0.022, transform: [{ rotate: '45deg' }] }} />
        <View style={{ width: s * 0.19, height: s * 0.085, marginTop: s * 0.006, alignItems: 'center' }}>
          <View style={{ width: s * 0.095, height: s * 0.05, borderBottomWidth: 2.5, borderBottomColor: '#263238', borderRadius: s * 0.03, transform: [{ rotate: mood === 'thinking' ? '-8deg' : '7deg' }] }} />
        </View>
        <View style={{ position: 'absolute', left: s * 0.035, top: s * 0.36, width: s * 0.22, height: 1.5, backgroundColor: '#263238', transform: [{ rotate: '8deg' }] }} />
        <View style={{ position: 'absolute', left: s * 0.025, top: s * 0.41, width: s * 0.23, height: 1.5, backgroundColor: '#263238', transform: [{ rotate: '-5deg' }] }} />
        <View style={{ position: 'absolute', right: s * 0.035, top: s * 0.36, width: s * 0.22, height: 1.5, backgroundColor: '#263238', transform: [{ rotate: '-8deg' }] }} />
        <View style={{ position: 'absolute', right: s * 0.025, top: s * 0.41, width: s * 0.23, height: 1.5, backgroundColor: '#263238', transform: [{ rotate: '5deg' }] }} />
      </View>

      {mood === 'celebrate' && (
        <>
          <View style={{ position: 'absolute', right: -5, top: s * 0.05, width: 7, height: 22, borderRadius: 4, backgroundColor: colors.yellow, transform: [{ rotate: '26deg' }] }} />
          <View style={{ position: 'absolute', left: -4, top: s * 0.24, width: 7, height: 22, borderRadius: 4, backgroundColor: colors.blue, transform: [{ rotate: '-30deg' }] }} />
          <View style={{ position: 'absolute', right: s * 0.08, top: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.purple }} />
        </>
      )}
    </View>
  );
}
