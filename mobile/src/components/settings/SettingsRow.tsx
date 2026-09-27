import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../theme/colors';
import { useSound } from '../../providers/SoundProvider';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  last?: boolean;
};

export function SettingsRow({
  icon,
  title,
  subtitle,
  value,
  onPress,
  danger,
  toggle,
  toggleValue,
  onToggle,
  last,
}: Props) {
  const { play } = useSound();
  const contentColor = danger ? colors.red : colors.textPrimary;

  return (
    <Pressable
      disabled={!onPress && !toggle}
      onPress={() => {
        if (!onPress) return;
        play('tap');
        onPress();
      }}
      style={({ pressed }) => [styles.row, !last && styles.border, pressed && onPress && styles.pressed]}
    >
      <View style={[styles.iconWrap, danger && styles.iconDanger]}>
        <Ionicons name={icon} size={21} color={danger ? colors.red : colors.blue} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: contentColor }]}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {toggle ? (
        <Switch
          value={Boolean(toggleValue)}
          onValueChange={(next) => {
            play('tap');
            onToggle?.(next);
          }}
          trackColor={{ false: colors.border, true: colors.greenPressed }}
          thumbColor={toggleValue ? colors.green : colors.textSecondary}
        />
      ) : (
        <>
          {!!value && <Text numberOfLines={1} style={styles.value}>{value}</Text>}
          {!!onPress && <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
  },
  border: { borderBottomWidth: 1.5, borderBottomColor: colors.border },
  pressed: { backgroundColor: colors.surfaceRaised },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blueSoft,
  },
  iconDanger: { backgroundColor: colors.redSoft },
  copy: { flex: 1 },
  title: { fontSize: 16, fontWeight: '800' },
  subtitle: { color: colors.textSecondary, fontSize: 12, fontWeight: '600', marginTop: 3 },
  value: { maxWidth: 130, color: colors.textSecondary, fontSize: 13, fontWeight: '700', marginRight: 4 },
});
