import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { useSound } from '../../providers/SoundProvider';

type Variant = 'green' | 'blue' | 'outline' | 'red';

export function DuoButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'green',
  style,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  style?: ViewStyle | ViewStyle[];
}) {
  const { play } = useSound();
  const palette = {
    green: { bg: colors.green, shadow: colors.greenPressed, text: colors.white },
    blue: { bg: colors.blue, shadow: colors.bluePressed, text: colors.white },
    red: { bg: colors.red, shadow: colors.redPressed, text: colors.white },
    outline: { bg: colors.transparent, shadow: colors.border, text: colors.blue },
  } as const;
  const p = palette[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={() => {
        play('tap');
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: p.bg,
          borderBottomColor: p.shadow,
          borderColor: variant === 'outline' ? colors.border : p.bg,
          borderWidth: variant === 'outline' ? 2 : 0,
          borderBottomWidth: pressed ? 0 : variant === 'outline' ? 4 : 5,
          transform: [{ translateY: pressed ? 4 : 0 }],
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={p.text} />
      ) : (
        <Text style={[styles.text, { color: p.text }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 15,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
