import { api } from './api';

export type ShopState = {
  gems: number;
  energy: { current: number; max: number };
  streakFreezes: number;
  prices: { energyRefill: number; streakFreeze: number };
};

export const shopApi = {
  async get() {
    const { data } = await api.get<ShopState>('/shop');
    return data;
  },
  async refillEnergy() {
    const { data } = await api.post<{
      message: string;
      gemsSpent: number;
      gems: number;
      energy: { current: number; max: number };
    }>('/shop/refill-energy');
    return data;
  },
  async buyStreakFreeze() {
    const { data } = await api.post<{
      message: string;
      gemsSpent: number;
      gems: number;
      streakFreezes: number;
    }>('/shop/streak-freeze');
    return data;
  },
};
