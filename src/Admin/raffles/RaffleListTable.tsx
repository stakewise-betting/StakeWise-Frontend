// //Admin/raffles/RaffleListTable.tsx
// import React, { useState } from "react";
// import { formatDistanceToNow, format } from "date-fns";
// import Web3 from "web3";
// import {
//   Ticket,
//   Clock,
//   Calendar,
//   Trophy,
//   MoreVertical,
//   Trash2,
//   Edit,
//   CheckCircle,
//   Star,
//   Users,
//   CoinsIcon,
// } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";

// interface RaffleData {
//   raffleId: number;
//   name: string;
//   description: string;
//   imageURL: string;
//   startTime: number;
//   endTime: number;
//   ticketPrice: number;
//   prizeAmount: number;
//   isCompleted: boolean;
//   winner: string;
//   totalTicketsSold: number;
//   notificationImageURL: string;
//   notificationMessage: string;
//   category?: string;
// }

// interface RaffleListTableProps {
//   raffles: RaffleData[];
//   onDeleteRaffle: (raffleId: number) => void;
//   onSelectWinner: (raffleId: number) => void;
//   web3: Web3;
// }

// const RaffleListTable: React.FC<RaffleListTableProps> = ({
//   raffles,
//   onDeleteRaffle,
//   onSelectWinner,
//   web3,
// }) => {
//   const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
//   const [winnerConfirmOpen, setWinnerConfirmOpen] = useState(false);
//   const [selectedRaffle, setSelectedRaffle] = useState<RaffleData | null>(null);

//   // Confirm Delete
//   const confirmDelete = (raffle: RaffleData) => {
//     setSelectedRaffle(raffle);
//     setDeleteConfirmOpen(true);
//   };

//   // Execute Delete
//   const handleDelete = () => {
//     if (selectedRaffle) {
//       onDeleteRaffle(selectedRaffle.raffleId);
//       setDeleteConfirmOpen(false);
//     }
//   };

//   // Confirm Winner Selection
//   const confirmSelectWinner = (raffle: RaffleData) => {
//     setSelectedRaffle(raffle);
//     setWinnerConfirmOpen(true);
//   };

//   // Execute Winner Selection
//   const handleSelectWinner = () => {
//     if (selectedRaffle) {
//       onSelectWinner(selectedRaffle.raffleId);
//       setWinnerConfirmOpen(false);
//     }
//   };

//   // Format timestamp to readable date
//   const formatTimestamp = (timestamp: number) => {
//     return format(new Date(timestamp * 1000), "MMM dd, yyyy HH:mm");
//   };

//   // Format time distance
//   const getTimeDistance = (timestamp: number) => {
//     const now = Math.floor(Date.now() / 1000);
//     if (timestamp > now) {
//       return `In ${formatDistanceToNow(new Date(timestamp * 1000))}`;
//     } else {
//       return `${formatDistanceToNow(new Date(timestamp * 1000))} ago`;
//     }
//   };

//   // Get status badge
//   const getStatusBadge = (raffle: RaffleData) => {
//     const now = Math.floor(Date.now() / 1000);
    
//     if (raffle.isCompleted) {
//       return (
//         <Badge className="bg-green-700 hover:bg-green-800">
//           <CheckCircle className="h-3 w-3 mr-1" />
//           Completed
//         </Badge>
//       );
//     } else if (raffle.endTime < now) {
//       return (
//         <Badge className="bg-orange-600 hover:bg-orange-700">
//           <Star className="h-3 w-3 mr-1" />
//           Ready for Winner
//         </Badge>
//       );
//     } else if (raffle.startTime > now) {
//       return (
//         <Badge variant="outline" className="border-blue-500 text-blue-500">
//           <Clock className="h-3 w-3 mr-1" />
//           Upcoming
//         </Badge>
//       );
//     } else {
//       return (
//         <Badge className="bg-purple-600 hover:bg-purple-700">
//           <Ticket className="h-3 w-3 mr-1" />
//           Active
//         </Badge>
//       );
//     }
//   };

//   // Check if raffle can be deleted
//   const canDelete = (raffle: RaffleData) => {
//     const now = Math.floor(Date.now() / 1000);
//     return raffle.startTime > now; // Can only delete if not started yet
//   };

//   // Check if winner can be selected
//   const canSelectWinner = (raffle: RaffleData) => {
//     const now = Math.floor(Date.now() / 1000);
//     return raffle.endTime < now && !raffle.isCompleted && raffle.totalTicketsSold > 0;
//   };

//   // Sort raffles by status and creation date
//   const sortedRaffles = [...raffles].sort((a, b) => {
//     const now = Math.floor(Date.now() / 1000);
    
