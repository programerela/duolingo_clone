import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../theme/colors';

export function StatPill({
  icon,
  value,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  color: string;
}) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={21} color={color} />
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { minWidth: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  value: { fontWeight: '900', fontSize: 15 },
});
