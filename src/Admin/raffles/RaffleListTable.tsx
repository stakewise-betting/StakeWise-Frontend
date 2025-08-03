// import React, { useState } from "react";
// import { format } from "date-fns";
// import { Trophy, Search, AlertCircle } from "lucide-react";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Raffle } from "@/services/raffleBlockchainService";

// interface RaffleListTableProps {
//   raffles: Raffle[];
//   onDrawWinner: (raffleId: string) => void;
// }

// const RaffleListTable: React.FC<RaffleListTableProps> = ({ raffles, onDrawWinner }) => {
//     const [searchTerm, setSearchTerm] = useState("");

//     const getStatus = (raffle: Raffle) => {
//         const now = Math.floor(Date.now() / 1000);
//         if (raffle.isCompleted) {
//             return <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30">Completed</Badge>;
//         }
//         if (now > Number(raffle.endTime)) {
//             return <Badge className="bg-orange-600/20 text-orange-400 border border-orange-600/30 hover:bg-orange-600/30">Ended</Badge>;
//         }
//         if (now < Number(raffle.startTime)) {
//             return <Badge variant="outline" className="border-gray-500 text-gray-300">Upcoming</Badge>;
//         }
//         return <Badge className="bg-purple-600/20 text-purple-400 border border-purple-600/30 hover:bg-purple-600/30">Active</Badge>;
//     };

//     const canDrawWinner = (raffle: Raffle) => {
//         const now = Math.floor(Date.now() / 1000);
//         return !raffle.isCompleted && now > Number(raffle.endTime) && Number(raffle.totalTicketsSold) > 0;
//     };

//     const filteredRaffles = raffles.filter(raffle => {
//         if (!raffle) return false;
//         const lowerSearchTerm = searchTerm.toLowerCase();
//         const nameMatch = raffle.name?.toLowerCase().includes(lowerSearchTerm);
//         const idMatch = raffle.raffleId?.toString().includes(searchTerm);
//         return nameMatch || idMatch;
//     });

//     return (
//         <div className="w-full bg-[#16161F] rounded-xl border border-gray-700/60 shadow-lg">
//             {/* --- Search and Filter Controls --- */}
//             <div className="flex flex-col md:flex-row gap-4 justify-between items-center px-6 py-5 border-b border-gray-700/60 bg-[#1C1C27]/80 backdrop-blur-sm">
//                 <div className="flex items-center space-x-3">
//                     <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
//                     <h2 className="text-lg font-semibold text-white">Raffle Overview</h2>
//                 </div>

//                 <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//                     {/* Search Input */}
//                     <div className="relative flex-1 md:w-80">
//                         <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
//                         <Input
//                             type="search"
//                             placeholder="Search raffles by name, ID..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="pl-12 h-12 w-full bg-gray-800/40 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-orange-500/50 focus:ring-orange-500/30 focus:bg-gray-800/50 rounded-xl font-medium shadow-lg hover:border-gray-500/70 hover:bg-gray-800/60 transition-all duration-300"
//                         />
//                     </div>

//                     {/* Filter Button */}
//                     {/* <Button
//                         variant="outline"
//                         size="sm"
//                         className="h-12 bg-gradient-to-r from-orange-600/20 to-orange-600/10 border-orange-600/40 text-orange-400 hover:from-orange-600/30 hover:to-orange-600/20 hover:border-orange-600/60 transition-all duration-300 rounded-xl px-6 font-medium shadow-lg backdrop-blur-sm"
//                     >
//                         <Filter className="h-5 w-5 mr-2" />
//                         Filters
//                     </Button> */}
//                 </div>
//             </div>

