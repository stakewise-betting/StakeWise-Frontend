import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { RiChatHistoryFill } from "react-icons/ri";
import { IoCalendar } from "react-icons/io5";
import { useUserBets } from "@/hooks/useUserBets";
import setupWeb3AndContract from "@/services/blockchainService";

interface HistoryBet {
  id: string;
  eventName: string;
  market: string;
  result: string;
  profitLoss: number;
  date: Date;
  outcome: string;
  price: string;
  betAmount: number;
}

export default function BetHistory() {
  const [date, setDate] = useState<Date>();
  const [searchQuery, setSearchQuery] = useState("");
  const [detailedBets, setDetailedBets] = useState<HistoryBet[]>([]);
  const [calculationLoading, setCalculationLoading] = useState(false);
  const { bets, loading, error } = useUserBets();

  // Get actual transaction date from blockchain
  const getTransactionDate = async (eventId: string, userAddress: string): Promise<Date> => {
    try {
      const { web3Instance, betContract } = await setupWeb3AndContract();
      if (!web3Instance || !betContract) return new Date();

      const betPlacedEvents = await betContract.getPastEvents("BetPlaced", {
        filter: { eventId, bettor: userAddress },
        fromBlock: 0,
        toBlock: "latest",
      });

      if (betPlacedEvents.length > 0) {
        const block = await web3Instance.eth.getBlock(betPlacedEvents[0].blockNumber);
        return new Date(Number(block.timestamp) * 1000);
      }

      return new Date();
    } catch (error) {
      console.error("Error getting transaction date:", error);
      return new Date();
    }
  };

  // Calculate winnings directly from smart contract
  const calculateActualProfitLoss = async (bet: any, userAddress: string): Promise<{ profitLoss: number; betAmount: number; date: Date }> => {
    try {
      const { web3Instance, betContract } = await setupWeb3AndContract();
      if (!web3Instance || !betContract) return { profitLoss: 0, betAmount: 0, date: new Date() };

      // Get user's bet details from contract
      const userBet = await betContract.methods.getUserBet(bet.eventId, userAddress).call();
      const betAmountWei = userBet[1]; // amount in wei
      const betAmount = parseFloat(web3Instance.utils.fromWei(betAmountWei, "ether"));

      // Get transaction date
      const transactionDate = await getTransactionDate(bet.eventId, userAddress);

      console.log(`Bet ${bet.eventId}: Amount = ${betAmount} ETH, Status = ${bet.status}`);

      if (bet.status === "Lost") {
        return { profitLoss: -betAmount, betAmount, date: transactionDate };
      }

      if (bet.status === "Won") {
        // Get event details
        const eventDetails = await betContract.methods.getEvent(bet.eventId).call();
        
        // Get all BetPlaced events for this event
        const allBetEvents = await betContract.getPastEvents("BetPlaced", {
          filter: { eventId: bet.eventId },
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

        if (totalWinnersBetAmount === 0) {
          return { profitLoss: -betAmount, betAmount, date: transactionDate };
        }

        // Calculate winnings based on smart contract logic
        const prizePool = parseFloat(web3Instance.utils.fromWei(eventDetails.prizePool, "ether"));
        const adminFee = prizePool * 0.05; // 5% admin fee
        const remainingPrizePool = prizePool - adminFee;
        const winnerReward = (betAmount * remainingPrizePool) / totalWinnersBetAmount;
        
        // Profit = winnings - bet amount
        const profitLoss = winnerReward - betAmount;
        
        console.log(`Won bet ${bet.eventId}: Bet=${betAmount}, Reward=${winnerReward}, Profit=${profitLoss}`);
        
        return { profitLoss, betAmount, date: transactionDate };
      }

      // In Progress bets
      return { profitLoss: 0, betAmount, date: transactionDate };
    } catch (error) {
      console.error("Error calculating profit/loss:", error);
      // Still try to extract bet amount from price string as fallback
      const priceMatch = bet.price.match(/(\d+(?:\.\d+)?)/);
      const betAmount = priceMatch ? parseFloat(priceMatch[1]) : 0;
      return { profitLoss: 0, betAmount, date: new Date() };
    }
  };

  // Calculate detailed profit/loss for all bets
  useEffect(() => {
    const calculateDetailedBets = async () => {
      if (bets.length === 0) return;

      setCalculationLoading(true);
      try {
        const { web3Instance } = await setupWeb3AndContract();
        if (!web3Instance) return;

        const accounts = await web3Instance.eth.getAccounts();
        const userAddress = accounts[0];

        // Process all bets (completed and in progress)
        const detailedBetsPromises = bets.map(async (bet) => {
          const { profitLoss, betAmount, date } = await calculateActualProfitLoss(bet, userAddress);
          return {
            id: bet.eventId,
            eventName: bet.eventName,
            market: bet.market,
            result: bet.status,
            profitLoss: parseFloat(profitLoss.toFixed(6)),
            date,
            outcome: bet.outcome,
            price: bet.price,
            betAmount: parseFloat(betAmount.toFixed(6))
          };
        });

        const resolvedBets = await Promise.all(detailedBetsPromises);
        setDetailedBets(resolvedBets);
        
        // Log for debugging
        console.log("Detailed bets:", resolvedBets);
      } catch (error) {
        console.error("Error calculating detailed bets:", error);
      } finally {
        setCalculationLoading(false);
      }
    };

    calculateDetailedBets();
  }, [bets]);

  const handleReset = () => {
    setSearchQuery("");
    setDate(undefined);
  };

  const filteredBets = detailedBets.filter((bet) => {
    const matchesSearch =
      bet.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bet.market.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate =
      !date || format(bet.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
    return matchesSearch && matchesDate;
  });

  const isLoading = loading || calculationLoading;

  return (
    <div className="p-8 rounded-[20px] lg:mx-24 md:mx-16 mx-8 mb-[96px] bg-[#333447] min-h-[500px]">
      <div className="space-y-6">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Bet History</h2>
            <div className="text-sm font-bold text-[#A0AEC0] flex items-center gap-2">
              <RiChatHistoryFill className="w-3 h-3 text-[#01B574]" />
              <p className="text-sm text-slate-400">
                {filteredBets.length} bets (completed and in progress)
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 lg:w-1/2 md:w-3/4 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4" />
            <Input
              placeholder="Search markets"
              className="pl-9 bg-[#333447] border-[#56577A] rounded-[10px] border-[3px] placeholder:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "bg-[#333447] border-[#56577A] hover:bg-slate-700 border-[3px] rounded-[10px]",
                  date && "text-slate-50"
                )}
              >
                <IoCalendar className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#1C1C27] border-none rounded-[10px]">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button
            variant="outline"
            onClick={handleReset}
            className="bg-[#333447] border-[#56577A] hover:bg-slate-700 border-[3px] rounded-[10px]"
            disabled={!searchQuery && !date}
          >
            Clear
          </Button>
        </div>

        <div className="">
          {isLoading ? (
            <div className="flex justify-center items-center h-[450px]">
              <div className="text-slate-400">Loading bet history...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-[450px]">
              <div className="text-red-500">
                Error loading bet history: {error}
              </div>
            </div>
          ) : (
            <div className="max-h-[450px] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10">
                  <TableRow className="border-[#56577A] text-[#A0AEC0] font-medium lg:text-lg text-sm">
                    <TableHead>EVENT NAME</TableHead>
                    <TableHead>MARKET</TableHead>
                    <TableHead>OUTCOME</TableHead>
                    <TableHead>BET AMOUNT</TableHead>
                    <TableHead>RESULT</TableHead>
                    <TableHead>PROFIT/LOSS</TableHead>
                    <TableHead>DATE</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBets.length > 0 ? (
                    filteredBets.map((bet) => (
                      <TableRow
                        key={bet.id}
                        className="border-[#56577A] hover:bg-slate-800 lg:text-sm text-xs"
                      >
                        <TableCell>{bet.eventName}</TableCell>
                        <TableCell>{bet.market}</TableCell>
                        <TableCell>{bet.outcome}</TableCell>
                        <TableCell className="text-slate-300">
                          {bet.betAmount} ETH
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-block px-3 py-2 rounded font-medium ${
                              bet.result === "Won"
                                ? "bg-[#00BD58] bg-opacity-15 text-green-500"
                                : bet.result === "Lost"
                                ? "bg-[#BF3A19] bg-opacity-15 text-red-500"
                                : "bg-gray-500 bg-opacity-15 text-gray-400"
                            }`}
                          >
                            {bet.result}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              bet.profitLoss > 0
                                ? "text-green-500"
                                : bet.profitLoss < 0
                                ? "text-red-500"
                                : "text-gray-400"
                            }
                          >
                            {bet.profitLoss > 0 ? "+" : ""}
                            {bet.profitLoss === 0 && bet.result === "In Progress" ? "-" : bet.profitLoss}
                            {bet.result !== "In Progress" && " ETH"}
                          </span>
                        </TableCell>
                        <TableCell className="">
                          {format(bet.date, "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700"
                          >
                            •••
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="h-[352px] text-center text-slate-400"
                      >
                        No bets found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}