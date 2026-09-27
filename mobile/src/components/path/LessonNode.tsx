import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../theme/colors';
import type { PathLesson } from '../../types/course';
import { useSound } from '../../providers/SoundProvider';

export function LessonNode({
  lesson,
  offset,
  onPress,
}: {
  lesson: PathLesson;
  offset: number;
  onPress: () => void;
}) {
  const { play } = useSound();
  const locked = lesson.status === 'LOCKED';
  const completed = lesson.status === 'COMPLETED';
  const bg = locked ? colors.surfaceRaised : colors.green;
  const shadow = locked ? '#223139' : colors.greenPressed;

  return (
    <View style={[styles.row, { transform: [{ translateX: offset }] }]}> 
      <Pressable
        disabled={locked}
        onPress={() => {
          play('tap');
          onPress();
        }}
        style={({ pressed }) => [
          styles.node,
          {
            backgroundColor: bg,
            borderBottomColor: shadow,
            borderBottomWidth: pressed ? 2 : 8,
            transform: [{ translateY: pressed ? 6 : 0 }],
          },
        ]}
      >
        <Ionicons
          name={locked ? 'lock-closed' : completed ? 'checkmark' : 'star'}
          size={34}
          color={locked ? colors.textMuted : colors.white}
        />
      </Pressable>
      <Text numberOfLines={2} style={[styles.title, locked && styles.locked]}>{lesson.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'center', marginVertical: 10 },
  node: { width: 78, height: 78, borderRadius: 39, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.textSecondary, fontSize: 12, fontWeight: '800', marginTop: 8, maxWidth: 132, textAlign: 'center' },
  locked: { opacity: 0.48 },
});
