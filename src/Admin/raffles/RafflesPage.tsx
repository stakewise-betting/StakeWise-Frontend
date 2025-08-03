// // StakeWise-Frontend/src/Admin/raffles/RafflesPage.tsx
// import React, { useState, useEffect, useCallback } from "react";
// import { toast } from "react-toastify";
// import { raffleService, Raffle } from "@/services/raffleBlockchainService";
// import AddRaffleModal from "./AddRaffleModal";
// import RaffleListTable from "./RaffleListTable";
// import { Button } from "@/components/ui/button";
// import { PlusCircle, RefreshCw, Trophy } from "lucide-react";

// // Consistent loading indicator, themed for the raffles page
// const LoadingIndicator: React.FC<{ message?: string }> = ({
//   message = "Loading Raffles...",
// }) => (
//   <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
//     <div className="relative">
//       <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
//     </div>
//     <div className="space-y-2">
//       <h3 className="text-xl font-semibold text-white">{message}</h3>
//       <p className="text-slate-400">
//         Please wait while we fetch the latest data...
//       </p>
//     </div>
//   </div>
// );


// export const RafflesPage: React.FC = () => {
//   const [raffles, setRaffles] = useState<Raffle[]>([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const loadRaffles = useCallback(async () => {
//     setLoading(true);
//     try {
//       const allRaffles = await raffleService.getAllRaffles();
//       // Sort raffles: active first, then completed
//       allRaffles.sort((a, b) => (a.isCompleted === b.isCompleted) ? 0 : a.isCompleted ? 1 : -1);
//       setRaffles(allRaffles);
//     } catch (error: any) {
//       toast.error(error.message || "Failed to load raffles.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadRaffles();
//   }, [loadRaffles]);

//   const handleDrawWinner = async (raffleId: string) => {
//     try {
//       toast.info("Sending transaction to draw winner...");
//       await raffleService.drawWinner(raffleId);
//       toast.success("Winner has been drawn successfully!");
//       loadRaffles(); // Refresh the list
//     } catch (error: any) {
//       toast.error(error.message || "Failed to draw winner.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#1C1C27] text-white animate-admin-fade-in">
//         <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
//             {/* Header Section */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
//                 <div className="space-y-2">
//                     <h2 className="text-3xl font-bold text-white flex items-center gap-3">
//                         <div className="p-2 rounded-full flex items-center justify-center bg-orange-600/20">
//                             <Trophy className="w-6 h-6 text-orange-500" />
//                         </div>
//                         Raffle Management
//                     </h2>
//                     <p className="text-slate-400 text-lg">
//                         Create, manage, and monitor prize raffles
//                     </p>
//                 </div>

//                 <div className="flex items-center gap-3 w-full sm:w-auto">
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={loadRaffles}
//                         disabled={loading}
//                         className="h-12 bg-transparent border-orange-500/40 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300 transition-colors duration-300"
//                     >
//                         <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
//                     </Button>
//                     <Button
//                         onClick={() => setShowAddModal(true)}
//                         disabled={loading}
//                         className="group flex-grow sm:flex-grow-0 flex items-center justify-center px-4 py-3 h-12 rounded-xl font-medium transition-all duration-300 focus:outline-none relative overflow-hidden bg-orange-600/20 text-white border border-orange-600/50 shadow-lg hover:bg-orange-600/30 hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                     >
//                         <div className="flex items-center justify-center mr-3 rounded-lg transition-all duration-300 h-8 w-8 bg-orange-600/20 text-orange-400 shadow-lg">
//                             <PlusCircle
//                                 className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300"
//                                 aria-hidden="true"
//                             />
//                         </div>
//                         <span className="text-sm font-semibold">
//                             Create Raffle
//                         </span>
//                     </Button>
//                 </div>
//             </div>

//             {/* Content Area */}
//             <div className="bg-gradient-to-br from-[#1C1C27] to-[#22222d] border border-gray-700/50 rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden">
//                 {loading ? (
//                     <LoadingIndicator />
//                 ) : (
//                     <RaffleListTable raffles={raffles} onDrawWinner={handleDrawWinner} />
//                 )}
//             </div>

//             <AddRaffleModal
//                 open={showAddModal}
//                 onOpenChange={setShowAddModal}
//                 onRaffleCreated={loadRaffles}
//             />
//         </div>
//     </div>
//   );
// };

