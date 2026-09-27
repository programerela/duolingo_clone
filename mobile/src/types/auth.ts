export type UserStats = {
  xpTotal: number;
  streak: number;
  longestStreak: number;
  gems: number;
  energy: {
    current: number;
    max: number;
  };
  lessonsCompleted: number;
};

export type ActiveCourse = {
  id: string;
  title: string;
  flagKey: string | null;
};

export type Me = {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  timezone: string;
  avatarKey: string | null;
  createdAt: string;
  stats: UserStats;
  activeCourse: ActiveCourse | null;
};

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  timezone: string;
  createdAt?: string;
};

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};
