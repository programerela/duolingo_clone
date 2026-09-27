import {
  getStreakCount,
  isStreakWidgetAdded,
  isStreakWidgetNativeAvailable,
  refreshStreakWidget,
  requestPinStreakWidget,
  updateStreakWidget,
} from '../../modules/lingocat-streak-widget';

export function syncStreakWidget(streak: number): boolean {
  return updateStreakWidget(streak);
}

export function getNativeStreak(): number {
  return getStreakCount();
}

export function refreshNativeStreakWidget(): boolean {
  return refreshStreakWidget();
}

export function hasStreakWidget(): boolean {
  return isStreakWidgetAdded();
}

export function addStreakWidgetToHomeScreen(): boolean {
  return requestPinStreakWidget();
}

export function streakWidgetAvailable(): boolean {
  return isStreakWidgetNativeAvailable();
}
