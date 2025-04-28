// hooks/useUserBets.ts
import { useState, useEffect } from 'react';
import { getUserBets } from '../services/blockchainService';

export interface UserBet {
  eventId: string;
  eventName: string;
  market: string;
  outcome: string;
  price: string;
  status: string;
}

interface UseUserBetsReturn {
  bets: UserBet[];
  loading: boolean;
  error: string | null;
  refreshBets: () => Promise<void>;
}

export const useUserBets = (): UseUserBetsReturn => {
  const [bets, setBets] = useState<UserBet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserBets = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const userBets = await getUserBets();
      setBets(userBets);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch your bets');
      console.error("Error in useUserBets hook:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBets();
    
    // Setup event listener for new bets
    const handleAccountsChanged = (): void => {
      fetchUserBets();
    };
    
    if ((window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
    }
    
    return () => {
      if ((window as any).ethereum) {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  return { bets, loading, error, refreshBets: fetchUserBets };
};