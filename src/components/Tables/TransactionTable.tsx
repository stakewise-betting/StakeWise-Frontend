import * as React from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
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
import transactionHistory from "@/data/transactionHistory.json";

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
  const [date, setDate] = React.useState<Date>();
  const [status, setStatus] = React.useState<string>("");
  const [transactionType, setTransactionType] = React.useState<string>("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(5); // Number of items per page

  // Filter transactions based on selected filters
  const filteredTransactions = React.useMemo(() => {
    return transactionHistory.filter((transaction) => {
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
  }, [status, transactionType, date]);

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

  return (
    <div className="p-8 rounded-[20px] lg:mx-24 md:mx-16 mx-8 mb-[96px] bg-[#333447] min-h-[550px] space-y-6">
      <div className="">
        <h2 className="text-[20px] font-bold ">Transaction Details</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 items-center justify-center lg:w-1/2 md:w-3/4 w-full gap-5 ">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="bg-[#E27625] border-none rounded-[10px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-[#1C1C27] border-none rounded-[10px]">
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in progress">In Progress</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={transactionType} onValueChange={setTransactionType}>
          <SelectTrigger className="bg-[#E27625] border-none rounded-[10px]">
            <SelectValue placeholder="Transaction Type" />
          </SelectTrigger>
          <SelectContent className="bg-[#1C1C27] border-none text-white rounded-[10px]" >
            <SelectItem value="deposit">Deposit</SelectItem>
            <SelectItem value="withdrawal">Withdrawal</SelectItem>
            <SelectItem value="refund">Refund</SelectItem>
          </SelectContent>
        </Select>

        <Popover >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                "bg-[#E27625] border-none rounded-[10px] md:col-span-2 text-center",
                date && "text-white"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Select Date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-[#1C1C27] border-none rounded-[10px] shadow-lg">
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
          className={cn(
            " bg-[#E27625] border-none rounded-[10px]",
            !status &&
              !transactionType &&
              !date &&
              "opacity-50 cursor-not-allowed"
          )}
          onClick={() => {
            setStatus("");
            setTransactionType("");
            setDate(undefined);
          }}
          disabled={!status && !transactionType && !date}
        >
          Clear
        </Button>
      </div>

      <div className="rounded-[20px] max-h-[500px]">
        <Table>
          <TableHeader className="">
            <TableRow className="border-[#56577A] text-[#A0AEC0] font-medium lg:text-lg text-sm">
              <TableHead>EVENT ID</TableHead>
              <TableHead>EVENT NAME</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>TRANSACTION TYPE</TableHead>
              <TableHead>AMOUNT</TableHead>
              <TableHead>STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction, index) => (
                <TableRow
                  key={index}
                  className="border-[#56577A] hover:bg-slate-800 lg:text-sm text-xs"
                >
                  <TableCell>{transaction.eventId}</TableCell>
                  <TableCell>{transaction.eventName}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    <span
                      className={cn("px-3 py-2 rounded font-medium text-sm", {
                        "bg-blue-500/10 text-blue-500":
                          transaction.transactionType === "Deposit",
                        "bg-orange-500/10 text-orange-500":
                          transaction.transactionType === "Withdrawal",
                        "bg-purple-500/10 text-purple-500":
                          transaction.transactionType === "Refund",
                      })}
                    >
                      {transaction.transactionType}
                    </span>
                  </TableCell>
                  <TableCell
                    className={cn("font-medium", {
                      "text-blue-500":
                        transaction.transactionType === "Deposit",
                      "text-orange-500":
                        transaction.transactionType === "Withdrawal",
                      "text-purple-500":
                        transaction.transactionType === "Refund",
                    })}
                  >
                    {transaction.amount}
                  </TableCell>
                  <TableCell className="text-white">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn("h-2 w-2 rounded-full", {
                          "bg-green-500": transaction.status === "Completed",
                          "bg-orange-500": transaction.status === "In Progress",
                          "bg-red-500": transaction.status === "Failed",
                        })}
                      />
                      {transaction.status}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-slate-400"
                >
                  No transactions found matching the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Part */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-400">
          Showing{" "}
          <span className="font-medium">
            {Math.min(
              (currentPage - 1) * pageSize + 1,
              filteredTransactions.length
            )}
            {" - "}
            {Math.min(currentPage * pageSize, filteredTransactions.length)}
          </span>{" "}
          of <span className="font-medium">{filteredTransactions.length}</span>
        </div>

        {totalPages > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
