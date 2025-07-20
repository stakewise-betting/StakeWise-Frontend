import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaClock, FaSync } from "react-icons/fa";
import { useUserBets, UserBet } from "@/hooks/useUserBets";

export default function OngoingTable(): JSX.Element {
  const { bets, loading, error, refreshBets } = useUserBets();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Filter bets to only show those still in progress
  const inProgressBets = bets.filter(bet => bet.status === "In Progress");

  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await refreshBets();
    setTimeout(() => setRefreshing(false), 1000); // Visual feedback
  };

  return (
    <div className="rounded-[20px] lg:mx-24 md:mx-16 mx-8 bg-[#333447] min-h-[500px]">
      <div className="p-8 flex justify-between items-start">
        <div>
          <h2 className="text-[20px] font-bold">In-Progress Bets</h2>
          <p className="text-sm font-bold text-[#A0AEC0] flex items-center gap-2">
            <FaClock className="w-3 h-3 text-[#01B574]" />
            <span>{inProgressBets.length} bets in progress</span>
          </p>
        </div>
        <button 
          onClick={handleRefresh} 
          disabled={loading || refreshing}
          className="text-[#01B574] hover:text-[#00a065] transition-colors"
        >
          <FaSync className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="md:px-16 px-8 pb-8">
        {error ? (
          <div className="text-red-500 text-center py-4">
            {error}. Please make sure your wallet is connected.
          </div>
        ) : loading ? (
          <div className="text-center py-8 text-gray-400">Loading your bets...</div>
        ) : inProgressBets.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            You don't have any active bets in progress.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[#56577A] hover:bg-transparent text-gray-400 font-medium lg:text-lg text-sm">
                <TableHead>EVENT NAME</TableHead>
                <TableHead>MARKET</TableHead>
                <TableHead>OUTCOME</TableHead>
                <TableHead>PRICE(ODDS)</TableHead>
                <TableHead>STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inProgressBets.map((bet: UserBet, index: number) => (
                <TableRow
                  key={`${bet.eventId}-${index}`}
                  className="border-[#56577A] hover:bg-[#252537] lg:text-sm text-xs"
                >
                  <TableCell>{bet.eventName}</TableCell>
                  <TableCell>{bet.market}</TableCell>
                  <TableCell>{bet.outcome}</TableCell>
                  <TableCell>{bet.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-500">
                        {bet.status}
                      </span>
                      <button className="w-8 h-8 rounded-full hover:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400">⋮</span>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}