//     // Priority: 1. Ready for winner, 2. Active, 3. Upcoming, 4. Completed
//     const getStatusPriority = (raffle: RaffleData) => {
//       if (raffle.endTime < now && !raffle.isCompleted) return 1; // Ready for winner
//       if (raffle.startTime <= now && raffle.endTime >= now) return 2; // Active
//       if (raffle.startTime > now) return 3; // Upcoming
//       return 4; // Completed
//     };
    
//     const aPriority = getStatusPriority(a);
//     const bPriority = getStatusPriority(b);
    
//     if (aPriority !== bPriority) {
//       return aPriority - bPriority;
//     }
    
//     // Then sort by end date (soonest first)
//     return a.endTime - b.endTime;
//   });

//   return (
//     <div className="rounded-md border border-gray-700 overflow-hidden">
//       <Table>
//         <TableHeader>
//           <TableRow className="bg-gray-800/50 hover:bg-gray-800">
//             <TableHead className="w-[50px] text-center">#</TableHead>
//             <TableHead className="min-w-[200px]">Raffle</TableHead>
//             <TableHead className="text-center">Category</TableHead>
//             <TableHead className="text-center">Price/Prize</TableHead>
//             <TableHead className="text-center">Timeline</TableHead>
//             <TableHead className="text-center">Status</TableHead>
//             <TableHead className="text-center">Participants</TableHead>
//             <TableHead className="text-center w-[100px]">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {sortedRaffles.length === 0 ? (
//             <TableRow>
//               <TableCell colSpan={8} className="text-center py-8 text-gray-400">
//                 No raffle draws found. Create your first raffle!
//               </TableCell>
//             </TableRow>
//           ) : (
//             sortedRaffles.map((raffle) => (
//               <TableRow key={raffle.raffleId} className="hover:bg-gray-800/30">
//                 <TableCell className="text-center font-mono">
//                   {raffle.raffleId}
//                 </TableCell>
//                 <TableCell>
//                   <div className="flex items-center space-x-3">
//                     <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-700 border border-gray-600">
//                       {raffle.imageURL ? (
//                         <img
//                           src={raffle.imageURL}
//                           alt={raffle.name}
//                           className="h-full w-full object-cover"
//                         />
//                       ) : (
//                         <div className="h-full w-full flex items-center justify-center">
//                           <Ticket className="h-5 w-5 text-gray-400" />
//                         </div>
//                       )}
//                     </div>
//                     <div>
//                       <div className="font-medium">{raffle.name}</div>
//                       <div className="text-sm text-gray-400 truncate max-w-xs">
//                         {raffle.description.substring(0, 50)}
//                         {raffle.description.length > 50 ? "..." : ""}
//                       </div>
//                     </div>
//                   </div>
//                 </TableCell>
//                 <TableCell className="text-center">
//                   <Badge variant="outline">
//                     {raffle.category || "General"}
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <div className="flex flex-col items-center text-sm">
//                     <div className="flex items-center text-gray-400">
//                       <Ticket className="h-4 w-4 mr-1" />
//                       <span>{raffle.ticketPrice} ETH</span>
//                     </div>
//                     <div className="flex items-center text-green-500 font-medium mt-1">
//                       <Trophy className="h-4 w-4 mr-1" />
//                       <span>{raffle.prizeAmount} ETH</span>
//                     </div>
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <div className="flex flex-col items-center text-sm">
//                     <div className="flex items-center text-gray-400">
//                       <Calendar className="h-4 w-4 mr-1" />
//                       <span>
//                         {formatTimestamp(raffle.startTime)}
//                       </span>
//                     </div>
//                     <div className="flex items-center text-orange-500 font-medium mt-1">
//                       <Clock className="h-4 w-4 mr-1" />
//                       <span>
//                         {getTimeDistance(raffle.endTime)}
//                       </span>
//                     </div>
//                   </div>
//                 </TableCell>
//                 <TableCell className="text-center">
//                   {getStatusBadge(raffle)}
//                 </TableCell>
//                 <TableCell className="text-center">
//                   <div className="flex flex-col items-center">
//                     <div className="flex items-center">
//                       <Users className="h-4 w-4 mr-1 text-gray-400" />
//                       <span>{raffle.totalTicketsSold} tickets</span>
//                     </div>
//                     {raffle.isCompleted && raffle.winner && (
//                       <div className="text-xs text-green-500 mt-1 flex items-center">
//                         <Trophy className="h-3 w-3 mr-1" />
//                         <span>Winner: {raffle.winner.substring(0, 6)}...</span>
//                       </div>
//                     )}
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <div className="flex justify-center">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           className="h-8 w-8 p-0 text-gray-400 hover:text-white"
//                         >
//                           <MoreVertical className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
//                         {/* Show select winner option if eligible */}
//                         {canSelectWinner(raffle) && (
//                           <DropdownMenuItem
//                             className="text-orange-500 hover:text-orange-400"
//                             onClick={() => confirmSelectWinner(raffle)}
//                           >
//                             <Trophy className="h-4 w-4 mr-2" />
//                             Select Winner
//                           </DropdownMenuItem>
//                         )}
                        
