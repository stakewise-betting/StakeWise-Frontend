import React, { useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import Web3 from "web3";
import {
  Ticket,
  Clock,
  Calendar,
  Trophy,
  MoreVertical,
  Trash2,
  CheckCircle,
  Star,
  Users,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface RaffleData {
  raffleId: number;
  name: string;
  description: string;
  imageURL: string;
  startTime: number;
  endTime: number;
  ticketPrice: number;
  prizeAmount: number;
  isCompleted: boolean;
  winner: string;
  totalTicketsSold: number;
  notificationImageURL: string;
  notificationMessage: string;
  category?: string;
}

interface RaffleListTableProps {
  raffles: RaffleData[];
  onDeleteRaffle: (raffleId: number) => void;
  onSelectWinner: (raffleId: number) => void;
  web3: Web3;
}

const RaffleListTable: React.FC<RaffleListTableProps> = ({
  raffles,
  onDeleteRaffle,
  onSelectWinner,
}) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [winnerConfirmOpen, setWinnerConfirmOpen] = useState(false);
  const [selectedRaffle, setSelectedRaffle] = useState<RaffleData | null>(null);

  // Confirm Delete
  const confirmDelete = (raffle: RaffleData) => {
    setSelectedRaffle(raffle);
    setDeleteConfirmOpen(true);
  };

  // Execute Delete
  const handleDelete = () => {
    if (selectedRaffle) {
      onDeleteRaffle(selectedRaffle.raffleId);
      setDeleteConfirmOpen(false);
    }
  };

  // Confirm Winner Selection
  const confirmSelectWinner = (raffle: RaffleData) => {
    setSelectedRaffle(raffle);
    setWinnerConfirmOpen(true);
  };

  // Execute Winner Selection
  const handleSelectWinner = () => {
    if (selectedRaffle) {
      onSelectWinner(selectedRaffle.raffleId);
      setWinnerConfirmOpen(false);
    }
  };

  // Format timestamp to readable date
  const formatTimestamp = (timestamp: number) => {
    return format(new Date(timestamp * 1000), "MMM dd, yyyy HH:mm");
  };

  // Format time distance
  const getTimeDistance = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    if (timestamp > now) {
      return `In ${formatDistanceToNow(new Date(timestamp * 1000))}`;
    } else {
      return `${formatDistanceToNow(new Date(timestamp * 1000))} ago`;
    }
  };

  // Get status badge
  const getStatusBadge = (raffle: RaffleData) => {
    const now = Math.floor(Date.now() / 1000);

    if (raffle.isCompleted) {
      return (
        <Badge className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-medium px-3 py-1 shadow-md">
          <CheckCircle className="h-3 w-3 mr-1" />✅ Completed
        </Badge>
      );
    } else if (raffle.endTime < now) {
      return (
        <Badge className="bg-gradient-to-r from-[#E27625] to-[#F59E0B] text-white font-medium px-3 py-1 shadow-md animate-pulse">
          <Star className="h-3 w-3 mr-1" />
          🏆 Ready for Winner
        </Badge>
      );
    } else if (raffle.startTime > now) {
      return (
        <Badge className="bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] text-white font-medium px-3 py-1 shadow-md">
          <Clock className="h-3 w-3 mr-1" />⏳ Upcoming
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white font-medium px-3 py-1 shadow-md">
          <Ticket className="h-3 w-3 mr-1" />
          🔴 Active
        </Badge>
      );
    }
  };

  // Check if raffle can be deleted
  const canDelete = (raffle: RaffleData) => {
    const now = Math.floor(Date.now() / 1000);
    return raffle.startTime > now; // Can only delete if not started yet
  };

  // Check if winner can be selected
  const canSelectWinner = (raffle: RaffleData) => {
    const now = Math.floor(Date.now() / 1000);
    return (
      raffle.endTime < now && !raffle.isCompleted && raffle.totalTicketsSold > 0
    );
  };

  // Sort raffles by status and creation date
  const sortedRaffles = [...raffles].sort((a, b) => {
    const now = Math.floor(Date.now() / 1000);

    // Priority: 1. Ready for winner, 2. Active, 3. Upcoming, 4. Completed
    const getStatusPriority = (raffle: RaffleData) => {
      if (raffle.endTime < now && !raffle.isCompleted) return 1; // Ready for winner
      if (raffle.startTime <= now && raffle.endTime >= now) return 2; // Active
      if (raffle.startTime > now) return 3; // Upcoming
      return 4; // Completed
    };

    const aPriority = getStatusPriority(a);
    const bPriority = getStatusPriority(b);

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // Then sort by end date (soonest first)
    return a.endTime - b.endTime;
  });

  return (
    <div className="bg-gradient-to-r from-[#1C1C27] to-[#252538] rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl shadow-black/20">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] hover:from-[#2A2A3E] hover:to-[#252538] border-b border-gray-700/50">
            <TableHead className="w-[50px] text-center text-white font-semibold">
              #
            </TableHead>
            <TableHead className="min-w-[200px] text-white font-semibold">
              🎟️ Raffle
            </TableHead>
            <TableHead className="text-center text-white font-semibold">
              📂 Category
            </TableHead>
            <TableHead className="text-center text-white font-semibold">
              💰 Price/Prize
            </TableHead>
            <TableHead className="text-center text-white font-semibold">
              ⏰ Timeline
            </TableHead>
            <TableHead className="text-center text-white font-semibold">
              📊 Status
            </TableHead>
            <TableHead className="text-center text-white font-semibold">
              👥 Participants
            </TableHead>
            <TableHead className="text-center w-[100px] text-white font-semibold">
              ⚙️ Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRaffles.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-12 bg-gradient-to-b from-[#1C1C27] to-[#252538]"
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#E27625]/20 to-[#F59E0B]/20 flex items-center justify-center">
                    <Ticket className="h-8 w-8 text-[#E27625]" />
                  </div>
                  <div className="text-gray-400 text-lg">
                    No raffle draws found
                  </div>
                  <div className="text-gray-500 text-sm">
                    Create your first raffle to get started!
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            sortedRaffles.map((raffle, index) => (
              <TableRow
                key={raffle.raffleId}
                className={`hover:bg-gradient-to-r hover:from-[#252538]/50 hover:to-[#2A2A3E]/50 transition-all duration-300 border-b border-gray-700/30 ${
                  index % 2 === 0 ? "bg-[#1C1C27]" : "bg-[#252538]/20"
                }`}
              >
                <TableCell className="text-center font-mono text-[#E27625] font-bold text-lg">
                  #{raffle.raffleId}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-gradient-to-br from-[#252538] to-[#2A2A3E] border-2 border-gray-600/50 shadow-lg">
                      {raffle.imageURL ? (
                        <img
                          src={raffle.imageURL}
                          alt={raffle.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Ticket className="h-6 w-6 text-[#E27625]" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-white text-lg truncate">
                        {raffle.name}
                      </div>
                      <div className="text-sm text-gray-400 truncate max-w-xs mt-1">
                        {raffle.description.substring(0, 60)}
                        {raffle.description.length > 60 ? "..." : ""}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge className="bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] text-white font-medium px-3 py-1 shadow-md">
                    📂 {raffle.category || "General"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-center text-sm space-y-2">
                    <div className="flex items-center bg-gradient-to-r from-[#E27625]/10 to-[#F59E0B]/10 px-3 py-1 rounded-full border border-[#E27625]/30">
                      <Ticket className="h-4 w-4 mr-2 text-[#E27625]" />
                      <span className="text-white font-medium">
                        {raffle.ticketPrice} ETH
                      </span>
                    </div>
                    <div className="flex items-center bg-gradient-to-r from-[#10B981]/10 to-[#059669]/10 px-3 py-1 rounded-full border border-[#10B981]/30">
                      <Trophy className="h-4 w-4 mr-2 text-[#10B981]" />
                      <span className="text-white font-bold">
                        {raffle.prizeAmount} ETH
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-center text-sm space-y-2">
                    <div className="flex items-center bg-gradient-to-r from-[#3B82F6]/10 to-[#1D4ED8]/10 px-3 py-1 rounded-full border border-[#3B82F6]/30">
                      <Calendar className="h-4 w-4 mr-2 text-[#3B82F6]" />
                      <span className="text-white text-xs">
                        {formatTimestamp(raffle.startTime)}
                      </span>
                    </div>
                    <div className="flex items-center bg-gradient-to-r from-[#E27625]/10 to-[#F59E0B]/10 px-3 py-1 rounded-full border border-[#E27625]/30">
                      <Clock className="h-4 w-4 mr-2 text-[#E27625]" />
                      <span className="text-white font-medium text-xs">
                        {getTimeDistance(raffle.endTime)}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {getStatusBadge(raffle)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center bg-gradient-to-r from-[#3B82F6]/10 to-[#1D4ED8]/10 px-3 py-2 rounded-full border border-[#3B82F6]/30">
                      <Users className="h-4 w-4 mr-2 text-[#3B82F6]" />
                      <span className="text-white font-semibold">
                        {raffle.totalTicketsSold}
                      </span>
                      <span className="text-gray-400 text-xs ml-1">
                        tickets
                      </span>
                    </div>
                    {raffle.isCompleted && raffle.winner && (
                      <div className="bg-gradient-to-r from-[#10B981]/10 to-[#059669]/10 px-2 py-1 rounded-full border border-[#10B981]/30">
                        <div className="text-xs text-[#10B981] font-medium flex items-center">
                          <Trophy className="h-3 w-3 mr-1" />
                          🏆 Winner: {raffle.winner.substring(0, 6)}...
                        </div>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-10 w-10 p-0 bg-gradient-to-r from-[#252538] to-[#2A2A3E] hover:from-[#2A2A3E] hover:to-[#252538] text-gray-400 hover:text-white border border-gray-600/50 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-gradient-to-br from-[#252538] to-[#2A2A3E] border-gray-600/50 shadow-2xl backdrop-blur-sm"
                      >
                        {/* Show select winner option if eligible */}
                        {canSelectWinner(raffle) && (
                          <DropdownMenuItem
                            className="text-[#E27625] hover:text-[#F59E0B] hover:bg-[#E27625]/10 transition-colors duration-200 cursor-pointer"
                            onClick={() => confirmSelectWinner(raffle)}
                          >
                            <Trophy className="h-4 w-4 mr-2" />
                            🏆 Select Winner
                          </DropdownMenuItem>
                        )}

                        {/* Delete option - only for upcoming raffles */}
                        {canDelete(raffle) && (
                          <>
                            <DropdownMenuSeparator className="bg-gray-700/50" />
                            <DropdownMenuItem
                              className="text-[#EF4444] hover:text-[#DC2626] hover:bg-[#EF4444]/10 transition-colors duration-200 cursor-pointer"
                              onClick={() => confirmDelete(raffle)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              🗑️ Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="bg-gradient-to-br from-[#1C1C27] to-[#252538] border-gray-600/50 shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#EF4444] to-[#DC2626] flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-white" />
              </div>
              🗑️ Delete Raffle
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-base mt-2">
              Are you sure you want to delete this raffle? This action cannot be
              undone and will permanently remove all data.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            {selectedRaffle && (
              <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-xl p-4 border border-gray-600/50 shadow-inner">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-gradient-to-br from-[#2A2A3E] to-[#1C1C27] border-2 border-gray-600/50 shadow-lg">
                    {selectedRaffle.imageURL ? (
                      <img
                        src={selectedRaffle.imageURL}
                        alt={selectedRaffle.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Ticket className="h-6 w-6 text-[#E27625]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-lg">
                      {selectedRaffle.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      ID: #{selectedRaffle.raffleId}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex space-x-3 justify-end bg-gradient-to-r from-[#252538]/50 to-[#2A2A3E]/50 p-4 rounded-b-xl -mx-6 -mb-6">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] hover:from-[#2A2A3E] hover:to-[#252538] border-gray-600/50 text-white hover:text-white transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#EF4444] text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-[#EF4444]/30"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Raffle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Select Winner Confirmation Dialog */}
      <Dialog open={winnerConfirmOpen} onOpenChange={setWinnerConfirmOpen}>
        <DialogContent className="bg-gradient-to-br from-[#1C1C27] to-[#252538] border-gray-600/50 shadow-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#E27625] to-[#F59E0B] flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              🏆 Select Winner
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-base mt-2">
              Are you sure you want to select a winner for this raffle now? This
              action cannot be undone and will automatically transfer the prize.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            {selectedRaffle && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-xl p-4 border border-gray-600/50 shadow-inner">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-gradient-to-br from-[#2A2A3E] to-[#1C1C27] border-2 border-gray-600/50 shadow-lg">
                      {selectedRaffle.imageURL ? (
                        <img
                          src={selectedRaffle.imageURL}
                          alt={selectedRaffle.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Ticket className="h-6 w-6 text-[#E27625]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-lg">
                        {selectedRaffle.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        ID: #{selectedRaffle.raffleId}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-[#10B981]/10 to-[#059669]/10 p-4 rounded-xl border border-[#10B981]/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="h-5 w-5 text-[#10B981]" />
                      <div className="text-sm text-gray-400">Prize Amount</div>
                    </div>
                    <div className="font-bold text-[#10B981] text-xl">
                      {selectedRaffle.prizeAmount} ETH
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-[#3B82F6]/10 to-[#1D4ED8]/10 p-4 rounded-xl border border-[#3B82F6]/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-[#3B82F6]" />
                      <div className="text-sm text-gray-400">Tickets Sold</div>
                    </div>
                    <div className="font-bold text-[#3B82F6] text-xl">
                      {selectedRaffle.totalTicketsSold}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#E27625]/10 to-[#F59E0B]/10 p-4 rounded-xl border border-[#E27625]/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-5 w-5 text-[#E27625]" />
                    <div className="text-white font-semibold">
                      Winner Selection Process
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>
                      • The winner will be selected randomly from all
                      participants who purchased tickets
                    </p>
                    <p>
                      • Prize funds will be automatically transferred to the
                      winner's wallet
                    </p>
                    <p>• This action is irreversible once confirmed</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex space-x-3 justify-end bg-gradient-to-r from-[#252538]/50 to-[#2A2A3E]/50 p-4 rounded-b-xl -mx-6 -mb-6">
            <Button
              variant="outline"
              onClick={() => setWinnerConfirmOpen(false)}
              className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] hover:from-[#2A2A3E] hover:to-[#252538] border-gray-600/50 text-white hover:text-white transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSelectWinner}
              className="bg-gradient-to-r from-[#E27625] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#E27625] text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-[#E27625]/30"
            >
              <Trophy className="h-4 w-4 mr-2" />
              🏆 Draw Winner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RaffleListTable;