//             {/* --- Table Container --- */}
//             <div className="overflow-x-auto">
//                 <Table className="w-full border-collapse text-sm text-gray-300">
//                     <TableHeader className="[&_tr]:border-b [&_tr]:border-gray-700/60 bg-[#1C1C27]/50 backdrop-blur-sm">
//                         <TableRow className="hover:bg-transparent">
//                             <TableHead className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-orange-300 whitespace-nowrap min-w-[200px]">Raffle</TableHead>
//                             <TableHead className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-orange-300 whitespace-nowrap">Prize (ETH)</TableHead>
//                             <TableHead className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-orange-300 whitespace-nowrap min-w-[200px]">End Time</TableHead>
//                             <TableHead className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-orange-300 whitespace-nowrap">Tickets Sold</TableHead>
//                             <TableHead className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-orange-300 whitespace-nowrap">Status</TableHead>
//                             <TableHead className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-orange-300 whitespace-nowrap">Winner</TableHead>
//                             <TableHead className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-orange-300 whitespace-nowrap w-[150px]">Actions</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody className="[&_tr:last-child]:border-0">
//                         {filteredRaffles.length > 0 ? (
//                             filteredRaffles.map((raffle) => (
//                                 <TableRow key={raffle.raffleId} className="border-b border-gray-800/90 hover:bg-gray-800/50 transition-colors">
//                                     <TableCell className="px-4 py-4 font-medium text-white">{raffle.name}</TableCell>
//                                     <TableCell className="px-4 py-4 font-semibold text-emerald-400">{raffle.prizeAmount}</TableCell>
//                                     <TableCell className="px-4 py-4 text-gray-400">
//                                         {format(new Date(Number(raffle.endTime) * 1000), "MMM d, yyyy, h:mm a")}
//                                     </TableCell>
//                                     <TableCell className="px-4 py-4 text-center font-mono">{raffle.totalTicketsSold}</TableCell>
//                                     <TableCell className="px-4 py-4">{getStatus(raffle)}</TableCell>
//                                     <TableCell className="px-4 py-4 font-mono text-gray-500">
//                                         {raffle.isCompleted ? (
//                                             <span title={raffle.winner}>{raffle.winner.substring(0, 6)}...{raffle.winner.substring(raffle.winner.length - 4)}</span>
//                                         ) : 'N/A'}
//                                     </TableCell>
//                                     <TableCell className="px-4 py-4 text-center">
//                                         {canDrawWinner(raffle) && (
//                                             <Button onClick={() => onDrawWinner(raffle.raffleId)} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-md hover:shadow-lg transition-all">
//                                                 <Trophy className="h-4 w-4 mr-2" />
//                                                 Draw Winner
//                                             </Button>
//                                         )}
//                                     </TableCell>
//                                 </TableRow>
//                             ))
//                         ) : (
//                             <TableRow className="hover:bg-transparent">
//                                 <TableCell colSpan={7} className="px-6 py-12 text-center">
//                                     <div className="flex flex-col items-center justify-center gap-6 py-12">
//                                         <div className="relative">
//                                             <div className="p-6 rounded-2xl bg-[#1C1C27] border border-gray-600/30">
//                                                 <AlertCircle className="h-12 w-12 text-gray-500 mx-auto" />
//                                             </div>
//                                             <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full animate-pulse"></div>
//                                         </div>
//                                         <div className="space-y-3">
//                                             <h3 className="text-xl font-bold text-white">
//                                                 {searchTerm ? "No raffles match your search" : "No Raffles Found"}
//                                             </h3>
//                                             <p className="text-gray-400 max-w-md leading-relaxed">
//                                                 {searchTerm ? "Try adjusting your search term." : "Create a new raffle to get started."}
//                                             </p>
//                                         </div>
//                                         {searchTerm && (
//                                             <Button
//                                                 variant="ghost"
//                                                 size="sm"
//                                                 onClick={() => setSearchTerm("")}
//                                                 className="bg-gradient-to-r from-orange-600/20 to-amber-600/20 hover:from-orange-600/30 hover:to-amber-600/30 text-orange-300 border border-orange-500/30 rounded-lg px-6 py-2 font-medium transition-all duration-300"
//                                             >
//                                                 Clear Search
//                                             </Button>
//                                         )}
//                                     </div>
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//             </div>

