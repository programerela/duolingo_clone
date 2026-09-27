import { TextInput, type TextInputProps } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
export function DuoInput(props: TextInputProps) {
  const { colors } = useTheme();
  return <TextInput placeholderTextColor={colors.textMuted} selectionColor={colors.blue} {...props} style={[{
    minHeight: 56, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.border, borderRadius: 16, backgroundColor: colors.surface, color: colors.textPrimary, fontSize: 16, fontWeight: '600', paddingHorizontal: 16,
  }, props.style]} />;
}