//                         {/* Delete option - only for upcoming raffles */}
//                         {canDelete(raffle) && (
//                           <>
//                             <DropdownMenuSeparator className="bg-gray-700" />
//                             <DropdownMenuItem
//                               className="text-red-500 hover:text-red-400"
//                               onClick={() => confirmDelete(raffle)}
//                             >
//                               <Trash2 className="h-4 w-4 mr-2" />
//                               Delete
//                             </DropdownMenuItem>
//                           </>
//                         )}
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
//         <DialogContent className="bg-gray-900 border-gray-700">
//           <DialogHeader>
//             <DialogTitle>Delete Raffle</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete this raffle? This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="py-4">
//             {selectedRaffle && (
//               <div className="flex items-center space-x-3">
//                 <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-700 border border-gray-600">
//                   {selectedRaffle.imageURL ? (
//                     <img
//                       src={selectedRaffle.imageURL}
//                       alt={selectedRaffle.name}
//                       className="h-full w-full object-cover"
//                     />
//                   ) : (
//                     <div className="h-full w-full flex items-center justify-center">
//                       <Ticket className="h-5 w-5 text-gray-400" />
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <div className="font-medium">{selectedRaffle.name}</div>
//                   <div className="text-sm text-gray-400">
//                     ID: {selectedRaffle.raffleId}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//           <DialogFooter className="flex space-x-2 justify-end">
//             <Button
//               variant="outline"
//               onClick={() => setDeleteConfirmOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleDelete}
//               className="bg-red-600 hover:bg-red-700"
//             >
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Select Winner Confirmation Dialog */}
//       <Dialog open={winnerConfirmOpen} onOpenChange={setWinnerConfirmOpen}>
//         <DialogContent className="bg-gray-900 border-gray-700">
//           <DialogHeader>
//             <DialogTitle>Select Winner</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to select a winner for this raffle now? This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="py-4">
//             {selectedRaffle && (
//               <div className="space-y-4">
//                 <div className="flex items-center space-x-3">
//                   <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-700 border border-gray-600">
//                     {selectedRaffle.imageURL ? (
//                       <img
//                         src={selectedRaffle.imageURL}
//                         alt={selectedRaffle.name}
//                         className="h-full w-full object-cover"
//                       />
//                     ) : (
//                       <div className="h-full w-full flex items-center justify-center">
//                         <Ticket className="h-5 w-5 text-gray-400" />
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <div className="font-medium">{selectedRaffle.name}</div>
//                     <div className="text-sm text-gray-400">
//                       ID: {selectedRaffle.raffleId}
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4 bg-gray-800 p-3 rounded-md">
//                   <div>
//                     <div className="text-sm text-gray-400">Prize Amount</div>
//                     <div className="font-medium text-green-500">{selectedRaffle.prizeAmount} ETH</div>
//                   </div>
//                   <div>
//                     <div className="text-sm text-gray-400">Tickets Sold</div>
//                     <div className="font-medium">{selectedRaffle.totalTicketsSold}</div>
//                   </div>
//                 </div>
                
//                 <div className="text-sm text-gray-400 bg-gray-800/50 p-3 rounded-md border border-gray-700">
//                   <p>The winner will be selected randomly from all participants who purchased tickets.</p>
//                   <p className="mt-1">Prize funds will be automatically transferred to the winner's wallet.</p>
//                 </div>
//               </div>
//             )}
//           </div>
//           <DialogFooter className="flex space-x-2 justify-end">
//             <Button
//               variant="outline"
//               onClick={() => setWinnerConfirmOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSelectWinner}
//               className="bg-orange-600 hover:bg-orange-700"
//             >
//               <Trophy className="h-4 w-4 mr-2" />
//               Draw Winner
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default RaffleListTable;