//             {/* --- Pagination Controls (Placeholder) --- */}
//             {filteredRaffles.length > 10 && (
//                 <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-700/60 bg-[#1C1C27]/80 backdrop-blur-sm text-sm gap-4">
//                     <div className="text-gray-300">
//                         Showing <span className="font-semibold text-white bg-gray-700/50 px-2 py-1 rounded-md">1</span> - <span className="font-semibold text-white bg-gray-700/50 px-2 py-1 rounded-md">{Math.min(filteredRaffles.length, 10)}</span> of <span className="font-semibold text-orange-300">{filteredRaffles.length}</span> raffles
//                     </div>
//                     <div className="flex items-center gap-3">
//                         <Button variant="outline" size="sm" disabled className="h-9 bg-gray-700/40 border-gray-600/50 text-gray-500 cursor-not-allowed rounded-md px-4">Previous</Button>
//                         <Button variant="outline" size="sm" disabled className="h-9 bg-gray-700/40 border-gray-600/50 text-gray-500 cursor-not-allowed rounded-md px-4">Next</Button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default RaffleListTable;


import React, { useState } from "react";
import { format } from "date-fns";
import { Trophy, Search, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Raffle } from "@/services/raffleBlockchainService";

interface RaffleListTableProps {
  raffles: Raffle[];
  onDrawWinner: (raffleId: string) => void;
}

