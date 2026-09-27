import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

export function Screen({
  children,
  style,
  edges = ['top', 'right', 'bottom', 'left'],
}: PropsWithChildren<{ style?: ViewStyle | ViewStyle[]; edges?: Edge[] }>) {
  return (
    <SafeAreaView edges={edges} style={styles.safe}>
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
});
