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
import {
  Clock,
  RefreshCw,
  Activity,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useUserBets, UserBet } from "@/hooks/useUserBets";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function OngoingTable(): JSX.Element {
  const { bets, loading, error, refreshBets } = useUserBets();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Filter bets to only show those still in progress
  const inProgressBets = bets.filter((bet) => bet.status === "In Progress");

  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await refreshBets();
    setTimeout(() => setRefreshing(false), 1000); // Visual feedback
  };

  return (
    <div className="lg:mx-24 md:mx-16 mx-8 mb-16">
      <Card className="bg-gradient-to-br from-[#1C1C27] via-[#252538] to-[#1C1C27] border border-[#333447] shadow-2xl rounded-2xl overflow-hidden">
        {/* Header Section */}
        <CardHeader className="bg-gradient-to-r from-[#F59E0B]/10 to-[#FBBF24]/10 border-b border-[#333447]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] rounded-xl shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-zinc-100">
                  Active Bets
                </CardTitle>
                <CardDescription className="text-lg text-zinc-400 flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-[#F59E0B]" />
                  {inProgressBets.length} bets in progress
                </CardDescription>
              </div>
            </div>

            <Button
              onClick={handleRefresh}
              disabled={loading || refreshing}
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-[#2A2A3A] to-[#1C1C27] border border-[#333447] hover:border-[#F59E0B]/50 hover:bg-[#F59E0B]/10 transition-all duration-200 text-zinc-300 hover:text-white"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {error ? (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
              <p className="text-red-400 text-lg font-medium">
                Error loading active bets
              </p>
              <p className="text-zinc-500 text-sm mt-2">
                {error}. Please make sure your wallet is connected.
              </p>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin h-8 w-8 border-2 border-[#F59E0B] border-t-transparent rounded-full mb-4" />
              <p className="text-zinc-400 text-lg">
                Loading your active bets...
              </p>
            </div>
          ) : inProgressBets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Clock className="h-12 w-12 text-zinc-500 mb-4" />
              <p className="text-zinc-400 text-lg font-medium">
                No active bets
              </p>
              <p className="text-zinc-500 text-sm">
                You don't have any bets in progress at the moment.
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-xl overflow-hidden">
              <Table>
                <TableHeader className="bg-gradient-to-r from-[#2A2A3A] to-[#1C1C27]">
                  <TableRow className="border-b border-[#333447] hover:bg-transparent">
                    <TableHead className="text-zinc-300 font-semibold text-sm uppercase tracking-wide py-4">
                      Event Name
                    </TableHead>
                    <TableHead className="text-zinc-300 font-semibold text-sm uppercase tracking-wide py-4">
                      Market
                    </TableHead>
                    <TableHead className="text-zinc-300 font-semibold text-sm uppercase tracking-wide py-4">
                      Outcome
                    </TableHead>
                    <TableHead className="text-zinc-300 font-semibold text-sm uppercase tracking-wide py-4">
                      Odds
                    </TableHead>
                    <TableHead className="text-zinc-300 font-semibold text-sm uppercase tracking-wide py-4">
                      Status
                    </TableHead>
                    <TableHead className="text-zinc-300 font-semibold text-sm uppercase tracking-wide py-4 w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inProgressBets.map((bet: UserBet, index: number) => (
                    <TableRow
                      key={`${bet.eventId}-${index}`}
                      className="border-b border-[#333447]/50 hover:bg-[#333447]/30 transition-colors duration-200"
                    >
                      <TableCell className="py-4">
                        <div className="font-medium text-zinc-100 truncate max-w-[250px]">
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
                          {bet.price}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-0 font-medium px-3 py-1 rounded-full text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {bet.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 rounded-full hover:bg-[#333447] flex items-center justify-center text-zinc-400 hover:text-white p-0"
                        >
                          <span className="text-lg leading-none">⋮</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
