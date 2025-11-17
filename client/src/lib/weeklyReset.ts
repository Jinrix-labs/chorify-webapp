// Weekly reset utility for Sunday midnight resets

export interface WeeklyChampion {
  name: string;
  avatar: string;
  weeklyPoints: number;
  weekEnding: string; // ISO date string
}

export const getLastSunday = (): Date => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const lastSunday = new Date(now);
  lastSunday.setDate(now.getDate() - dayOfWeek);
  lastSunday.setHours(0, 0, 0, 0);
  return lastSunday;
};

export const getNextSunday = (): Date => {
  const lastSunday = getLastSunday();
  const nextSunday = new Date(lastSunday);
  nextSunday.setDate(lastSunday.getDate() + 7);
  return nextSunday;
};

export const getCurrentWeekKey = (): string => {
  return getLastSunday().toISOString().split('T')[0];
};

export const shouldResetWeek = (): boolean => {
  const lastResetKey = localStorage.getItem('lastWeekReset');
  const currentWeekKey = getCurrentWeekKey();
  
  if (!lastResetKey) {
    // First time, set it and don't reset
    localStorage.setItem('lastWeekReset', currentWeekKey);
    return false;
  }
  
  return lastResetKey !== currentWeekKey;
};

export const markWeekReset = (): void => {
  const currentWeekKey = getCurrentWeekKey();
  localStorage.setItem('lastWeekReset', currentWeekKey);
};

export const getWeeklyChampion = (): WeeklyChampion | null => {
  const championData = localStorage.getItem('weeklyChampion');
  if (!championData) return null;
  
  try {
    return JSON.parse(championData);
  } catch {
    return null;
  }
};

export const setWeeklyChampion = (champion: WeeklyChampion): void => {
  localStorage.setItem('weeklyChampion', JSON.stringify(champion));
};

export const isCurrentChampion = (userId: string): boolean => {
  const champion = getWeeklyChampion();
  if (!champion) return false;
  
  // In a real app, we'd check by userId
  // For now, just check if the current week matches
  const currentWeekKey = getCurrentWeekKey();
  const championWeek = new Date(champion.weekEnding);
  const lastSunday = getLastSunday();
  
  return championWeek.getTime() === lastSunday.getTime();
};

export const getDaysUntilReset = (): number => {
  const now = new Date();
  const nextSunday = getNextSunday();
  const diff = nextSunday.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