const RaffleListTable: React.FC<RaffleListTableProps> = ({ raffles, onDrawWinner }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const getStatus = (raffle: Raffle) => {
        const now = Math.floor(Date.now() / 1000);
        if (raffle.isCompleted) {
            return <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30">Completed</Badge>;
        }
        if (now > Number(raffle.endTime)) {
            return <Badge className="bg-orange-600/20 text-orange-400 border border-orange-600/30 hover:bg-orange-600/30">Ended</Badge>;
        }
        if (now < Number(raffle.startTime)) {
            return <Badge variant="outline" className="border-gray-500 text-gray-300">Upcoming</Badge>;
        }
        return <Badge className="bg-purple-600/20 text-purple-400 border border-purple-600/30 hover:bg-purple-600/30">Active</Badge>;
    };

    const canDrawWinner = (raffle: Raffle) => {
        const now = Math.floor(Date.now() / 1000);
        return !raffle.isCompleted && now > Number(raffle.endTime) && Number(raffle.totalTicketsSold) > 0;
    };

    const filteredRaffles = raffles.filter(raffle => {
        if (!raffle) return false;
        const lowerSearchTerm = searchTerm.toLowerCase();
        const nameMatch = raffle.name?.toLowerCase().includes(lowerSearchTerm);
        const idMatch = raffle.raffleId?.toString().includes(searchTerm);
        return nameMatch || idMatch;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredRaffles.length / rowsPerPage);
    const paginatedRaffles = filteredRaffles.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="w-full bg-[#16161F] rounded-xl border border-gray-700/60 shadow-lg">
            {/* --- Search and Filter Controls --- */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center px-6 py-5 border-b border-gray-700/60 bg-[#1C1C27]/80 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
                    <h2 className="text-lg font-semibold text-white">Raffle Overview</h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Search Input */}
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        <Input
                            type="search"
                            placeholder="Search raffles by name, ID..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to first page on search
                            }}
                            className="pl-12 h-12 w-full bg-gray-800/40 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-orange-500/50 focus:ring-orange-500/30 focus:bg-gray-800/50 rounded-xl font-medium shadow-lg hover:border-gray-500/70 hover:bg-gray-800/60 transition-all duration-300"
                        />
                    </div>
                </div>
            </div>

            {/* --- Table Container --- */}
            <div className="overflow-x-auto">
                <Table className="w-full border-collapse text-sm text-gray-300">
                    <TableHeader className="[&_tr]:border-b [&_tr]:border-gray-700/60 bg-[#1C1C27]/50 backdrop-blur-sm">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-orange-300 whitespace-nowrap min-w-[200px]">Raffle</TableHead>
                            <TableHead className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-orange-300 whitespace-nowrap">Prize (ETH)</TableHead>
                            <TableHead className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-orange-300 whitespace-nowrap min-w-[200px]">End Time</TableHead>
                            <TableHead className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-orange-300 whitespace-nowrap">Tickets Sold</TableHead>
                            <TableHead className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-orange-300 whitespace-nowrap">Status</TableHead>
                            <TableHead className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-orange-300 whitespace-nowrap">Winner</TableHead>
                            <TableHead className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-orange-300 whitespace-nowrap w-[150px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="[&_tr:last-child]:border-0">
                        {paginatedRaffles.length > 0 ? (
                            paginatedRaffles.map((raffle) => (
                                <TableRow key={raffle.raffleId} className="border-b border-gray-800/90 hover:bg-gray-800/50 transition-colors">
                                    <TableCell className="px-4 py-4 font-medium text-white">{raffle.name}</TableCell>
                                    <TableCell className="px-4 py-4 font-semibold text-emerald-400">{raffle.prizeAmount}</TableCell>
                                    <TableCell className="px-4 py-4 text-gray-400">
                                        {format(new Date(Number(raffle.endTime) * 1000), "MMM d, yyyy, h:mm a")}
                                    </TableCell>
                                    <TableCell className="px-4 py-4 text-center font-mono">{raffle.totalTicketsSold}</TableCell>
                                    <TableCell className="px-4 py-4">{getStatus(raffle)}</TableCell>
                                    <TableCell className="px-4 py-4 font-mono text-gray-500">
                                        {raffle.isCompleted ? (
                                            <span title={raffle.winner}>{raffle.winner.substring(0, 6)}...{raffle.winner.substring(raffle.winner.length - 4)}</span>
                                        ) : 'N/A'}
                                    </TableCell>
                                    <TableCell className="px-4 py-4 text-center">
                                        {canDrawWinner(raffle) && (
                                            <Button onClick={() => onDrawWinner(raffle.raffleId)} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-md hover:shadow-lg transition-all">
                                                <Trophy className="h-4 w-4 mr-2" />
                                                Draw Winner
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={7} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center gap-6 py-12">
                                        <div className="relative">
                                            <div className="p-6 rounded-2xl bg-[#1C1C27] border border-gray-600/30">
                                                <AlertCircle className="h-12 w-12 text-gray-500 mx-auto" />
                                            </div>
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full animate-pulse"></div>
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-xl font-bold text-white">
                                                {searchTerm ? "No raffles match your search" : "No Raffles Found"}
                                            </h3>
                                            <p className="text-gray-400 max-w-md leading-relaxed">
                                                {searchTerm ? "Try adjusting your search term." : "Create a new raffle to get started."}
                                            </p>
                                        </div>
                                        {searchTerm && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSearchTerm("")}
                                                className="bg-gradient-to-r from-orange-600/20 to-amber-600/20 hover:from-orange-600/30 hover:to-amber-600/30 text-orange-300 border border-orange-500/30 rounded-lg px-6 py-2 font-medium transition-all duration-300"
                                            >
                                                Clear Search
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* --- Pagination Controls --- */}
            {filteredRaffles.length > rowsPerPage && (
                <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-700/60 bg-[#1C1C27]/80 backdrop-blur-sm text-sm gap-4">
                    <div className="text-gray-300">
                        Showing <span className="font-semibold text-white bg-gray-700/50 px-2 py-1 rounded-md">{(currentPage - 1) * rowsPerPage + 1}</span> - <span className="font-semibold text-white bg-gray-700/50 px-2 py-1 rounded-md">{Math.min(currentPage * rowsPerPage, filteredRaffles.length)}</span> of <span className="font-semibold text-orange-300">{filteredRaffles.length}</span> raffles
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1} className="h-9 bg-gray-700/40 border-gray-600/50 text-gray-300 rounded-md px-4 disabled:opacity-50 disabled:cursor-not-allowed">Previous</Button>
                        <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages} className="h-9 bg-gray-700/40 border-gray-600/50 text-gray-300 rounded-md px-4 disabled:opacity-50 disabled:cursor-not-allowed">Next</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RaffleListTable;