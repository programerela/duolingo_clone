import { api } from './api';
import type {
  CheckAnswerResponse,
  LessonCompleteResponse,
  LessonExercisesResponse,
  SubmittedAnswer,
} from '../types/lesson';

export const lessonApi = {
  async exercises(lessonId: string) {
    const { data } = await api.get<LessonExercisesResponse>(
      `/lessons/${lessonId}/exercises`
    );
    return data;
  },

  async check(lessonId: string, exerciseId: string, answer: string) {
    const { data } = await api.post<CheckAnswerResponse>(
      `/lessons/${lessonId}/exercises/${exerciseId}/check`,
      { answer }
    );
    return data;
  },

  async complete(
    lessonId: string,
    answers: SubmittedAnswer[],
    durationSeconds: number
  ) {
    const { data } = await api.post<LessonCompleteResponse>(
      `/lessons/${lessonId}/complete`,
      { answers, durationSeconds }
    );
    return data;
  },
};
