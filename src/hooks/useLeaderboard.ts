import { useState, useEffect } from 'react';

export interface UserLeaderboardData {
  rank: number;
  userAddress: string;
  userData: {
    fname?: string;
    lname?: string;
    username?: string;
    walletAddress?: string;
    picture?: string;
  } | null;
  totalEarned: number;
  totalLoss: number;
  netProfit: number;
  totalBetsPlaced: number;
  totalAmountWagered: number;
  winRate: number;
  totalWins: number;
  totalLosses: number;
  lastUpdated: string;
}

interface LeaderboardPagination {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
}

interface UseLeaderboardReturn {
  leaderboard: UserLeaderboardData[];
  loading: boolean;
  error: string | null;
  pagination: LeaderboardPagination;
  refreshLeaderboard: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export const useLeaderboard = (initialLimit = 50): UseLeaderboardReturn => {
  const [leaderboard, setLeaderboard] = useState<UserLeaderboardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<LeaderboardPagination>({
    limit: initialLimit,
    offset: 0,
    total: 0,
    hasMore: false,
  });

  const fetchLeaderboard = async (offset = 0, limit = initialLimit, append = false): Promise<void> => {
    try {
      if (!append) {
        setLoading(true);
        setError(null);
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/leaderboard?limit=${limit}&offset=${offset}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch leaderboard');
      }

      if (append) {
        setLeaderboard(prev => [...prev, ...data.data]);
      } else {
        setLeaderboard(data.data);
      }

      setPagination(data.pagination);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch leaderboard');
      console.error("Error in useLeaderboard hook:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshLeaderboard = async (): Promise<void> => {
    await fetchLeaderboard(0, pagination.limit, false);
  };

  const loadMore = async (): Promise<void> => {
    if (pagination.hasMore && !loading) {
      const newOffset = pagination.offset + pagination.limit;
      await fetchLeaderboard(newOffset, pagination.limit, true);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return {
    leaderboard,
    loading,
    error,
    pagination,
    refreshLeaderboard,
    loadMore,
  };
};

// Hook for getting user's rank and stats
interface UseUserRankReturn {
  userRank: UserLeaderboardData | null;
  loading: boolean;
  error: string | null;
  refreshUserRank: () => Promise<void>;
}

export const useUserRank = (userAddress: string): UseUserRankReturn => {
  const [userRank, setUserRank] = useState<UserLeaderboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRank = async (): Promise<void> => {
    if (!userAddress) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/user/${userAddress}/rank`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch user rank');
      }

      setUserRank(data.data);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch user rank');
      console.error("Error in useUserRank hook:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserRank = async (): Promise<void> => {
    await fetchUserRank();
  };

  useEffect(() => {
    fetchUserRank();
  }, [userAddress]);

  return {
    userRank,
    loading,
    error,
    refreshUserRank,
  };
};

// Hook for getting top performers by metric
interface UseTopPerformersReturn {
  topPerformers: UserLeaderboardData[];
  loading: boolean;
  error: string | null;
  refreshTopPerformers: () => Promise<void>;
}

export const useTopPerformers = (
  metric: 'netProfit' | 'totalEarned' | 'winRate' | 'totalBetsPlaced' = 'netProfit',
  limit = 10
): UseTopPerformersReturn => {
  const [topPerformers, setTopPerformers] = useState<UserLeaderboardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopPerformers = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/top-performers?metric=${metric}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch top performers');
      }

      setTopPerformers(data.data);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch top performers');
      console.error("Error in useTopPerformers hook:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshTopPerformers = async (): Promise<void> => {
    await fetchTopPerformers();
  };

  useEffect(() => {
    fetchTopPerformers();
  }, [metric, limit]);

  return {
    topPerformers,
    loading,
    error,
    refreshTopPerformers,
  };
};
