import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../theme/colors';
import { useSound } from '../../providers/SoundProvider';

export function AnswerOption({
  label,
  selected,
  disabled,
  onPress,
  index,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
  index?: number;
}) {
  const { play } = useSound();
  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        play('tap');
        onPress();
      }}
      style={({ pressed }) => [
        styles.option,
        selected && styles.selected,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {typeof index === 'number' && (
        <View style={[styles.key, selected && styles.keySelected]}>
          <Text style={[styles.keyText, selected && styles.selectedText]}>{index + 1}</Text>
        </View>
      )}
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
      {selected && <Ionicons name="checkmark" size={22} color={colors.blue} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    minHeight: 62,
    borderRadius: 16,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
  },
  selected: { borderColor: colors.blue, backgroundColor: colors.blueSoft },
  pressed: { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
  key: { width: 32, height: 32, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  keySelected: { borderColor: colors.blue },
  keyText: { color: colors.textSecondary, fontSize: 13, fontWeight: '900' },
  text: { flex: 1, color: colors.textPrimary, fontSize: 17, fontWeight: '700' },
  selectedText: { color: colors.blue },
});
