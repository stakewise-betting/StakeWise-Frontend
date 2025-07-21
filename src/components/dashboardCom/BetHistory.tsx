import { useState, useEffect } from "react";
import {
  Search,
  Calendar as CalendarIcon,
  History,
  TrendingUp,
  TrendingDown,
  Clock,
  Trophy,
  AlertCircle,
} from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const getTransactionDate = async (
    eventId: string,
    userAddress: string
  ): Promise<Date> => {
    try {
      const { web3Instance, betContract } = await setupWeb3AndContract();
      if (!web3Instance || !betContract) return new Date();

      const betPlacedEvents = await betContract.getPastEvents("BetPlaced", {
        filter: { eventId, bettor: userAddress },
        fromBlock: 0,
        toBlock: "latest",
      });

      if (betPlacedEvents.length > 0) {
        const block = await web3Instance.eth.getBlock(
          betPlacedEvents[0].blockNumber
        );
        return new Date(Number(block.timestamp) * 1000);
      }

      return new Date();
    } catch (error) {
      console.error("Error getting transaction date:", error);
      return new Date();
    }
  };

  // Calculate winnings directly from smart contract
  const calculateActualProfitLoss = async (
    bet: any,
    userAddress: string
  ): Promise<{ profitLoss: number; betAmount: number; date: Date }> => {
    try {
      const { web3Instance, betContract } = await setupWeb3AndContract();
      if (!web3Instance || !betContract)
        return { profitLoss: 0, betAmount: 0, date: new Date() };

      // Get user's bet details from contract
      const userBet = await betContract.methods
        .getUserBet(bet.eventId, userAddress)
        .call();
      const betAmountWei = userBet[1]; // amount in wei
      const betAmount = parseFloat(
        web3Instance.utils.fromWei(betAmountWei, "ether")
      );

      // Get transaction date
      const transactionDate = await getTransactionDate(
        bet.eventId,
        userAddress
      );

      console.log(
        `Bet ${bet.eventId}: Amount = ${betAmount} ETH, Status = ${bet.status}`
      );

      if (bet.status === "Lost") {
        return { profitLoss: -betAmount, betAmount, date: transactionDate };
      }

      if (bet.status === "Won") {
        // Get event details
        const eventDetails = await betContract.methods
          .getEvent(bet.eventId)
          .call();

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
            totalWinnersBetAmount += parseFloat(
              web3Instance.utils.fromWei(betEvent.returnValues.amount, "ether")
            );
          }
        }

        if (totalWinnersBetAmount === 0) {
          return { profitLoss: -betAmount, betAmount, date: transactionDate };
        }

        // Calculate winnings based on smart contract logic
        const prizePool = parseFloat(
          web3Instance.utils.fromWei(eventDetails.prizePool, "ether")
        );
        const adminFee = prizePool * 0.05; // 5% admin fee
        const remainingPrizePool = prizePool - adminFee;
        const winnerReward =
          (betAmount * remainingPrizePool) / totalWinnersBetAmount;

        // Profit = winnings - bet amount
        const profitLoss = winnerReward - betAmount;

        console.log(
          `Won bet ${bet.eventId}: Bet=${betAmount}, Reward=${winnerReward}, Profit=${profitLoss}`
        );

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
          const { profitLoss, betAmount, date } =
            await calculateActualProfitLoss(bet, userAddress);
          return {
            id: bet.eventId,
            eventName: bet.eventName,
            market: bet.market,
            result: bet.status,
            profitLoss: parseFloat(profitLoss.toFixed(6)),
            date,
            outcome: bet.outcome,
            price: bet.price,
            betAmount: parseFloat(betAmount.toFixed(6)),
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
    <div className="lg:mx-24 md:mx-16 mx-8 mb-[96px]">
      <Card className="bg-gradient-to-br from-[#1C1C27] via-[#252538] to-[#1C1C27] border border-[#333447] shadow-2xl rounded-2xl overflow-hidden">
        {/* Header Section */}
        <CardHeader className="bg-gradient-to-r from-[#3B82F6]/10 to-[#60A5FA]/10 border-b border-[#333447]">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-xl shadow-lg">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-zinc-100">
                Bet History
              </CardTitle>
              <CardDescription className="text-lg text-zinc-400 flex items-center gap-2 mt-1">
                <RiChatHistoryFill className="w-4 h-4 text-[#3B82F6]" />
                {filteredBets.length} bets (completed and in progress)
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Search and Filters */}
          <div className="flex gap-4 lg:w-2/3 md:w-3/4 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <Input
                placeholder="Search by event name or market..."
                className="pl-12 py-3 text-sm bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] hover:border-[#3B82F6]/50 transition-all duration-200 text-zinc-100 placeholder-zinc-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "px-6 py-3 bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] hover:border-[#3B82F6]/50 rounded-xl transition-all duration-200 flex items-center gap-3",
                    date && "border-[#3B82F6]/50 bg-[#3B82F6]/10"
                  )}
                >
                  <CalendarIcon className="h-5 w-5 text-[#3B82F6]" />
                  <span className="text-zinc-300">
                    {date ? format(date, "PPP") : "Select Date"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-xl shadow-2xl">
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
              disabled={!searchQuery && !date}
              className="px-6 py-3 bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] hover:border-[#E27625]/50 hover:bg-[#E27625]/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 text-zinc-300 hover:text-white"
            >
              Clear Filters
            </Button>
          </div>

          {/* Table Section */}
          <div className="bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-xl overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin h-8 w-8 border-2 border-[#3B82F6] border-t-transparent rounded-full mb-4" />
                <p className="text-zinc-400 text-lg">
                  Loading your betting history...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20">
                <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
                <p className="text-red-400 text-lg font-medium">
                  Error loading bet history
                </p>
                <p className="text-zinc-500 text-sm">{error}</p>
              </div>
            ) : filteredBets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <History className="h-12 w-12 text-zinc-500 mb-4" />
                <p className="text-zinc-400 text-lg font-medium">
                  No betting history found
                </p>
                <p className="text-zinc-500 text-sm">
                  Your completed bets will appear here
                </p>
              </div>
            ) : (
              <div className="max-h-[500px] overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-gradient-to-r from-[#2A2A3A] to-[#1C1C27]">
                    <TableRow className="border-b border-[#333447] hover:bg-transparent">
                      <TableHead className="text-zinc-300 font-semibold text-sm uppercase tracking-wide py-4">
                        Event
                      </TableHead>
                      <TableHead className="text-zinc-300 font-semibold text-sm uppercase tracking-wide py-4">
                        Market
                      </TableHead>
                      <TableHead className="text-zinc-300 font-semibold text-sm uppercase tracking-wide py-4">
                        Outcome
                      </TableHead>
                      <TableHead className="text-zinc-300 font-semibold text-sm uppercase tracking-wide py-4">
                        Bet Amount
                      </TableHead>
                      <TableHead className="text-zinc-300 font-semibold text-sm uppercase tracking-wide py-4">
                        Profit/Loss
                      </TableHead>
                      <TableHead className="text-zinc-300 font-semibold text-sm uppercase tracking-wide py-4">
                        Status
                      </TableHead>
                      <TableHead className="text-zinc-300 font-semibold text-sm uppercase tracking-wide py-4">
                        Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBets.map((bet, index) => (
                      <TableRow
                        key={bet.id}
                        className="border-b border-[#333447]/50 hover:bg-[#333447]/30 transition-colors duration-200"
                      >
                        <TableCell className="py-4">
                          <div className="font-medium text-zinc-100 truncate max-w-[200px]">
                            {bet.eventName}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="text-zinc-300 text-sm">
                            {bet.market}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="text-zinc-300 text-sm font-medium">
                            {bet.outcome}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="font-mono text-zinc-100 font-medium">
                            {bet.betAmount.toFixed(4)} ETH
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div
                            className={`font-mono font-bold flex items-center gap-2 ${
                              bet.profitLoss > 0
                                ? "text-emerald-400"
                                : bet.profitLoss < 0
                                ? "text-red-400"
                                : "text-zinc-400"
                            }`}
                          >
                            {bet.profitLoss > 0 && (
                              <TrendingUp className="w-4 h-4" />
                            )}
                            {bet.profitLoss < 0 && (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            {bet.profitLoss === 0 && (
                              <Clock className="w-4 h-4" />
                            )}
                            {bet.profitLoss >= 0 ? "+" : ""}
                            {bet.profitLoss.toFixed(4)} ETH
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            className={cn(
                              "font-medium px-3 py-1 rounded-full text-xs border-0",
                              bet.result === "Won" &&
                                "bg-emerald-500/20 text-emerald-400",
                              bet.result === "Lost" &&
                                "bg-red-500/20 text-red-400",
                              bet.result === "In Progress" &&
                                "bg-yellow-500/20 text-yellow-400"
                            )}
                          >
                            {bet.result === "Won" && (
                              <Trophy className="w-3 h-3 mr-1" />
                            )}
                            {bet.result === "In Progress" && (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {bet.result}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="text-zinc-400 text-sm">
                            {format(bet.date, "MMM dd, yyyy 'at' HH:mm")}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
