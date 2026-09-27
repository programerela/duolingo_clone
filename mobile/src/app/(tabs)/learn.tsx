import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LessonNode } from '../../components/path/LessonNode';
import { CatMascot } from '../../components/mascot/CatMascot';
import { DuoButton } from '../../components/ui/DuoButton';
import { Screen } from '../../components/ui/Screen';
import { StatPill } from '../../components/ui/StatPill';
import { courseApi } from '../../services/courseApi';
import { profileApi } from '../../services/profileApi';
import { colors } from '../../theme/colors';
import { useSound } from '../../providers/SoundProvider';

function flagFor(code?: string | null) {
  if (code === 'spain') return '🇪🇸';
  if (code === 'france') return '🇫🇷';
  return '🌐';
}

export default function LearnScreen() {
  const queryClient = useQueryClient();
  const [courseModal, setCourseModal] = useState(false);
  const insets = useSafeAreaInsets();
  const { play } = useSound();

  const meQuery = useQuery({ queryKey: ['me'], queryFn: profileApi.me });
  const coursesQuery = useQuery({ queryKey: ['courses'], queryFn: courseApi.list });
  const activeCourse = meQuery.data?.activeCourse;

  const pathQuery = useQuery({
    queryKey: ['path', activeCourse?.id],
    queryFn: () => courseApi.path(activeCourse!.id),
    enabled: Boolean(activeCourse?.id),
  });

  const activateMutation = useMutation({
    mutationFn: courseApi.activate,
    onSuccess: async () => {
      play('correct');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['me'] }),
        queryClient.invalidateQueries({ queryKey: ['courses'] }),
        queryClient.invalidateQueries({ queryKey: ['path'] }),
      ]);
      setCourseModal(false);
    },
  });

  const allLessons = useMemo(
    () => pathQuery.data?.sections.flatMap((section) => section.units.flatMap((unit) => unit.lessons)) ?? [],
    [pathQuery.data]
  );

  if (meQuery.isLoading || coursesQuery.isLoading) {
    return <Screen edges={['top', 'left', 'right']} style={styles.center}><ActivityIndicator color={colors.green} size="large" /></Screen>;
  }

  if (!activeCourse) {
    return (
      <Screen edges={['top', 'left', 'right']} style={styles.chooseScreen}>
        <View style={styles.chooseMascot}><CatMascot size={108} mood="thinking" /></View>
        <Text style={styles.chooseTitle}>What do you want to learn?</Text>
        <Text style={styles.chooseSubtitle}>Courses for English speakers</Text>
        <View style={styles.courseList}>
          {coursesQuery.data?.map((course) => (
            <Pressable
              key={course.id}
              style={({ pressed }) => [styles.courseCard, pressed && styles.coursePressed]}
              onPress={() => activateMutation.mutate(course.id)}
            >
              <Text style={styles.courseFlag}>{flagFor(course.flagKey)}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseSubtitle}>English → {course.targetLanguageName}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable onPress={() => setCourseModal(true)} style={styles.flagButton}>
          <Text style={styles.headerFlag}>{flagFor(activeCourse.flagKey)}</Text>
          <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
        </Pressable>
        <StatPill icon="flame" value={meQuery.data?.stats.streak ?? 0} color={colors.orange} />
        <StatPill icon="flash" value={meQuery.data?.stats.energy.current ?? 0} color={colors.blue} />
        <StatPill icon="diamond" value={meQuery.data?.stats.gems ?? 0} color={colors.blue} />
      </View>

      {pathQuery.isLoading ? (
        <View style={styles.center}><ActivityIndicator color={colors.green} size="large" /></View>
      ) : (
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 105 + insets.bottom }]} showsVerticalScrollIndicator={false}>
          {pathQuery.data?.sections.map((section) => (
            <View key={section.id}>
              <View style={styles.sectionCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionEyebrow}>{section.title.toUpperCase()}</Text>
                  <Text style={styles.sectionTitle}>{section.subtitle ?? 'Keep learning'}</Text>
                </View>
                <Ionicons name="book" size={30} color={colors.white} />
              </View>

              {section.units.map((unit) => (
                <View key={unit.id} style={styles.unit}>
                  <View style={styles.unitHeading}>
                    <Text style={styles.unitTitle}>{unit.title}</Text>
                    {!!unit.description && <Text style={styles.unitDescription}>{unit.description}</Text>}
                  </View>

                  {unit.lessons.map((lesson) => {
                    const globalIndex = allLessons.findIndex((item) => item.id === lesson.id);
                    const pattern = [0, -58, -82, -48, 12, 58, 80, 42];
                    const offset = pattern[globalIndex % pattern.length];
                    return (
                      <LessonNode
                        key={lesson.id}
                        lesson={lesson}
                        offset={offset}
                        onPress={() => router.push(`/lesson/${lesson.id}`)}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      <Modal visible={courseModal} transparent animationType="fade" onRequestClose={() => setCourseModal(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setCourseModal(false)}>
          <Pressable style={[styles.modalCard, { paddingBottom: Math.max(insets.bottom, 18) }]}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>My courses</Text>
            <Text style={styles.modalSubtitle}>Switching keeps each course's progress separate.</Text>
            {coursesQuery.data?.map((course) => (
              <Pressable
                key={course.id}
                style={[styles.modalCourse, course.isUserActive && styles.modalCourseActive]}
                onPress={() => activateMutation.mutate(course.id)}
              >
                <Text style={styles.courseFlag}>{flagFor(course.flagKey)}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseSubtitle}>{course.courseXp} XP</Text>
                </View>
                {course.isUserActive && <Ionicons name="checkmark-circle" size={26} color={colors.green} />}
              </Pressable>
            ))}
            <DuoButton title="Done" variant="outline" onPress={() => setCourseModal(false)} />
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  chooseScreen: { paddingHorizontal: 24, paddingTop: 12, justifyContent: 'center' },
  chooseMascot: { alignItems: 'center', marginBottom: 18 },
  chooseTitle: { color: colors.textPrimary, fontSize: 28, fontWeight: '900', textAlign: 'center' },
  chooseSubtitle: { color: colors.textSecondary, fontSize: 15, fontWeight: '700', textAlign: 'center', marginTop: 7 },
  courseList: { gap: 14, marginTop: 30 },
  courseCard: { flexDirection: 'row', alignItems: 'center', gap: 15, padding: 16, borderRadius: 18, borderWidth: 2, borderBottomWidth: 5, borderColor: colors.border, backgroundColor: colors.surface },
  coursePressed: { transform: [{ translateY: 3 }], borderBottomWidth: 2 },
  courseFlag: { fontSize: 36 },
  courseTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '900' },
  courseSubtitle: { color: colors.textSecondary, fontSize: 13, fontWeight: '600', marginTop: 3 },
  header: { minHeight: 62, borderBottomWidth: 2, borderBottomColor: colors.border, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.background },
  flagButton: { minWidth: 54, flexDirection: 'row', alignItems: 'center', gap: 1 },
  headerFlag: { fontSize: 29 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 18 },
  sectionCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.green, borderRadius: 17, borderBottomWidth: 5, borderBottomColor: colors.greenPressed, paddingHorizontal: 18, paddingVertical: 16, marginBottom: 26 },
  sectionEyebrow: { color: colors.white, fontSize: 12, fontWeight: '900', opacity: 0.92, letterSpacing: 0.5 },
  sectionTitle: { color: colors.white, fontSize: 19, lineHeight: 25, fontWeight: '900', marginTop: 4 },
  unit: { alignItems: 'center', marginBottom: 24 },
  unitHeading: { alignSelf: 'stretch', marginBottom: 5 },
  unitTitle: { color: colors.textPrimary, fontSize: 17, fontWeight: '900' },
  unitDescription: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, fontWeight: '600', marginTop: 3 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.68)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: colors.surfaceSoft, borderTopLeftRadius: 26, borderTopRightRadius: 26, borderWidth: 2, borderBottomWidth: 0, borderColor: colors.border, padding: 18, gap: 12 },
  modalHandle: { width: 42, height: 5, borderRadius: 3, backgroundColor: colors.borderLight, alignSelf: 'center', marginBottom: 4 },
  modalTitle: { color: colors.textPrimary, fontSize: 22, fontWeight: '900' },
  modalSubtitle: { color: colors.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 4 },
  modalCourse: { minHeight: 70, borderRadius: 16, borderWidth: 2, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 14, backgroundColor: colors.surface },
  modalCourseActive: { borderColor: colors.green, backgroundColor: colors.greenSoft },
});
