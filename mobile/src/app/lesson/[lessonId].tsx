import { useMemo, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AnswerOption } from '../../components/lesson/AnswerOption';
import { CatMascot } from '../../components/mascot/CatMascot';
import { DuoButton } from '../../components/ui/DuoButton';
import { Screen } from '../../components/ui/Screen';
import { lessonApi } from '../../services/lessonApi';
import { useSound } from '../../providers/SoundProvider';
import { colors } from '../../theme/colors';
import type { CheckAnswerResponse, SubmittedAnswer } from '../../types/lesson';

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const queryClient = useQueryClient();
  const { play } = useSound();
  const startedAt = useRef(Date.now());
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState<SubmittedAnswer[]>([]);
  const [feedback, setFeedback] = useState<CheckAnswerResponse | null>(null);
  const [completeResult, setCompleteResult] = useState<Awaited<ReturnType<typeof lessonApi.complete>> | null>(null);

  const lessonQuery = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => lessonApi.exercises(lessonId!),
    enabled: Boolean(lessonId),
  });

  const checkMutation = useMutation({
    mutationFn: ({ exerciseId, value }: { exerciseId: string; value: string }) => lessonApi.check(lessonId!, exerciseId, value),
    onSuccess: (result) => {
      setFeedback(result);
      play(result.correct ? 'correct' : 'wrong');
    },
  });

  const completeMutation = useMutation({
    mutationFn: (answers: SubmittedAnswer[]) => lessonApi.complete(
      lessonId!,
      answers,
      Math.max(0, Math.round((Date.now() - startedAt.current) / 1000))
    ),
    onSuccess: async (result) => {
      setCompleteResult(result);
      play('complete');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['me'] }),
        queryClient.invalidateQueries({ queryKey: ['path'] }),
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] }),
      ]);
    },
  });

  const exercises = lessonQuery.data?.exercises ?? [];
  const current = exercises[index];
  const progress = exercises.length ? (index + (feedback ? 1 : 0)) / exercises.length : 0;

  const options = useMemo(() => {
    if (!current) return [];
    if (current.type === 'MULTIPLE_CHOICE') return (current.metadata.options as string[] | undefined) ?? [];
    if (current.type === 'WORD_BANK') return (current.metadata.words as string[] | undefined) ?? [];
    return [];
  }, [current]);

  if (lessonQuery.isLoading) {
    return <Screen style={styles.center}><ActivityIndicator color={colors.green} size="large" /></Screen>;
  }

  if (lessonQuery.error || !current) {
    return (
      <Screen style={styles.center}>
        <CatMascot size={90} mood="thinking" />
        <Text style={styles.error}>{lessonQuery.error instanceof Error ? lessonQuery.error.message : 'Lesson could not be loaded.'}</Text>
        <DuoButton title="Go back" onPress={() => router.back()} style={{ width: '100%' }} />
      </Screen>
    );
  }

  if (completeResult) {
    return (
      <Screen style={styles.completeScreen}>
        <CatMascot size={150} mood="celebrate" />
        <Text style={styles.completeKicker}>BRILLIANT!</Text>
        <Text style={styles.completeTitle}>Lesson complete</Text>
        <View style={styles.resultRow}>
          <ResultCard label="TOTAL XP" value={`+${completeResult.xpEarned}`} icon="flash" color={colors.yellow} />
          <ResultCard label="ACCURACY" value={`${Math.round(completeResult.accuracy)}%`} icon="disc" color={colors.green} />
          <ResultCard label="STREAK" value={String(completeResult.streak)} icon="flame" color={colors.orange} />
        </View>
        <DuoButton title="Continue" onPress={() => router.replace('/learn')} style={{ width: '100%' }} />
      </Screen>
    );
  }

  const addWord = (word: string) => {
    if (feedback) return;
    setAnswer((old) => (old ? `${old} ${word}` : word));
    play('tap');
  };

  const check = () => {
    if (!answer.trim()) return;
    checkMutation.mutate({ exerciseId: current.id, value: answer.trim() });
  };

  const next = () => {
    const updated = [...submitted, { exerciseId: current.id, answer: answer.trim() }];
    setSubmitted(updated);
    setFeedback(null);
    setAnswer('');

    if (index === exercises.length - 1) completeMutation.mutate(updated);
    else setIndex((value) => value + 1);
  };

  const confirmExit = () => {
    Alert.alert(
      'Quit this lesson?',
      'Your progress in this lesson will be lost.',
      [
        { text: 'Keep learning', style: 'cancel' },
        { text: 'Quit', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  return (
    <Screen>
      <View style={styles.lessonHeader}>
        <Pressable hitSlop={12} onPress={confirmExit} style={styles.closeButton}>
          <Ionicons name="close" size={30} color={colors.textSecondary} />
        </Pressable>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.max(5, progress * 100)}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.instruction}>{current.instruction ?? 'Answer the question'}</Text>
        <Text style={styles.prompt}>{current.prompt}</Text>

        {current.type === 'MULTIPLE_CHOICE' && (
          <View style={styles.options}>
            {options.map((option, optionIndex) => (
              <AnswerOption
                key={option}
                label={option}
                index={optionIndex}
                selected={answer === option}
                disabled={Boolean(feedback)}
                onPress={() => setAnswer(option)}
              />
            ))}
          </View>
        )}

        {current.type === 'TYPE_ANSWER' && (
          <TextInput
            value={answer}
            onChangeText={setAnswer}
            editable={!feedback}
            multiline
            placeholder="Type your answer"
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.blue}
            style={styles.answerInput}
          />
        )}

        {current.type === 'WORD_BANK' && (
          <>
            <Pressable onPress={() => !feedback && setAnswer('')} style={styles.wordAnswer}>
              <Text style={answer ? styles.wordAnswerText : styles.wordPlaceholder}>
                {answer || 'Tap words below to build the sentence'}
              </Text>
            </Pressable>
            <View style={styles.wordBank}>
              {options.map((word, i) => (
                <Pressable
                  key={`${word}-${i}`}
                  disabled={Boolean(feedback)}
                  onPress={() => addWord(word)}
                  style={({ pressed }) => [styles.word, pressed && !feedback && styles.wordPressed]}
                >
                  <Text style={styles.wordText}>{word}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {feedback ? (
        <View style={[styles.feedback, feedback.correct ? styles.feedbackCorrect : styles.feedbackWrong]}>
          <View style={styles.feedbackCopy}>
            <View style={[styles.feedbackIcon, { backgroundColor: feedback.correct ? colors.green : colors.red }]}>
              <Ionicons name={feedback.correct ? 'checkmark' : 'close'} size={26} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.feedbackTitle, { color: feedback.correct ? colors.green : colors.red }]}>
                {feedback.correct ? 'Great job!' : 'Correct answer:'}
              </Text>
              {!feedback.correct && <Text style={styles.correctAnswer}>{feedback.correctAnswer}</Text>}
            </View>
          </View>
          <DuoButton title={index === exercises.length - 1 ? 'Finish' : 'Continue'} onPress={next} loading={completeMutation.isPending} />
        </View>
      ) : (
        <View style={styles.bottom}>
          <DuoButton title="Check" disabled={!answer.trim()} loading={checkMutation.isPending} onPress={check} />
        </View>
      )}
    </Screen>
  );
}

function ResultCard({ label, value, icon, color }: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap; color: string }) {
  return (
    <View style={[styles.resultCard, { borderColor: color }]}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={[styles.resultLabel, { color }]}>{label}</Text>
      <Text style={styles.resultValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 20 },
  error: { color: colors.red, textAlign: 'center', fontWeight: '800', fontSize: 15 },
  lessonHeader: { minHeight: 68, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  closeButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  progressTrack: { flex: 1, height: 16, borderRadius: 9, backgroundColor: colors.border, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.green, borderRadius: 9 },
  content: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 34 },
  instruction: { color: colors.textPrimary, fontSize: 24, lineHeight: 31, fontWeight: '900', letterSpacing: -0.3 },
  prompt: { color: colors.textPrimary, fontSize: 20, fontWeight: '700', marginTop: 24, lineHeight: 29 },
  options: { gap: 12, marginTop: 28 },
  answerInput: { minHeight: 126, borderRadius: 16, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.border, backgroundColor: colors.surface, color: colors.textPrimary, fontSize: 18, fontWeight: '700', padding: 16, marginTop: 28, textAlignVertical: 'top' },
  wordAnswer: { minHeight: 96, borderBottomWidth: 2, borderBottomColor: colors.border, justifyContent: 'center', marginTop: 22 },
  wordAnswerText: { color: colors.textPrimary, fontSize: 18, fontWeight: '700', lineHeight: 28 },
  wordPlaceholder: { color: colors.textMuted, fontSize: 14, fontWeight: '600' },
  wordBank: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 26 },
  word: { borderWidth: 2, borderBottomWidth: 4, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.surface, paddingHorizontal: 14, paddingVertical: 10 },
  wordPressed: { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
  wordText: { color: colors.textPrimary, fontSize: 16, fontWeight: '800' },
  bottom: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 12, borderTopWidth: 2, borderTopColor: colors.border },
  feedback: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 12, gap: 15 },
  feedbackCorrect: { backgroundColor: colors.greenSoft },
  feedbackWrong: { backgroundColor: colors.redSoft },
  feedbackCopy: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  feedbackIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  feedbackTitle: { fontSize: 20, fontWeight: '900' },
  correctAnswer: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginTop: 3 },
  completeScreen: { paddingHorizontal: 22, paddingTop: 28, paddingBottom: 18, alignItems: 'center', justifyContent: 'center' },
  completeKicker: { color: colors.yellow, fontSize: 16, fontWeight: '900', marginTop: 20, letterSpacing: 1.1 },
  completeTitle: { color: colors.textPrimary, fontSize: 30, fontWeight: '900', marginTop: 5 },
  resultRow: { flexDirection: 'row', gap: 9, width: '100%', marginVertical: 32 },
  resultCard: { flex: 1, minHeight: 105, borderWidth: 2, borderBottomWidth: 4, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  resultLabel: { fontSize: 10, fontWeight: '900', marginTop: 5 },
  resultValue: { color: colors.textPrimary, fontSize: 21, fontWeight: '900', marginTop: 2 },
});
