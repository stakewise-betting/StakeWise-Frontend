// src/components/admin/dashboard/RecentBetsTable.tsx
import React from "react";
import Web3 from "web3"; // Needed for Wei conversion
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // For better table scrolling
import { Badge } from "@/components/ui/badge"; // To display event ID
import { Clock, User, Tag, Database } from "lucide-react"; // Icons

// Define the structure of a processed bet event
export interface RecentBet {
  transactionHash: string;
  eventId: string;
  bettor: string;
  amount: string; // Store as string (ETH value)
  option: string;
  timestamp: number; // Unix timestamp
  blockNumber: number;
}

interface RecentBetsTableProps {
  bets: RecentBet[];
  loading: boolean;
  web3Instance: Web3 | null; // Pass web3 for formatting if needed, though calculated in AdminPanel
}

// Helper function to shorten addresses (reuse or define locally)
const displayAddress = (address: string): string => {
  if (!address) return "N/A";
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};

// Helper function to format timestamp
const formatTimestamp = (timestamp: number): string => {
  if (!timestamp) return "N/A";
  return new Date(timestamp * 1000).toLocaleString(); // Convert seconds to ms
};

const RecentBetsTable: React.FC<RecentBetsTableProps> = ({
  bets,
  loading,
  web3Instance, // Might not be strictly needed if amount is pre-formatted
}) => {
  const cardBaseClasses = `
    bg-card text-dark-primary rounded-xl shadow-lg
    border border-gray-700/60
    overflow-hidden bg-noise dark h-full flex flex-col
  `; // Ensure card takes height

  return (
    <Card className={cardBaseClasses}>
      <CardHeader className="px-4 pt-4 pb-3 border-b border-gray-700/50 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-secondary" />
          <CardTitle className="text-lg font-semibold text-dark-primary">
            Recent Bets
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-dark-secondary mt-1">
          Latest bets placed across all events
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-grow">
        {" "}
        {/* Remove padding, allow table scroll */}
        <ScrollArea className="h-[400px] w-full">
          {" "}
          {/* Fixed height scroll area */}
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              {" "}
              {/* Sticky header */}
              <TableRow className="border-gray-700/50">
                <TableHead className="w-[150px]">Timestamp</TableHead>
                <TableHead>Event ID</TableHead>
                <TableHead>Bettor</TableHead>
                <TableHead>Option</TableHead>
                <TableHead className="text-right">Amount (ETH)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Show skeleton rows while loading
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="border-gray-700/50">
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  </TableRow>
                ))
              ) : bets.length > 0 ? (
                // Render actual bet rows
                bets.map((bet) => (
                  <TableRow
                    key={bet.transactionHash}
                    className="border-gray-700/50 hover:bg-muted/30"
                  >
                    <TableCell className="font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-dark-secondary" />
                        {formatTimestamp(bet.timestamp)}
                      </div>
                      <div className="text-dark-tertiary text-[10px] mt-0.5">
                        Block: {bet.blockNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">#{bet.eventId}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <User size={12} className="text-dark-secondary" />
                        <a
                          href={`https://sepolia.etherscan.io/address/${bet.bettor}`} // Adjust link for your network
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                          title={bet.bettor}
                        >
                          {displayAddress(bet.bettor)}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Tag size={12} className="text-dark-secondary" />
                        {bet.option}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {bet.amount} ETH
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // Show message if no bets found
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-dark-secondary"
                  >
                    No recent bets found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentBetsTable;
