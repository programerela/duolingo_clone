export type ExerciseType =
  | 'MULTIPLE_CHOICE'
  | 'TYPE_ANSWER'
  | 'WORD_BANK'
  | 'MATCH_PAIRS'
  | 'LISTENING'
  | 'SELECT_IMAGE';

export type ExerciseMetadata = {
  options?: string[];
  words?: string[];
  [key: string]: unknown;
};

export type Exercise = {
  id: string;
  sortOrder: number;
  type: ExerciseType;
  instruction: string | null;
  prompt: string;
  metadata: ExerciseMetadata;
};

export type LessonExercisesResponse = {
  lesson: {
    id: string;
    title: string;
  };
  exercises: Exercise[];
};

export type CheckAnswerResponse = {
  exerciseId: string;
  correct: boolean;
  correctAnswer: string;
};

export type SubmittedAnswer = {
  exerciseId: string;
  answer: string;
};

export type LessonCompleteResponse = {
  xpEarned: number;
  accuracy: number;
  correctAnswers: number;
  totalQuestions: number;
  streak: number;
  longestStreak: number;
  energy: {
    current: number;
    max: number;
  };
  nextLessonUnlocked: boolean;
  nextLessonId: string | null;
};
