import { Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSound } from '../../providers/SoundProvider';
import { useTheme } from '../../providers/ThemeProvider';
export function StatPill({ icon, value, color, onPress }: { icon: keyof typeof Ionicons.glyphMap; value: string | number; color: string; onPress?: () => void }) {
  const { play } = useSound(); const { colors } = useTheme();
  const content = <><Ionicons name={icon} size={21} color={color} /><Text style={{ color, fontWeight: '900', fontSize: 15 }}>{value}</Text></>;
  if (!onPress) return <View style={{ minWidth: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>{content}</View>;
  return <Pressable onPress={() => { play('tap'); onPress(); }} style={({pressed}) => ({ minWidth: 58, minHeight: 38, flexDirection:'row', alignItems:'center', justifyContent:'center', gap:4, borderRadius:12, backgroundColor: pressed ? colors.surfaceRaised : colors.transparent })}>{content}</Pressable>;
}
