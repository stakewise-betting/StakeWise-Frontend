// hooks/useUserStats.ts
import { useState, useEffect } from 'react';
import setupWeb3AndContract from '@/services/blockchainService';

interface UserStats {
  totalEarned: number;
  totalLoss: number;
  netProfit: number;
  totalBetsPlaced: number;
  totalAmountWagered: number;
  winRate: number;
  loading: boolean;
  error: string | null;
}

interface BetDetails {
  eventId: string;
  betAmount: number;
  isWon: boolean;
  isLost: boolean;
  winnings: number;
  eventName: string;
}

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats>({
    totalEarned: 0,
    totalLoss: 0,
    netProfit: 0,
    totalBetsPlaced: 0,
    totalAmountWagered: 0,
    winRate: 0,
    loading: true,
    error: null,
  });

  const calculateWinnings = async (
    eventId: string,
    betAmount: number,
    userAddress: string,
    web3Instance: any,
    betContract: any
  ): Promise<number> => {
    try {
      // Get event details
      const eventDetails = await betContract.methods.getEvent(eventId).call();
      
      // Get user's bet details
      const userBet = await betContract.methods.getUserBet(eventId, userAddress).call();
      const userOption = userBet[0];
      
      // Check if user won
      if (eventDetails.winningOption !== userOption) {
        return 0; // User lost
      }

      // Get all BetPlaced events for this event
      const allBetEvents = await betContract.getPastEvents("BetPlaced", {
        filter: { eventId },
        fromBlock: 0,
        toBlock: "latest",
      });

      // Calculate total winners bet amount
      let totalWinnersBetAmount = 0;
      for (const betEvent of allBetEvents) {
        if (betEvent.returnValues.option === eventDetails.winningOption) {
          totalWinnersBetAmount += parseFloat(web3Instance.utils.fromWei(betEvent.returnValues.amount, "ether"));
        }
      }

      if (totalWinnersBetAmount === 0) return 0;

      // Calculate winnings based on smart contract logic
      const prizePool = parseFloat(web3Instance.utils.fromWei(eventDetails.prizePool, "ether"));
      const adminFee = prizePool * 0.05; // 5% admin fee
      const remainingPrizePool = prizePool - adminFee;
      const winnerReward = (betAmount * remainingPrizePool) / totalWinnersBetAmount;
      
      return winnerReward;
    } catch (error) {
      console.error("Error calculating winnings:", error);
      return 0;
    }
  };

  const fetchUserStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));
      
      const { web3Instance, betContract } = await setupWeb3AndContract();
      if (!web3Instance || !betContract) {
        throw new Error("Web3 or contract not initialized");
      }

      const accounts = await web3Instance.eth.getAccounts();
      const userAddress = accounts[0];

      // Get all event IDs
      const eventIds = await betContract.methods.getAllEventIds().call();
      
      // Get user's bets for each event
      const userBets: BetDetails[] = [];
      
      for (const eventId of eventIds) {
        const userBet = await betContract.methods.getUserBet(eventId, userAddress).call();
        const exists = userBet[2];
        
        if (exists) {
          const betAmountWei = userBet[1];
          const betAmount = parseFloat(web3Instance.utils.fromWei(betAmountWei, "ether"));
          
          // Get event details
          const eventDetails = await betContract.methods.getEvent(eventId).call();
          
          const userOption = userBet[0];
          const isCompleted = eventDetails.isCompleted;
          const isWon = isCompleted && eventDetails.winningOption === userOption;
          const isLost = isCompleted && eventDetails.winningOption !== userOption;
          
          let winnings = 0;
          if (isWon) {
            winnings = await calculateWinnings(eventId, betAmount, userAddress, web3Instance, betContract);
          }
          
          userBets.push({
            eventId,
            betAmount,
            isWon,
            isLost,
            winnings,
            eventName: eventDetails.name,
          });
        }
      }

      // Calculate statistics
      const totalBetsPlaced = userBets.length;
      const totalAmountWagered = userBets.reduce((sum, bet) => sum + bet.betAmount, 0);
      const totalWinnings = userBets.reduce((sum, bet) => sum + bet.winnings, 0);
      const totalLostAmount = userBets.filter(bet => bet.isLost).reduce((sum, bet) => sum + bet.betAmount, 0);
      const totalEarned = totalWinnings; // Total winnings received
      const totalLoss = totalLostAmount; // Total amount lost
      const netProfit = totalEarned - totalLoss; // Net profit/loss
      const wonBets = userBets.filter(bet => bet.isWon).length;
      const completedBets = userBets.filter(bet => bet.isWon || bet.isLost).length;
      const winRate = completedBets > 0 ? (wonBets / completedBets) * 100 : 0;

      setStats({
        totalEarned,
        totalLoss,
        netProfit,
        totalBetsPlaced,
        totalAmountWagered,
        winRate,
        loading: false,
        error: null,
      });

      console.log('User Stats:', {
        totalEarned,
        totalLoss,
        netProfit,
        totalBetsPlaced,
        totalAmountWagered,
        winRate,
        userBets,
      });

    } catch (error) {
      console.error("Error fetching user stats:", error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user stats',
      }));
    }
  };

  useEffect(() => {
    fetchUserStats();

    // Setup event listener for account changes
    const handleAccountsChanged = () => {
      fetchUserStats();
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

  return {
    ...stats,
    refreshStats: fetchUserStats,
  };
};