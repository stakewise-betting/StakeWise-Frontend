import { useState, useEffect } from 'react';
import responsibleGamblingService from '@/services/responsibleGamblingApiService';
import { AlertCircle } from 'lucide-react';

// Define the expected API response structure
interface DepositLimit {
  daily: {
    limit: number;
    used: number;
    remaining: number;
  };
  weekly: {
    limit: number;
    used: number;
    remaining: number;
  };
  monthly: {
    limit: number;
    used: number;
    remaining: number;
  };
}

// Define default values for when API isn't available
const DEFAULT_LIMITS: DepositLimit = {
  daily: {
    limit: 100,
    used: 0,
    remaining: 100
  },
  weekly: {
    limit: 500,
    used: 0,
    remaining: 500
  },
  monthly: {
    limit: 2000,
    used: 0,
    remaining: 2000
  }
};

interface DepositLimitTrackerProps {
  amount: string; // Current bet amount
  onLimitExceeded?: (isExceeded: boolean, message?: string) => void; // Callback with status and message
}

const DepositLimitTracker: React.FC<DepositLimitTrackerProps> = ({ 
  amount, 
  onLimitExceeded 
}) => {
  const [depositLimits, setDepositLimits] = useState<DepositLimit>(DEFAULT_LIMITS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAmount, setCurrentAmount] = useState<number>(0);
  
  useEffect(() => {
    fetchDepositLimits();
  }, []);
  
  useEffect(() => {
    if (amount) {
      const numAmount = parseFloat(amount);
      setCurrentAmount(isNaN(numAmount) ? 0 : numAmount);
    } else {
      setCurrentAmount(0);
    }
  }, [amount]);
  
  const fetchDepositLimits = async () => {
    try {
      setLoading(true);
      const response = await responsibleGamblingService.getDepositLimits();
      
      // Check if the response has the expected structure with success and data properties
      if (response && response.success === true && response.data) {
        const limits = response.data;
        
        // Validate that the data has the expected structure
        if (limits && 
            limits.daily && typeof limits.daily.used === 'number' && 
            limits.weekly && typeof limits.weekly.used === 'number' && 
            limits.monthly && typeof limits.monthly.used === 'number') {
          setDepositLimits(limits);
          setError(null);
        } else {
          console.error('Invalid deposit limits data format:', limits);
          setError('Received invalid data format from server');
          // Keep using default limits
        }
      } else {
        console.error('Invalid API response format:', response);
        setError('Received invalid response from server');
        // Keep using default limits
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load deposit limits');
      console.error('Error fetching deposit limits:', err);
      // Keep using default limits
    } finally {
      setLoading(false);
    }
  };
  
  // Check if placing this bet would exceed any limits
  useEffect(() => {
    if (currentAmount <= 0 || !onLimitExceeded) return;
    
    const wouldExceedDaily = currentAmount > depositLimits.daily.remaining;
    const wouldExceedWeekly = currentAmount > depositLimits.weekly.remaining;
    const wouldExceedMonthly = currentAmount > depositLimits.monthly.remaining;
    
    if (wouldExceedDaily) {
      onLimitExceeded(true, `Bet exceeds your daily deposit limit (${depositLimits.daily.remaining.toFixed(2)} ETH remaining)`);
    } else if (wouldExceedWeekly) {
      onLimitExceeded(true, `Bet exceeds your weekly deposit limit (${depositLimits.weekly.remaining.toFixed(2)} ETH remaining)`);
    } else if (wouldExceedMonthly) {
      onLimitExceeded(true, `Bet exceeds your monthly deposit limit (${depositLimits.monthly.remaining.toFixed(2)} ETH remaining)`);
    } else {
      onLimitExceeded(false);
    }
  }, [currentAmount, depositLimits, onLimitExceeded]);
  
  const renderProgressBar = (used: number, limit: number) => {
    const percentage = limit > 0 ? (used / limit) * 100 : 0;
    const adjustedPercentage = Math.min(percentage, 100);
    const getColorClass = () => {
      if (percentage >= 90) return 'bg-red-500';
      if (percentage >= 70) return 'bg-yellow-500';
      return 'bg-emerald-500';
    };
    
    return (
      <div className="w-full bg-gray-700 rounded-full h-2 my-1">
        <div 
          className={`h-2 rounded-full ${getColorClass()}`} 
          style={{ width: `${adjustedPercentage}%` }}
        ></div>
      </div>
    );
  };
  
  if (loading) {
    return <div className="bg-[#1C1C27] p-6 rounded-lg border border-[#8488AC]">Loading limits...</div>;
  }
  
  return (
    <div className="bg-[#1C1C27] p-6 rounded-lg border border-[#8488AC]">
      <h3 className="text-lg font-semibold mb-4">Deposit Limits</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-800/50 rounded-md">
          <p className="text-sm text-red-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Daily:</span>
            <span>
              {depositLimits.daily.used.toFixed(2)} / {depositLimits.daily.limit.toFixed(2)} ETH
            </span>
          </div>
          {renderProgressBar(depositLimits.daily.used, depositLimits.daily.limit)}
          <div className="flex justify-between text-xs text-slate-400">
            <span>Remaining: {depositLimits.daily.remaining.toFixed(2)} ETH</span>
            {currentAmount > 0 && (
              <span className={currentAmount > depositLimits.daily.remaining ? 'text-red-400' : ''}>
                After bet: {Math.max(0, depositLimits.daily.remaining - currentAmount).toFixed(2)} ETH
              </span>
            )}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Weekly:</span>
            <span>
              {depositLimits.weekly.used.toFixed(2)} / {depositLimits.weekly.limit.toFixed(2)} ETH
            </span>
          </div>
          {renderProgressBar(depositLimits.weekly.used, depositLimits.weekly.limit)}
          <div className="flex justify-between text-xs text-slate-400">
            <span>Remaining: {depositLimits.weekly.remaining.toFixed(2)} ETH</span>
            {currentAmount > 0 && (
              <span className={currentAmount > depositLimits.weekly.remaining ? 'text-red-400' : ''}>
                After bet: {Math.max(0, depositLimits.weekly.remaining - currentAmount).toFixed(2)} ETH
              </span>
            )}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Monthly:</span>
            <span>
              {depositLimits.monthly.used.toFixed(2)} / {depositLimits.monthly.limit.toFixed(2)} ETH
            </span>
          </div>
          {renderProgressBar(depositLimits.monthly.used, depositLimits.monthly.limit)}
          <div className="flex justify-between text-xs text-slate-400">
            <span>Remaining: {depositLimits.monthly.remaining.toFixed(2)} ETH</span>
            {currentAmount > 0 && (
              <span className={currentAmount > depositLimits.monthly.remaining ? 'text-red-400' : ''}>
                After bet: {Math.max(0, depositLimits.monthly.remaining - currentAmount).toFixed(2)} ETH
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositLimitTracker;