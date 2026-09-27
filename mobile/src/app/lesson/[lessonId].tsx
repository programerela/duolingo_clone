import { useEffect, useMemo, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Speech from 'expo-speech';
import { AnswerOption } from '../../components/lesson/AnswerOption';
import { CatMascot } from '../../components/mascot/CatMascot';
import { DuoButton } from '../../components/ui/DuoButton';
import { Screen } from '../../components/ui/Screen';
import { lessonApi } from '../../services/lessonApi';
import { profileApi } from '../../services/profileApi';
import { useSound } from '../../providers/SoundProvider';
import { useTheme } from '../../providers/ThemeProvider';
import type { CheckAnswerResponse, SubmittedAnswer } from '../../types/lesson';
import { syncStreakWidget } from '../../native/streakWidget';

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const qc = useQueryClient();
  const { play } = useSound();
  const { colors } = useTheme();
  const startedAt = useRef(Date.now());
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState<SubmittedAnswer[]>([]);
  const [feedback, setFeedback] = useState<CheckAnswerResponse | null>(null);
  const [completeResult, setCompleteResult] = useState<Awaited<ReturnType<typeof lessonApi.complete>> | null>(null);

  const meQuery = useQuery({ queryKey: ['me'], queryFn: profileApi.me });
  const lessonQuery = useQuery({ queryKey: ['lesson', lessonId], queryFn: () => lessonApi.exercises(lessonId!), enabled: Boolean(lessonId) });
  const checkMutation = useMutation({
    mutationFn: ({ exerciseId, value }: { exerciseId: string; value: string }) => lessonApi.check(lessonId!, exerciseId, value),
    onSuccess: (result) => { setFeedback(result); play(result.correct ? 'correct' : 'wrong'); },
  });
  const completeMutation = useMutation({
    mutationFn: (answers: SubmittedAnswer[]) => lessonApi.complete(lessonId!, answers, Math.max(0, Math.round((Date.now() - startedAt.current) / 1000))),
    onSuccess: async (result) => {
      setCompleteResult(result);
      syncStreakWidget(result.streak);
      play('complete');
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['me'] }),
        qc.invalidateQueries({ queryKey: ['path'] }),
        qc.invalidateQueries({ queryKey: ['leaderboard'] }),
        qc.invalidateQueries({ queryKey: ['shop'] }),
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
  const locale = meQuery.data?.activeCourse?.flagKey === 'france' ? 'fr-FR' : 'es-ES';

  useEffect(() => () => { void Speech.stop(); }, []);
  const speak = (text: string) => {
    void Speech.stop().finally(() => Speech.speak(text, { language: locale, rate: 0.82, pitch: 1.02 }));
  };
  const targetText = current?.type === 'MULTIPLE_CHOICE' ? current.prompt : feedback?.correctAnswer;

  if (lessonQuery.isLoading) return <Screen style={{ alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colors.green} size="large" /></Screen>;
  if (lessonQuery.error || !current) return <Screen style={{ alignItems: 'center', justifyContent: 'center', padding: 24, gap: 20 }}><CatMascot size={90} mood="thinking" /><Text style={{ color: colors.red, textAlign: 'center', fontWeight: '800', fontSize: 15 }}>{lessonQuery.error instanceof Error ? lessonQuery.error.message : 'Lesson could not be loaded.'}</Text><DuoButton title="Go back" onPress={() => router.back()} style={{ width: '100%' }} /></Screen>;

  if (completeResult) {
    return (
      <Screen style={{ paddingHorizontal: 22, paddingTop: 20, paddingBottom: 18, alignItems: 'center', justifyContent: 'center' }}>
        <CatMascot size={144} mood="celebrate" />
        <Text style={{ color: colors.yellow, fontSize: 15, fontWeight: '900', marginTop: 18, letterSpacing: 1.2 }}>LESSON COMPLETE</Text>
        <Text style={{ color: colors.textPrimary, fontSize: 30, fontWeight: '900', marginTop: 5 }}>Excellent work!</Text>
        <View style={{ flexDirection: 'row', gap: 9, width: '100%', marginTop: 28 }}>
          <ResultCard label="TOTAL XP" value={`+${completeResult.xpEarned}`} icon="flash" color={colors.yellow} />
          <ResultCard label="ACCURACY" value={`${Math.round(completeResult.accuracy)}%`} icon="disc" color={colors.green} />
          <ResultCard label="STREAK" value={String(completeResult.streak)} icon="flame" color={colors.orange} />
        </View>
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.blue, backgroundColor: colors.blueSoft, borderRadius: 17, padding: 14, marginTop: 14, marginBottom: 24 }}>
          <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' }}><Ionicons name="diamond" size={25} color={colors.white} /></View>
          <View style={{ flex: 1 }}><Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '900' }}>Lesson reward</Text><Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: '700', marginTop: 3 }}>{completeResult.gemsEarned >= 10 ? 'Accuracy bonus included' : 'Keep practicing for bonus gems'}</Text></View>
          <Text style={{ color: colors.blue, fontSize: 19, fontWeight: '900' }}>+{completeResult.gemsEarned}</Text>
        </View>
        <DuoButton title="Continue" onPress={() => router.replace('/learn')} style={{ width: '100%' }} />
      </Screen>
    );
  }

  const addWord = (word: string) => { if (!feedback) { setAnswer((old) => old ? `${old} ${word}` : word); play('tap'); } };
  const check = () => { if (answer.trim()) checkMutation.mutate({ exerciseId: current.id, value: answer.trim() }); };
  const next = () => {
    const updated = [...submitted, { exerciseId: current.id, answer: answer.trim() }];
    setSubmitted(updated); setFeedback(null); setAnswer('');
    if (index === exercises.length - 1) completeMutation.mutate(updated); else setIndex((v) => v + 1);
  };
  const confirmExit = () => Alert.alert('Quit this lesson?', 'Your progress in this lesson will be lost.', [{ text: 'Keep learning', style: 'cancel' }, { text: 'Quit', style: 'destructive', onPress: () => router.back() }]);

  return (
    <Screen>
      <View style={{ minHeight: 68, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Pressable hitSlop={12} onPress={confirmExit} style={{ width: 42, height: 42, alignItems: 'center', justifyContent: 'center' }}><Ionicons name="close" size={30} color={colors.textSecondary} /></Pressable>
        <View style={{ flex: 1, height: 16, borderRadius: 9, backgroundColor: colors.border, overflow: 'hidden' }}><View style={{ height: '100%', backgroundColor: colors.green, borderRadius: 9, width: `${Math.max(5, progress * 100)}%` }} /></View>
        <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: '900' }}>{index + 1}/{exercises.length}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 18, paddingBottom: 34 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={{ color: colors.textPrimary, fontSize: 24, lineHeight: 31, fontWeight: '900', letterSpacing: -0.3 }}>{current.instruction ?? 'Answer the question'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 22 }}>
          <Text style={{ flex: 1, color: colors.textPrimary, fontSize: 21, fontWeight: '700', lineHeight: 30 }}>{current.prompt}</Text>
          {current.type === 'MULTIPLE_CHOICE' && (
            <Pressable onPress={() => speak(current.prompt)} style={({ pressed }) => ({ width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: pressed ? colors.blue : colors.blueSoft, borderWidth: 2, borderColor: colors.blue, transform: [{ translateY: pressed ? 2 : 0 }] })}>
              <Ionicons name="volume-high" size={25} color={colors.blue} />
            </Pressable>
          )}
        </View>

        {current.type === 'MULTIPLE_CHOICE' && <View style={{ gap: 12, marginTop: 28 }}>{options.map((option, i) => <AnswerOption key={option} label={option} index={i} selected={answer === option} disabled={Boolean(feedback)} onPress={() => setAnswer(option)} />)}</View>}
        {current.type === 'TYPE_ANSWER' && <TextInput value={answer} onChangeText={setAnswer} editable={!feedback} multiline placeholder="Type your answer" placeholderTextColor={colors.textMuted} selectionColor={colors.blue} style={{ minHeight: 126, borderRadius: 16, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.border, backgroundColor: colors.surface, color: colors.textPrimary, fontSize: 18, fontWeight: '700', padding: 16, marginTop: 28, textAlignVertical: 'top' }} />}
        {current.type === 'WORD_BANK' && <><Pressable onPress={() => !feedback && setAnswer('')} style={{ minHeight: 96, borderBottomWidth: 2, borderBottomColor: colors.border, justifyContent: 'center', marginTop: 22 }}><Text style={{ color: answer ? colors.textPrimary : colors.textMuted, fontSize: answer ? 18 : 14, fontWeight: answer ? '700' : '600', lineHeight: 28 }}>{answer || 'Tap words below to build the sentence'}</Text></Pressable><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 26 }}>{options.map((word, i) => <Pressable key={`${word}-${i}`} disabled={Boolean(feedback)} onPress={() => addWord(word)} style={({ pressed }) => ({ borderWidth: 2, borderBottomWidth: pressed && !feedback ? 2 : 4, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.surface, paddingHorizontal: 14, paddingVertical: 10, transform: [{ translateY: pressed && !feedback ? 2 : 0 }] })}><Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '800' }}>{word}</Text></Pressable>)}</View></>}
      </ScrollView>

      {feedback ? (
        <View style={{ paddingHorizontal: 18, paddingTop: 16, paddingBottom: 12, gap: 15, backgroundColor: feedback.correct ? colors.greenSoft : colors.redSoft }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: feedback.correct ? colors.green : colors.red }}><Ionicons name={feedback.correct ? 'checkmark' : 'close'} size={26} color={colors.white} /></View>
            <View style={{ flex: 1 }}><Text style={{ fontSize: 20, fontWeight: '900', color: feedback.correct ? colors.green : colors.red }}>{feedback.correct ? 'Great job!' : 'Correct answer:'}</Text>{!feedback.correct && <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginTop: 3 }}>{feedback.correctAnswer}</Text>}</View>
            {targetText && <Pressable onPress={() => speak(targetText)} style={({ pressed }) => ({ width: 48, height: 48, borderRadius: 15, backgroundColor: pressed ? colors.blueSoft : colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.border })}><Ionicons name="volume-high" size={24} color={colors.blue} /></Pressable>}
          </View>
          <DuoButton title={index === exercises.length - 1 ? 'Finish' : 'Continue'} onPress={next} loading={completeMutation.isPending} />
        </View>
      ) : (
        <View style={{ paddingHorizontal: 18, paddingTop: 16, paddingBottom: 12, borderTopWidth: 2, borderTopColor: colors.border }}><DuoButton title="Check" disabled={!answer.trim()} loading={checkMutation.isPending} onPress={check} /></View>
      )}
    </Screen>
  );

  function ResultCard({ label, value, icon, color }: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap; color: string }) {
    return <View style={{ flex: 1, minHeight: 105, borderWidth: 2, borderBottomWidth: 4, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderColor: color }}><Ionicons name={icon} size={24} color={color} /><Text style={{ fontSize: 10, fontWeight: '900', marginTop: 5, color }}>{label}</Text><Text style={{ color: colors.textPrimary, fontSize: 21, fontWeight: '900', marginTop: 2 }}>{value}</Text></View>;
  }
}
