// hooks/useAchievements.ts
import { useState, useEffect, useMemo } from 'react';
import { useUserStats } from '@/hooks/useUserStats';
import { Achievement } from '@/types/level';

const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'isUnlocked' | 'unlockedAt'>[] = [
  {
    id: 'first_bet',
    title: 'First Bet',
    description: 'Place your first bet',
    requirement: 1,
    type: 'bets_placed'
  },
  {
    id: 'bet_novice',
    title: '10 Bets Placed',
    description: 'For users who\'ve placed 10 bets',
    requirement: 10,
    type: 'bets_placed'
  },
  {
    id: 'bet_veteran',
    title: '100 Bets Placed',
    description: 'For users who\'ve placed 100 bets',
    requirement: 100,
    type: 'bets_placed'
  },
  {
    id: 'bet_master',
    title: '500 Bets Placed',
    description: 'For users who\'ve placed 500 bets',
    requirement: 500,
    type: 'bets_placed'
  },
  {
    id: 'big_winner',
    title: 'Big Winner',
    description: 'Earn more than 1 ETH total',
    requirement: 1,
    type: 'total_earned'
  },
  {
    id: 'whale',
    title: 'Whale',
    description: 'Earn more than 10 ETH total',
    requirement: 10,
    type: 'total_earned'
  },
  {
    id: 'consistent_winner',
    title: 'Consistent Winner',
    description: 'Achieve 70% win rate with 20+ bets',
    requirement: 70,
    type: 'win_rate'
  }
];

export const useAchievements = () => {
  const {
    totalEarned,
    totalBetsPlaced,
    winRate,
    loading: statsLoading
  } = useUserStats();

  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

  // Check which achievements are unlocked
  const achievements = useMemo((): Achievement[] => {
    return ACHIEVEMENT_DEFINITIONS.map(achievement => {
      let isUnlocked = false;
      
      switch (achievement.type) {
        case 'bets_placed':
          isUnlocked = totalBetsPlaced >= achievement.requirement;
          break;
        case 'total_earned':
          isUnlocked = totalEarned >= achievement.requirement;
          break;
        case 'win_rate':
          isUnlocked = winRate >= achievement.requirement && totalBetsPlaced >= 20;
          break;
      }
      
      return {
        ...achievement,
        isUnlocked,
        unlockedAt: isUnlocked ? new Date() : undefined
      };
    });
  }, [totalEarned, totalBetsPlaced, winRate]);

  // Get recently unlocked achievements
  const recentlyUnlocked = achievements.filter(a => a.isUnlocked && !unlockedAchievements.includes(a.id));
  
  // Update unlocked achievements
  useEffect(() => {
    const newUnlocked = achievements.filter(a => a.isUnlocked).map(a => a.id);
    setUnlockedAchievements(newUnlocked);
  }, [achievements]);

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;

  return {
    achievements,
    unlockedCount,
    totalCount,
    recentlyUnlocked,
    loading: statsLoading
  };
};