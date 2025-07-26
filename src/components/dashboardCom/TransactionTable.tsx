import * as React from "react";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useUserTransactions } from "@/hooks/useUserTransactions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = React.useMemo(() => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisible, 1);
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  }, [currentPage, totalPages]);

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        className="w-8 h-8 bg-slate-800 border-slate-700"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          variant="outline"
          size="icon"
          className={cn("w-8 h-8", {
            "bg-orange-500 border-none": currentPage === page,
            "bg-slate-800 border-none": currentPage !== page,
          })}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        className="w-8 h-8 bg-slate-800 border-slate-700"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  );
}

export default function TransactionTable() {
  const { transactions, loading, error } = useUserTransactions();
  const [date, setDate] = React.useState<Date>();
  const [status, setStatus] = React.useState<string>("");
  const [transactionType, setTransactionType] = React.useState<string>("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(5); // Number of items per page

  // Map blockchain transactions to match previous UI data structure
  const mappedTransactions = React.useMemo(() => {
    return transactions.map((tx) => ({
      eventId: tx.txHash, // Use txHash as a substitute for eventId
      eventName: tx.eventName,
      date: tx.date.toLocaleString(),
      transactionType: tx.type, // "Bet Placed" or "Winnings Received"
      amount: tx.amount,
      status: "Completed", // Assume all blockchain transactions are completed
    }));
  }, [transactions]);

  // Filter transactions based on selected filters
  const filteredTransactions = React.useMemo(() => {
    return mappedTransactions.filter((transaction) => {
      // Status filter
      if (status && transaction.status.toLowerCase() !== status.toLowerCase()) {
        return false;
      }

      // Transaction type filter
      if (
        transactionType &&
        transaction.transactionType.toLowerCase() !==
          transactionType.toLowerCase()
      ) {
        return false;
      }

      // Date filter
      if (date) {
        const transactionDate = new Date(transaction.date);
        const filterDate = new Date(date);

        if (
          transactionDate.getDate() !== filterDate.getDate() ||
          transactionDate.getMonth() !== filterDate.getMonth() ||
          transactionDate.getFullYear() !== filterDate.getFullYear()
        ) {
          return false;
        }
      }

      return true;
    });
  }, [mappedTransactions, status, transactionType, date]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / pageSize);
  const paginatedTransactions = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(startIndex, startIndex + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredTransactions]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="lg:mx-24 md:mx-16 mx-8 mb-[96px]">
        <Card className="bg-gradient-to-br from-[#1C1C27] via-[#252538] to-[#1C1C27] border border-[#333447] shadow-2xl rounded-2xl">
          <CardContent className="p-16">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin h-8 w-8 border-2 border-[#10B981] border-t-transparent rounded-full mb-4" />
              <p className="text-zinc-400 text-lg">Loading transactions...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Suppress wallet connection errors and show empty state instead
  const isWalletError = error && error.toLowerCase().includes("wallet");

  return (
    <div className="lg:mx-24 md:mx-16 mx-8 mb-[96px]">
      <Card className="bg-gradient-to-br from-[#1C1C27] via-[#252538] to-[#1C1C27] border border-[#333447] shadow-2xl rounded-2xl overflow-hidden">
        {/* Header Section */}
        <CardHeader className="bg-gradient-to-r from-[#10B981]/10 to-[#34D399]/10 border-b border-[#333447]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-xl shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-zinc-100">
                Transaction History
              </CardTitle>
              <CardDescription className="text-lg text-zinc-400 mt-1">
                Track all your betting activities and transactions
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Filters Section */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:w-2/3 md:w-3/4 w-full">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] hover:border-[#10B981]/50 rounded-xl transition-all duration-200">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-xl shadow-2xl">
                <SelectItem
                  value="completed"
                  className="hover:bg-[#10B981]/10 focus:bg-[#10B981]/10"
                >
                  Completed
                </SelectItem>
                <SelectItem
                  value="in progress"
                  className="hover:bg-[#F59E0B]/10 focus:bg-[#F59E0B]/10"
                >
                  In Progress
                </SelectItem>
                <SelectItem
                  value="failed"
                  className="hover:bg-[#EF4444]/10 focus:bg-[#EF4444]/10"
                >
                  Failed
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger className="bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] hover:border-[#3B82F6]/50 rounded-xl transition-all duration-200">
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-xl shadow-2xl">
                <SelectItem
                  value="Bet Placed"
                  className="hover:bg-[#3B82F6]/10 focus:bg-[#3B82F6]/10"
                >
                  Bet Placed
                </SelectItem>
                <SelectItem
                  value="Winnings Received"
                  className="hover:bg-[#10B981]/10 focus:bg-[#10B981]/10"
                >
                  Winnings Received
                </SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start font-normal md:col-span-2 bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] hover:border-[#8B5CF6]/50 rounded-xl transition-all duration-200",
                    date && "border-[#8B5CF6]/50 bg-[#8B5CF6]/10"
                  )}
                >
                  <CalendarIcon className="mr-3 h-5 w-5 text-[#8B5CF6]" />
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
              onClick={() => {
                setStatus("");
                setTransactionType("");
                setDate(undefined);
              }}
              disabled={!status && !transactionType && !date}
              className="bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] hover:border-[#E27625]/50 hover:bg-[#E27625]/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 text-zinc-300 hover:text-white"
            >
              Clear Filters
            </Button>
          </div>

          {/* Table Section */}
          <div className="bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-xl overflow-hidden">
            {paginatedTransactions.length > 0 ? (
              <div className="max-h-[500px] overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-gradient-to-r from-[#2A2A3A] to-[#1C1C27]">
                    <TableRow className="border-b border-[#333447] hover:bg-transparent">
                      <TableHead className="text-zinc-300 font-semibold text-sm uppercase tracking-wide py-4">
                        Event Name
                      </TableHead>
                      <TableHead className="text-zinc-300 font-semibold text-sm uppercase tracking-wide py-4">
                        Date
                      </TableHead>
                      <TableHead className="text-zinc-300 font-semibold text-sm uppercase tracking-wide py-4">
                        Type
                      </TableHead>
                      <TableHead className="text-zinc-300 font-semibold text-sm uppercase tracking-wide py-4">
                        Amount
                      </TableHead>
                      <TableHead className="text-zinc-300 font-semibold text-sm uppercase tracking-wide py-4">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.map((transaction, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-[#333447]/50 hover:bg-[#333447]/30 transition-colors duration-200"
                      >
                        <TableCell className="py-4">
                          <div className="font-medium text-zinc-100 truncate max-w-[200px]">
                            {transaction.eventName}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="text-zinc-300 text-sm">
                            {transaction.date}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            className={cn(
                              "font-medium px-3 py-1 rounded-full text-xs border-0",
                              transaction.transactionType === "Bet Placed" &&
                                "bg-[#3B82F6]/20 text-[#3B82F6]",
                              transaction.transactionType ===
                                "Winnings Received" &&
                                "bg-emerald-500/20 text-emerald-400"
                            )}
                          >
                            {transaction.transactionType === "Bet Placed" && (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {transaction.transactionType ===
                              "Winnings Received" && (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            )}
                            {transaction.transactionType}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <div
                            className={cn(
                              "font-mono font-bold flex items-center gap-2",
                              transaction.transactionType === "Bet Placed" &&
                                "text-[#3B82F6]",
                              transaction.transactionType ===
                                "Winnings Received" && "text-emerald-400"
                            )}
                          >
                            {transaction.transactionType === "Bet Placed" && (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            {transaction.transactionType ===
                              "Winnings Received" && (
                              <TrendingUp className="w-4 h-4" />
                            )}
                            {transaction.amount}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            className={cn(
                              "font-medium px-3 py-1 rounded-full text-xs border-0",
                              transaction.status === "Completed" &&
                                "bg-emerald-500/20 text-emerald-400",
                              transaction.status === "In Progress" &&
                                "bg-yellow-500/20 text-yellow-400",
                              transaction.status === "Failed" &&
                                "bg-red-500/20 text-red-400"
                            )}
                          >
                            {transaction.status === "In Progress" && (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : isWalletError || paginatedTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <CreditCard className="h-12 w-12 text-zinc-500 mb-4" />
                <p className="text-zinc-400 text-lg font-medium">
                  No transactions found
                </p>
                <p className="text-zinc-500 text-sm">
                  No transactions match the selected filters
                </p>
              </div>
            ) : null}
          </div>

          {/* Pagination Section */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-[#333447]">
              <div className="text-sm text-zinc-400">
                Showing{" "}
                <span className="font-medium text-zinc-300">
                  {Math.min(
                    (currentPage - 1) * pageSize + 1,
                    filteredTransactions.length
                  )}
                  {" - "}
                  {Math.min(
                    currentPage * pageSize,
                    filteredTransactions.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-zinc-300">
                  {filteredTransactions.length}
                </span>{" "}
                transactions
              </div>

              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
