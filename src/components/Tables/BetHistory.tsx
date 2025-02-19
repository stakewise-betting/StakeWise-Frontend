import { useState } from "react";
import { Search} from "lucide-react";
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
import betHistory from "@/data/betHistory.json";
import { RiChatHistoryFill } from "react-icons/ri";
import { IoCalendar } from "react-icons/io5";

export default function BetHistory() {
  const [date, setDate] = useState<Date>();
  const [searchQuery, setSearchQuery] = useState("");

  const handleReset = () => {
    setSearchQuery("");
    setDate(undefined);
  };

  const filteredBets = betHistory.filter((bet) => {
    const matchesSearch =
      bet.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bet.market.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate =
      !date || format(bet.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
    return matchesSearch && matchesDate;
  });

  return (
    <div className="p-8 rounded-[20px] lg:mx-24 md:mx-16 mx-8 mb-[96px] bg-[#333447] h-[650px] ">
      <div className="space-y-6">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Bet History</h2>
            <div className="text-sm font-bold text-[#A0AEC0] flex items-center gap-2">
              <RiChatHistoryFill className="w-3 h-3 text-[#01B574]" />
              <p className="text-sm text-slate-400">
                {filteredBets.length} bets
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
                {date ? format(date, "PPP"): "Select Date"}
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
          <div className="max-h-[450px] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="border-[#56577A] text-[#A0AEC0] font-medium lg:text-lg text-sm">
                  <TableHead >EVENT NAME</TableHead>
                  <TableHead >MARKET</TableHead>
                  <TableHead >RESULT</TableHead>
                  <TableHead >PROFIT/LOSS</TableHead>
                  <TableHead >DATE</TableHead>
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
                      <TableCell >
                        {bet.eventName}
                      </TableCell>
                      <TableCell>
                        {bet.market}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-3 py-2 rounded  font-medium ${
                            bet.result === "Won"
                              ? "bg-[#00BD58] bg-opacity-15 text-green"
                              : "bg-[#BF3A19] bg-opacity-15 text-red"
                          }`}
                        >
                          {bet.result}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            bet.profitLoss >= 0
                              ? "text-green"
                              : "text-red"
                          }
                        >
                          {bet.profitLoss >= 0 ? "+" : ""}
                          {bet.profitLoss}
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
                      colSpan={6}
                      className="h-[352px] text-center text-slate-400"
                    >
                      No results found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
