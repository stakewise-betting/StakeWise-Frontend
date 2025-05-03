// hooks/useUserTransactions.ts
import { useState, useEffect } from 'react';
import { getUserTransactions } from '../services/blockchainService';

// Define the Transaction interface
export interface Transaction {
  date: Date;
  type: "Bet Placed" | "Winnings Received";
  amount: string;
  eventName: string;
  txHash: string;
}

// Define the return type of the hook
interface UseUserTransactionsReturn {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refreshTransactions: () => Promise<void>;
}

// Custom hook implementation
export const useUserTransactions = (): UseUserTransactionsReturn => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch user transactions
  const fetchUserTransactions = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const userTransactions = await getUserTransactions();
      setTransactions(userTransactions);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch your transactions');
      console.error("Error in useUserTransactions hook:", err);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch transactions on mount and handle account changes
  useEffect(() => {
    fetchUserTransactions();

    // Event listener for MetaMask account changes
    const handleAccountsChanged = (): void => {
      fetchUserTransactions();
    };

    if ((window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
    }

    // Cleanup event listener on unmount
    return () => {
      if ((window as any).ethereum) {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  return { transactions, loading, error, refreshTransactions: fetchUserTransactions };
};