// export default RafflesPage;


import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { raffleService, Raffle } from "@/services/raffleBlockchainService";
import AddRaffleModal from "./AddRaffleModal";
import RaffleListTable from "./RaffleListTable";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw, Trophy } from "lucide-react";

// Consistent loading indicator, themed for the raffles page
const LoadingIndicator: React.FC<{ message?: string }> = ({
  message = "Loading Raffles...",
}) => (
  <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-semibold text-white">{message}</h3>
      <p className="text-slate-400">
        Please wait while we fetch the latest data...
      </p>
    </div>
  </div>
);

export const RafflesPage: React.FC = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadRaffles = useCallback(async () => {
    setLoading(true);
    try {
      const allRaffles = await raffleService.getAllRaffles();
      // Sort raffles: active first, then completed
      allRaffles.sort((a, b) => (a.isCompleted === b.isCompleted) ? 0 : a.isCompleted ? 1 : -1);
      setRaffles(allRaffles);
    } catch (error: any) {
      toast.error(error.message || "Failed to load raffles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRaffles();
  }, [loadRaffles]);

  const handleDrawWinner = async (raffleId: string) => {
    try {
      toast.info("Sending transaction to draw winner...");
      await raffleService.drawWinner(raffleId);
      toast.success("Winner has been drawn successfully!");
      loadRaffles(); // Refresh the list
    } catch (error: any) {
      toast.error(error.message || "Failed to draw winner.");
    }
  };

  // NEW HANDLER: End raffle with no tickets sold
  const handleEndRaffle = async (raffleId: string) => {
    try {
      // Find the raffle to show confirmation details
      const raffle = raffles.find(r => r.raffleId === raffleId);
      const raffleName = raffle?.name || `Raffle #${raffleId}`;
      const prizeAmount = raffle?.prizeAmount || "0";

      // Show confirmation toast
      toast.info(`Ending raffle "${raffleName}" and returning ${prizeAmount} ETH to admin wallet...`);
      
      // Call the blockchain service
      await raffleService.endRaffle(raffleId);
      
      // Success feedback
      toast.success(`✅ Raffle "${raffleName}" has been ended successfully! Prize amount (${prizeAmount} ETH) returned to admin wallet.`);
      
      // Refresh the raffles list
      loadRaffles();
    } catch (error: any) {
      console.error("Error ending raffle:", error);
      const errorMessage = error.message || "Failed to end raffle. Please try again.";
      toast.error(`❌ ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1C27] text-white animate-admin-fade-in">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <div className="p-2 rounded-full flex items-center justify-center bg-orange-600/20">
                            <Trophy className="w-6 h-6 text-orange-500" />
                        </div>
                        Raffle Management
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Create, manage, and monitor prize raffles
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={loadRaffles}
                        disabled={loading}
                        className="h-12 bg-transparent border-orange-500/40 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300 transition-colors duration-300"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                    <Button
                        onClick={() => setShowAddModal(true)}
                        disabled={loading}
                        className="group flex-grow sm:flex-grow-0 flex items-center justify-center px-4 py-3 h-12 rounded-xl font-medium transition-all duration-300 focus:outline-none relative overflow-hidden bg-orange-600/20 text-white border border-orange-600/50 shadow-lg hover:bg-orange-600/30 hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <div className="flex items-center justify-center mr-3 rounded-lg transition-all duration-300 h-8 w-8 bg-orange-600/20 text-orange-400 shadow-lg">
                            <PlusCircle
                                className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300"
                                aria-hidden="true"
                            />
                        </div>
                        <span className="text-sm font-semibold">
                            Create Raffle
                        </span>
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-gradient-to-br from-[#1C1C27] to-[#22222d] border border-gray-700/50 rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden">
                {loading ? (
                    <LoadingIndicator />
                ) : (
                    <RaffleListTable 
                        raffles={raffles} 
                        onDrawWinner={handleDrawWinner}
                        onEndRaffle={handleEndRaffle} // NEW PROP PASSED
                    />
                )}
            </div>

            <AddRaffleModal
                open={showAddModal}
                onOpenChange={setShowAddModal}
                onRaffleCreated={loadRaffles}
            />
        </div>
    </div>
  );
};

export default RafflesPage;