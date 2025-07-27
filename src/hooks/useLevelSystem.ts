// hooks/useLevelSystem.ts
import { useMemo } from 'react';
import { useUserStats } from '@/hooks/useUserStats';
import { UserLevel } from '@/types/level';

// XP calculation constants
const BASE_XP_PER_LEVEL = 100;
const XP_MULTIPLIER = 1.5;

// XP rewards
const XP_REWARDS = {
  BET_PLACED: 5,
  BET_WON: 10,
  BIG_WIN: 50, // for wins over 1 ETH
  ACHIEVEMENT_UNLOCKED: 100,
};

export const useLevelSystem = () => {
  const {
    totalEarned,
    totalBetsPlaced,
    winRate,
    loading: statsLoading
  } = useUserStats();

  // Calculate total XP based on user activities
  const calculateTotalXP = useMemo(() => {
    let totalXP = 0;
    
    // XP from bets placed
    totalXP += totalBetsPlaced * XP_REWARDS.BET_PLACED;
    
    // XP from wins (estimated from total earned)
    const estimatedWins = Math.floor((totalBetsPlaced * winRate) / 100);
    totalXP += estimatedWins * XP_REWARDS.BET_WON;
    
    // XP from big wins (assuming big wins are 10% of total earned)
    const bigWins = Math.floor(totalEarned * 0.1);
    totalXP += bigWins * XP_REWARDS.BIG_WIN;
    
    return totalXP;
  }, [totalBetsPlaced, totalEarned, winRate]);

  // Calculate XP required for a specific level
  const getXPForLevel = (level: number): number => {
    if (level <= 1) return 0;
    return Math.floor(BASE_XP_PER_LEVEL * Math.pow(XP_MULTIPLIER, level - 2));
  };

  // Calculate current level from total XP
  const getCurrentLevel = (totalXP: number): UserLevel => {
    let level = 1;
    let xpUsed = 0;
    
    while (true) {
      const xpForNextLevel = getXPForLevel(level + 1);
      if (totalXP < xpUsed + xpForNextLevel) {
        break;
      }
      xpUsed += xpForNextLevel;
      level++;
    }
    
    const currentXP = totalXP - xpUsed;
    const xpToNextLevel = getXPForLevel(level + 1);
    const progress = xpToNextLevel > 0 ? (currentXP / xpToNextLevel) * 100 : 100;
    
    return {
      currentLevel: level,
      currentXP,
      xpToNextLevel: xpToNextLevel - currentXP,
      totalXP,
      progress: Math.min(progress, 100)
    };
  };

  const userLevel = useMemo(() => 
    getCurrentLevel(calculateTotalXP), 
    [calculateTotalXP]
  );

  return {
    userLevel,
    loading: statsLoading,
    calculateTotalXP
  };
};
