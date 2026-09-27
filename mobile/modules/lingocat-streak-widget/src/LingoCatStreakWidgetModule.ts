import { requireOptionalNativeModule } from 'expo-modules-core';

type LingoCatStreakWidgetNativeModule = {
  updateStreakWidget(streakCount: number): boolean;
  getStreakCount(): number;
  refreshWidget(): boolean;
  isWidgetAdded(): boolean;
  requestPinWidget(): boolean;
};

const Native = requireOptionalNativeModule<LingoCatStreakWidgetNativeModule>('LingoCatStreakWidget');

export function isStreakWidgetNativeAvailable(): boolean {
  return Native != null;
}

export function updateStreakWidget(streakCount: number): boolean {
  return Native?.updateStreakWidget(Math.max(0, Math.trunc(streakCount))) ?? false;
}

export function getStreakCount(): number {
  return Native?.getStreakCount() ?? 0;
}

export function refreshStreakWidget(): boolean {
  return Native?.refreshWidget() ?? false;
}

export function isStreakWidgetAdded(): boolean {
  return Native?.isWidgetAdded() ?? false;
}

export function requestPinStreakWidget(): boolean {
  return Native?.requestPinWidget() ?? false;
}
