import type { PropsWithChildren } from 'react';
import { View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useTheme } from '../../providers/ThemeProvider';

export function Screen({ children, style, edges = ['top', 'right', 'bottom', 'left'] }: PropsWithChildren<{ style?: ViewStyle | ViewStyle[]; edges?: Edge[] }>) {
  const { colors } = useTheme();
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[{ flex: 1, backgroundColor: colors.background }, style]}>{children}</View>
    </SafeAreaView>
  );
}
