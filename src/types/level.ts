
// types/level.ts
export interface Achievement {
  id: string;
  title: string;
  description: string;
  requirement: number;
  type: 'bets_placed' | 'consecutive_wins' | 'single_payout' | 'total_earned' | 'win_rate';
  isUnlocked: boolean;
  unlockedAt?: Date;
}

export interface UserLevel {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  progress: number; // percentage to next level
}