export type Course = {
  id: string;
  sourceLanguageCode: string;
  sourceLanguageName: string;
  targetLanguageCode: string;
  targetLanguageName: string;
  title: string;
  flagKey: string | null;
  joined: boolean;
  isUserActive: boolean;
  courseXp: number;
};

export type LessonStatus = 'LOCKED' | 'AVAILABLE' | 'COMPLETED';

export type PathLesson = {
  id: string;
  sortOrder: number;
  title: string;
  type: string;
  xpReward: number;
  status: LessonStatus;
  completionCount: number;
  bestAccuracy: number | null;
};

export type PathUnit = {
  id: string;
  sortOrder: number;
  title: string;
  description: string | null;
  lessons: PathLesson[];
};

export type PathSection = {
  id: string;
  sortOrder: number;
  title: string;
  subtitle: string | null;
  units: PathUnit[];
};

export type CoursePathResponse = {
  course: {
    id: string;
    title: string;
    sourceLanguage: string;
    targetLanguage: string;
    flagKey: string | null;
  };
  sections: PathSection[];
};