//StakeWise-Frontend/src/Admin/raffles/RaffleListTable.tsx
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
  Edit,
  CheckCircle,
  Star,
  Users,
  CoinsIcon,
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
  web3,
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
        <Badge className="bg-green-700 hover:bg-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    } else if (raffle.endTime < now) {
      return (
        <Badge className="bg-orange-600 hover:bg-orange-700">
          <Star className="h-3 w-3 mr-1" />
          Ready for Winner
        </Badge>
      );
    } else if (raffle.startTime > now) {
      return (
        <Badge variant="outline" className="border-blue-500 text-blue-500">
          <Clock className="h-3 w-3 mr-1" />
          Upcoming
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-purple-600 hover:bg-purple-700">
          <Ticket className="h-3 w-3 mr-1" />
          Active
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
    return raffle.endTime < now && !raffle.isCompleted && raffle.totalTicketsSold > 0;
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
    <div className="rounded-md border border-gray-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-800/50 hover:bg-gray-800">
            <TableHead className="w-[50px] text-center">#</TableHead>
            <TableHead className="min-w-[200px]">Raffle</TableHead>
            <TableHead className="text-center">Category</TableHead>
            <TableHead className="text-center">Price/Prize</TableHead>
            <TableHead className="text-center">Timeline</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Participants</TableHead>
            <TableHead className="text-center w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRaffles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                No raffle draws found. Create your first raffle!
              </TableCell>
            </TableRow>
          ) : (
            sortedRaffles.map((raffle) => (
              <TableRow key={raffle.raffleId} className="hover:bg-gray-800/30">
                <TableCell className="text-center font-mono">
                  {raffle.raffleId}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-700 border border-gray-600">
                      {raffle.imageURL ? (
                        <img
                          src={raffle.imageURL}
                          alt={raffle.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Ticket className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{raffle.name}</div>
                      <div className="text-sm text-gray-400 truncate max-w-xs">
                        {raffle.description.substring(0, 50)}
                        {raffle.description.length > 50 ? "..." : ""}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">
                    {raffle.category || "General"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-center text-sm">
                    <div className="flex items-center text-gray-400">
                      <Ticket className="h-4 w-4 mr-1" />
                      <span>{raffle.ticketPrice} ETH</span>
                    </div>
                    <div className="flex items-center text-green-500 font-medium mt-1">
                      <Trophy className="h-4 w-4 mr-1" />
                      <span>{raffle.prizeAmount} ETH</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-center text-sm">
                    <div className="flex items-center text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {formatTimestamp(raffle.startTime)}
                      </span>
                    </div>
                    <div className="flex items-center text-orange-500 font-medium mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {getTimeDistance(raffle.endTime)}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {getStatusBadge(raffle)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{raffle.totalTicketsSold} tickets</span>
                    </div>
                    {raffle.isCompleted && raffle.winner && (
                      <div className="text-xs text-green-500 mt-1 flex items-center">
                        <Trophy className="h-3 w-3 mr-1" />
                        <span>Winner: {raffle.winner.substring(0, 6)}...</span>
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
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                        {/* Show select winner option if eligible */}
                        {canSelectWinner(raffle) && (
                          <DropdownMenuItem
                            className="text-orange-500 hover:text-orange-400"
                            onClick={() => confirmSelectWinner(raffle)}
                          >
                            <Trophy className="h-4 w-4 mr-2" />
                            Select Winner
                          </DropdownMenuItem>
                        )}
                        
                        {/* Delete option - only for upcoming raffles */}
                        {canDelete(raffle) && (
                          <>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DropdownMenuItem
                              className="text-red-500 hover:text-red-400"
                              onClick={() => confirmDelete(raffle)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
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
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle>Delete Raffle</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this raffle? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedRaffle && (
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-700 border border-gray-600">
                  {selectedRaffle.imageURL ? (
                    <img
                      src={selectedRaffle.imageURL}
                      alt={selectedRaffle.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Ticket className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium">{selectedRaffle.name}</div>
                  <div className="text-sm text-gray-400">
                    ID: {selectedRaffle.raffleId}
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Select Winner Confirmation Dialog */}
      <Dialog open={winnerConfirmOpen} onOpenChange={setWinnerConfirmOpen}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle>Select Winner</DialogTitle>
            <DialogDescription>
              Are you sure you want to select a winner for this raffle now? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedRaffle && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-700 border border-gray-600">
                    {selectedRaffle.imageURL ? (
                      <img
                        src={selectedRaffle.imageURL}
                        alt={selectedRaffle.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Ticket className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{selectedRaffle.name}</div>
                    <div className="text-sm text-gray-400">
                      ID: {selectedRaffle.raffleId}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 bg-gray-800 p-3 rounded-md">
                  <div>
                    <div className="text-sm text-gray-400">Prize Amount</div>
                    <div className="font-medium text-green-500">{selectedRaffle.prizeAmount} ETH</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Tickets Sold</div>
                    <div className="font-medium">{selectedRaffle.totalTicketsSold}</div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-400 bg-gray-800/50 p-3 rounded-md border border-gray-700">
                  <p>The winner will be selected randomly from all participants who purchased tickets.</p>
                  <p className="mt-1">Prize funds will be automatically transferred to the winner's wallet.</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setWinnerConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSelectWinner}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Draw Winner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default RaffleListTable;