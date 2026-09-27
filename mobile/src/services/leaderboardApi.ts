import { api } from './api';

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  displayName: string | null;
  avatarKey: string | null;
  xp: number;
  league: string;
  isCurrentUser: boolean;
};

export const leaderboardApi = {
  async weekly() {
    const { data } = await api.get<{
      weekStart: string;
      entries: LeaderboardEntry[];
    }>('/leaderboard/weekly');
    return data;
  },
};
