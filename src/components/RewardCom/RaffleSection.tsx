// // // //components/RewardCom/RaffleSection.tsx
// // // import React, { useState, useEffect, useCallback } from "react";
// // // import { raffleService, Raffle } from "@/services/raffleBlockchainService";
// // // import { toast } from "react-toastify";
// // // import { Loader2, Ticket, Clock, Users, CheckCircle, Coins, Plus, Minus, X } from "lucide-react";
// // // import { Button } from "@/components/ui/button";
// // // import { Input } from "@/components/ui/input";
// // // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// // // import { ConfirmationModal } from "./Confirmation-model";

// // // // Helper function to format time left
// // // const formatTimeLeft = (endTime: number) => {
// // //     const now = Math.floor(Date.now() / 1000);
// // //     const timeLeft = endTime - now;

// // //     if (timeLeft <= 0) {
// // //         return "Ended";
// // //     }

// // //     const days = Math.floor(timeLeft / (3600 * 24));
// // //     const hours = Math.floor((timeLeft % (3600 * 24)) / 3600);
// // //     const minutes = Math.floor((timeLeft % 3600) / 60);

// // //     if (days > 0) {
// // //         return `${days}d ${hours}h left`;
// // //     }
// // //     if (hours > 0) {
// // //         return `${hours}h ${minutes}m left`;
// // //     }
// // //     return `${minutes}m left`;
// // // };

// // // // Ticket Count Selection Popup Component
// // // const TicketCountPopup: React.FC<{
// // //     isOpen: boolean;
// // //     onClose: () => void;
// // //     ticketQuantity: number;
// // //     setTicketQuantity: (quantity: number) => void;
// // //     ticketPrice: string;
// // //     onConfirm: () => void;
// // //     isProcessing: boolean;
// // //     raffleName: string;
// // // }> = ({ isOpen, onClose, ticketQuantity, setTicketQuantity, ticketPrice, onConfirm, isProcessing, raffleName }) => {
    
// // //     const quickSelectButtons = [1, 5, 10, 25, 50, 100];
    
// // //     const handleQuickSelect = (quantity: number) => {
// // //         setTicketQuantity(quantity);
// // //     };

// // //     const handleIncrement = () => {
// // //         if (ticketQuantity < 1000) {
// // //             setTicketQuantity(ticketQuantity + 1);
// // //         }
// // //     };

// // //     const handleDecrement = () => {
// // //         if (ticketQuantity > 1) {
// // //             setTicketQuantity(ticketQuantity - 1);
// // //         }
// // //     };

// // //     if (!isOpen) return null;

// // //     return (
// // //         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
// // //             <div className="bg-[#1a1b23] border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
// // //                 <div className="flex items-center justify-between p-6 border-b border-gray-700">
// // //                     <h3 className="text-xl font-bold text-white">Select Tickets</h3>
// // //                     <button
// // //                         onClick={onClose}
// // //                         className="text-gray-400 hover:text-white transition-colors"
// // //                     >
// // //                         <X size={24} />
// // //                     </button>
// // //                 </div>
                
// // //                 <div className="p-6 space-y-6">
// // //                     <div className="text-center">
// // //                         <p className="text-gray-400 text-sm mb-1">Entering raffle for</p>
// // //                         <p className="text-[#E27625] font-semibold text-3xl">{raffleName}</p>
// // //                     </div>

// // //                     {/* Quick Select Buttons
// // //                     <div>
// // //                         <p className="text-gray-300 text-sm mb-3">Quick Select:</p>
// // //                         <div className="grid grid-cols-3 gap-2">
// // //                             {quickSelectButtons.map((quantity) => (
// // //                                 <button
// // //                                     key={quantity}
// // //                                     onClick={() => handleQuickSelect(quantity)}
// // //                                     className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
// // //                                         ticketQuantity === quantity
// // //                                             ? 'bg-[#E27625] text-white'
// // //                                             : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
// // //                                     }`}
// // //                                 >
// // //                                     {quantity}
// // //                                 </button>
// // //                             ))}
// // //                         </div>
// // //                     </div> */}

// // //                     {/* Manual Input */}
// // //                     <div>
// // //                         <p className="text-gray-300 text-sm mb-3">Ticket Amount:</p>
// // //                         <div className="flex items-center gap-3">
// // //                             <button
// // //                                 onClick={handleDecrement}
// // //                                 disabled={ticketQuantity <= 1}
// // //                                 className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white"
// // //                             >
// // //                                 <Minus size={16} />
// // //                             </button>
                            
// // //                             <div className="flex-1">
// // //                                 <Input
// // //                                     type="number"
// // //                                     value={ticketQuantity}
// // //                                     onChange={(e) => {
// // //                                         const value = Math.max(1, Math.min(1000, Number(e.target.value) || 1));
// // //                                         setTicketQuantity(value);
// // //                                     }}
// // //                                     className="bg-gray-800 border-gray-600 text-white text-center text-lg font-semibold"
// // //                                     min="1"
// // //                                     max="1000"
// // //                                 />
// // //                             </div>
                            
// // //                             <button
// // //                                 onClick={handleIncrement}
// // //                                 disabled={ticketQuantity >= 1000}
// // //                                 className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white"
// // //                             >
// // //                                 <Plus size={16} />
// // //                             </button>
// // //                         </div>
// // //                         <p className="text-xs text-gray-500 mt-1 text-center">Maximum 1000 tickets per transaction</p>
// // //                     </div>

// // //                     {/* Total Cost */}
// // //                     <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-4">
// // //                         <div className="text-center">
// // //                             <p className="text-gray-400 text-sm mb-1">Total Cost</p>
// // //                             <p className="text-2xl font-bold text-green-400">
// // //                                 {(Number(ticketPrice) * ticketQuantity).toFixed(4)} ETH
// // //                             </p>
// // //                             <p className="text-xs text-gray-500 mt-1">
// // //                                 {ticketQuantity} {ticketQuantity === 1 ? 'ticket' : 'tickets'} × {ticketPrice} ETH
// // //                             </p>
// // //                         </div>
// // //                     </div>
// // //                 </div>

// // //                 {/* Action Buttons */}
// // //                 <div className="p-6 border-t border-gray-700">
// // //                     <div className="flex gap-3">
// // //                         <Button
// // //                             variant="outline"
// // //                             onClick={onClose}
// // //                             className="flex-1 border-gray-600 hover:bg-gray-700 text-gray-300"
// // //                             disabled={isProcessing}
// // //                         >
// // //                             Cancel
// // //                         </Button>
// // //                         <Button
// // //                             onClick={onConfirm}
// // //                             disabled={isProcessing}
// // //                             className="flex-1 bg-gradient-to-r from-[#E27625] to-orange-600 hover:from-orange-600 hover:to-[#E27625] text-white font-semibold"
// // //                         >
// // //                             {isProcessing ? (
// // //                                 <>
// // //                                     <Loader2 className="animate-spin h-4 w-4 mr-2" />
// // //                                     Processing...
// // //                                 </>
// // //                             ) : (
// // //                                 'Confirm Purchase'
// // //                             )}
// // //                         </Button>
// // //                     </div>
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // };

// // // const RaffleCard: React.FC<{ raffle: Raffle, onBuyTickets: (raffle: Raffle) => void }> = ({ raffle, onBuyTickets }) => {
// // //     const timeLeft = Number(raffle.endTime) * 1000 - Date.now();
// // //     const isRaffleActive = timeLeft > 0 && Date.now() > Number(raffle.startTime) * 1000;

// // //     return (
// // //         <div className="bg-gradient-to-br from-[#1a1b23] to-[#252538] rounded-2xl overflow-hidden border border-gray-700/50 hover:border-[#E27625]/50 transition-all duration-300 group shadow-xl hover:shadow-2xl hover:shadow-[#E27625]/10">
// // //             <div className="relative h-56 overflow-hidden">
// // //                 <img 
// // //                     src={raffle.imageURL} 
// // //                     alt={raffle.name} 
// // //                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
// // //                 />
// // //                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                
// // //                 {/* Status Badge */}
// // //                 <div className="absolute top-4 left-4">
// // //                     <div className="bg-gradient-to-r from-[#E27625] to-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wider">
// // //                         🔥 HOT RAFFLE
// // //                     </div>
// // //                 </div>

// // //                 {/* Time Left Badge */}
// // //                 <div className="absolute top-4 right-4">
// // //                     <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
// // //                         <Clock size={12} />
// // //                         {formatTimeLeft(Number(raffle.endTime))}
// // //                     </div>
// // //                 </div>

// // //                 {/* Prize Amount Overlay */}
// // //                 <div className="absolute bottom-4 left-4 right-4">
// // //                     <div className="bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/10">
// // //                         <p className="text-gray-300 text-xs uppercase tracking-wide">Prize Pool</p>
// // //                         <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
// // //                             {raffle.prizeAmount} ETH
// // //                         </p>
// // //                     </div>
// // //                 </div>
// // //             </div>

// // //             <div className="p-6 space-y-4">
// // //                 <div>
// // //                     <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-[#E27625] transition-colors">
// // //                         {raffle.name}
// // //                     </h3>
// // //                 </div>

// // //                 {/* Stats Grid */}
// // //                 <div className="grid grid-cols-2 gap-4">
// // //                     <div className="bg-gray-800/50 rounded-lg p-3 text-center">
// // //                         <div className="flex items-center justify-center gap-1.5 text-gray-400 mb-1">
// // //                             <Users size={14} />
// // //                             <span className="text-xs">Entries</span>
// // //                         </div>
// // //                         <p className="font-bold text-white">{raffle.totalTicketsSold}</p>
// // //                     </div>
                    
// // //                     <div className="bg-gray-800/50 rounded-lg p-3 text-center">
// // //                         <div className="flex items-center justify-center gap-1.5 text-gray-400 mb-1">
// // //                             <Ticket size={14} />
// // //                             <span className="text-xs">Price</span>
// // //                         </div>
// // //                         <p className="font-bold text-white">{raffle.ticketPrice} ETH</p>
// // //                     </div>
// // //                 </div>

// // //                 {/* Action Button */}
// // //                 <Button 
// // //                     className="w-full bg-gradient-to-r from-[#E27625] to-orange-600 hover:from-orange-600 hover:to-[#E27625] text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
// // //                     disabled={!isRaffleActive} 
// // //                     onClick={() => onBuyTickets(raffle)}
// // //                 >
// // //                     <div className="flex items-center justify-center gap-2">
// // //                         <Coins size={18} />
// // //                         {isRaffleActive ? 'Enter Raffle' : 'Raffle Ended'}
// // //                     </div>
// // //                 </Button>
// // //             </div>
// // //         </div>
// // //     );
// // // };

// // // const RaffleSection = () => {
// // //     const [raffles, setRaffles] = useState<Raffle[]>([]);
// // //     const [loading, setLoading] = useState(true);
// // //     const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);
// // //     const [isModalOpen, setIsModalOpen] = useState(false);
// // //     const [ticketQuantity, setTicketQuantity] = useState(1);
// // //     const [isProcessing, setIsProcessing] = useState(false);
// // //     const [showConfirmation, setShowConfirmation] = useState(false);
// // //     const [purchasedTickets, setPurchasedTickets] = useState(0);
// // //     const [showAllRaffles, setShowAllRaffles] = useState(false);

// // //     const loadRaffles = useCallback(async () => {
// // //         setLoading(true);
// // //         try {
// // //             const allRaffles = await raffleService.getAllRaffles();
// // //             const activeRaffles = allRaffles.filter(r => !r.isCompleted);
// // //             // Sort by end time, closest to ending first
// // //             activeRaffles.sort((a, b) => Number(a.endTime) - Number(b.endTime));
// // //             setRaffles(activeRaffles);
// // //         } catch (error: any) {
// // //             toast.error(error.message || "Failed to load raffles.");
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     }, []);

// // //     useEffect(() => {
// // //         loadRaffles();
// // //     }, [loadRaffles]);
    
// // //     const handleBuyClick = (raffle: Raffle) => {
// // //         setSelectedRaffle(raffle);
// // //         setTicketQuantity(1);
// // //         setIsModalOpen(true);
// // //     };

// // //     const handleConfirmPurchase = async () => {
// // //         if (!selectedRaffle) return;
// // //         setIsProcessing(true);
// // //         try {
// // //             toast.info(`Purchasing ${ticketQuantity} ticket(s)... Please confirm in your wallet.`);
// // //             await raffleService.buyTickets(selectedRaffle.raffleId, ticketQuantity);
// // //             toast.success("Tickets purchased successfully!");
            
// // //             // Store purchase info for confirmation modal
// // //             setPurchasedTickets(ticketQuantity);
            
// // //             // Close ticket selection modal and show confirmation
// // //             setIsModalOpen(false);
// // //             setShowConfirmation(true);
            
// // //             loadRaffles(); // Refresh data
// // //         } catch (error: any) {
// // //             toast.error(error.message || "Ticket purchase failed.");
// // //         } finally {
// // //             setIsProcessing(false);
// // //         }
// // //     };

// // //     // Toggle view all raffles
// // //     const handleToggleViewAll = () => {
// // //         setShowAllRaffles(!showAllRaffles);
// // //     };

// // //     // Get displayed raffles based on current view mode
// // //     const displayedRaffles = showAllRaffles ? raffles : raffles.slice(0, 8);
    
// // //     if (loading) {
// // //         return (
// // //             <div className="flex flex-col justify-center items-center py-20">
// // //                 <Loader2 className="h-12 w-12 text-[#E27625] animate-spin mb-4" />
// // //                 <p className="text-gray-400">Loading awesome raffles...</p>
// // //             </div>
// // //         );
// // //     }

// // //     return (
        
// // //         <section className="py-12">
// // //             {/* Header Section */}
// // //             <div className="flex justify-between items-center mb-10">
// // //                 <div >
// // //                     <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-2">
// // //                         Active Raffles
// // //                     </h2>
// // //                     <p className="text-gray-400">Join exciting raffles and win amazing prizes!</p>
// // //                 </div>
// // //                 {/* <button className="px-6 py-3 text-sm bg-transparent border-2 border-[#E27625] text-[#E27625] hover:bg-[#E27625] hover:text-white rounded-xl transition-all duration-300 font-semibold">
// // //                     View All Raffles
// // //                 </button> */}
// // //             </div>
            
// // //             {raffles.length === 0 ? (
// // //                 <div className="text-center py-16 bg-gradient-to-br from-[#1a1b23] to-[#2a2b35] rounded-2xl border border-gray-700/50">
// // //                     <div className="mb-6">
// // //                         <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
// // //                             <Ticket className="w-8 h-8 text-gray-400" />
// // //                         </div>
// // //                         <h3 className="text-2xl mb-3 font-bold text-white">No Active Raffles</h3>
// // //                         <p className="text-gray-400 max-w-md mx-auto">
// // //                             There are no active raffles at the moment. Check back soon for new opportunities to win amazing prizes!
// // //                         </p>
// // //                     </div>
// // //                 </div>
// // //             ) : (
// // //                 <>
// // //                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
// // //                         {displayedRaffles.map(raffle => (
// // //                             <RaffleCard key={raffle.raffleId} raffle={raffle} onBuyTickets={handleBuyClick} />
// // //                         ))}
// // //                     </div>
                    
// // //                     {/* Show more indicator when not showing all */}
// // //                     {!showAllRaffles && raffles.length > 8 && (
// // //                         <div className="text-center mt-8">
                           
                                
// // //                                 <button 
// // //                                     onClick={handleToggleViewAll}
// // //                                     className="px-6 py-3 text-sm bg-transparent border-2 border-[#E27625] text-[#E27625] hover:bg-[#E27625] hover:text-white rounded-xl transition-all duration-300 font-semibold"
// // //                                 >
// // //                                     View All Raffles
// // //                                 </button>
                            
// // //                         </div>
// // //                     )}
// // //                 </>
// // //             )}

// // //             {/* Ticket Count Selection Popup */}
// // //             <TicketCountPopup
// // //                 isOpen={isModalOpen}
// // //                 onClose={() => setIsModalOpen(false)}
// // //                 ticketQuantity={ticketQuantity}
// // //                 setTicketQuantity={setTicketQuantity}
// // //                 ticketPrice={selectedRaffle?.ticketPrice || "0"}
// // //                 onConfirm={handleConfirmPurchase}
// // //                 isProcessing={isProcessing}
// // //                 raffleName={selectedRaffle?.name || ""}
// // //             />

// // //             {/* Confirmation Modal */}
// // //             <ConfirmationModal
// // //                 open={showConfirmation}
// // //                 onOpenChange={setShowConfirmation}
// // //                 raffle={selectedRaffle}
// // //                 ticketQuantity={purchasedTickets}
// // //             />
// // //         </section>
// // //     );
// // // };

// // // export default RaffleSection;





















// // //components/RewardCom/RaffleSection.tsx
// // import React, { useState, useEffect, useCallback } from "react";
// // import { raffleService, Raffle } from "@/services/raffleBlockchainService";
// // import { toast } from "react-toastify";
// // import { Loader2, Ticket, Clock, Coins, Plus, Minus, X , DollarSign} from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // //import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// // import { ConfirmationModal } from "./Confirmation-model";

// // // Helper function to format time left
// // const formatTimeLeft = (endTime: number) => {
// //     const now = Math.floor(Date.now() / 1000);
// //     const timeLeft = endTime - now;

// //     if (timeLeft <= 0) {
// //         return "Ended";
// //     }

// //     const days = Math.floor(timeLeft / (3600 * 24));
// //     const hours = Math.floor((timeLeft % (3600 * 24)) / 3600);
// //     const minutes = Math.floor((timeLeft % 3600) / 60);

// //     if (days > 0) {
// //         return `${days}d ${hours}h left`;
// //     }
// //     if (hours > 0) {
// //         return `${hours}h ${minutes}m left`;
// //     }
// //     return `${minutes}m left`;
// // };

// // // Ticket Count Selection Popup Component
// // const TicketCountPopup: React.FC<{
// //     isOpen: boolean;
// //     onClose: () => void;
// //     ticketQuantity: number;
// //     setTicketQuantity: (quantity: number) => void;
// //     ticketPrice: string;
// //     onConfirm: () => void;
// //     isProcessing: boolean;
// //     raffleName: string;
// // }> = ({ isOpen, onClose, ticketQuantity, setTicketQuantity, ticketPrice, onConfirm, isProcessing, raffleName }) => {
    
// //     const quickSelectButtons = [1, 5, 10, 25, 50, 100];
    
// //     const handleQuickSelect = (quantity: number) => {
// //         setTicketQuantity(quantity);
// //     };

// //     const handleIncrement = () => {
// //         if (ticketQuantity < 1000) {
// //             setTicketQuantity(ticketQuantity + 1);
// //         }
// //     };

// //     const handleDecrement = () => {
// //         if (ticketQuantity > 1) {
// //             setTicketQuantity(ticketQuantity - 1);
// //         }
// //     };

// //     if (!isOpen) return null;

// //     return (
// //         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
// //             <div className="bg-[#1a1b23] border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
// //                 <div className="flex items-center justify-between p-6 border-b border-gray-700">
// //                     <h3 className="text-xl font-bold text-white">Select Tickets</h3>
// //                     <button
// //                         onClick={onClose}
// //                         className="text-gray-400 hover:text-white transition-colors"
// //                     >
// //                         <X size={24} />
// //                     </button>
// //                 </div>
                
// //                 <div className="p-6 space-y-6">
// //                     <div className="text-center">
// //                         <p className="text-gray-400 text-sm mb-1">Entering raffle for</p>
// //                         <p className="text-[#E27625] font-semibold text-3xl">{raffleName}</p>
// //                     </div>

// //                     {/* Quick Select Buttons
// //                     <div>
// //                         <p className="text-gray-300 text-sm mb-3">Quick Select:</p>
// //                         <div className="grid grid-cols-3 gap-2">
// //                             {quickSelectButtons.map((quantity) => (
// //                                 <button
// //                                     key={quantity}
// //                                     onClick={() => handleQuickSelect(quantity)}
// //                                     className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
// //                                         ticketQuantity === quantity
// //                                             ? 'bg-[#E27625] text-white'
// //                                             : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
// //                                     }`}
// //                                 >
// //                                     {quantity}
// //                                 </button>
// //                             ))}
// //                         </div>
// //                     </div> */}

// //                     {/* Manual Input */}
// //                     <div>
// //                         <p className="text-gray-300 text-sm mb-3">Ticket Amount:</p>
// //                         <div className="flex items-center gap-3">
// //                             <button
// //                                 onClick={handleDecrement}
// //                                 disabled={ticketQuantity <= 1}
// //                                 className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white"
// //                             >
// //                                 <Minus size={16} />
// //                             </button>
                            
// //                             <div className="flex-1">
// //                                 <Input
// //                                     type="number"
// //                                     value={ticketQuantity}
// //                                     onChange={(e) => {
// //                                         const value = Math.max(1, Math.min(1000, Number(e.target.value) || 1));
// //                                         setTicketQuantity(value);
// //                                     }}
// //                                     className="bg-gray-800 border-gray-600 text-white text-center text-lg font-semibold"
// //                                     min="1"
// //                                     max="1000"
// //                                 />
// //                             </div>
                            
// //                             <button
// //                                 onClick={handleIncrement}
// //                                 disabled={ticketQuantity >= 1000}
// //                                 className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white"
// //                             >
// //                                 <Plus size={16} />
// //                             </button>
// //                         </div>
// //                         <p className="text-xs text-gray-500 mt-1 text-center">Maximum 1000 tickets per transaction</p>
// //                     </div>

// //                     {/* Total Cost */}
// //                     <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-4">
// //                         <div className="text-center">
// //                             <p className="text-gray-400 text-sm mb-1">Total Cost</p>
// //                             <p className="text-2xl font-bold text-green-400">
// //                                 {(Number(ticketPrice) * ticketQuantity).toFixed(4)} ETH
// //                             </p>
// //                             <p className="text-xs text-gray-500 mt-1">
// //                                 {ticketQuantity} {ticketQuantity === 1 ? 'ticket' : 'tickets'} × {ticketPrice} ETH
// //                             </p>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* Action Buttons */}
// //                 <div className="p-6 border-t border-gray-700">
// //                     <div className="flex gap-3">
// //                         <Button
// //                             variant="outline"
// //                             onClick={onClose}
// //                             className="flex-1 border-gray-600 hover:bg-gray-700 text-gray-300"
// //                             disabled={isProcessing}
// //                         >
// //                             Cancel
// //                         </Button>
// //                         <Button
// //                             onClick={onConfirm}
// //                             disabled={isProcessing}
// //                             className="flex-1 bg-gradient-to-r from-[#E27625] to-orange-600 hover:from-orange-600 hover:to-[#E27625] text-white font-semibold"
// //                         >
// //                             {isProcessing ? (
// //                                 <>
// //                                     <Loader2 className="animate-spin h-4 w-4 mr-2" />
// //                                     Processing...
// //                                 </>
// //                             ) : (
// //                                 'Confirm Purchase'
// //                             )}
// //                         </Button>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // const RaffleCard: React.FC<{ raffle: Raffle, onBuyTickets: (raffle: Raffle) => void }> = ({ raffle, onBuyTickets }) => {
// //     const timeLeft = Number(raffle.endTime) * 1000 - Date.now();
// //     const isRaffleActive = timeLeft > 0 && Date.now() > Number(raffle.startTime) * 1000;

// //     return (
// //         <div className="bg-gradient-to-br from-[#1a1b23] to-[#252538] rounded-2xl overflow-hidden border border-gray-700/50 hover:border-[#E27625]/50 transition-all duration-300 group shadow-xl hover:shadow-2xl hover:shadow-[#E27625]/10">
// //             <div className="relative h-56 overflow-hidden">
// //                 <img 
// //                     src={raffle.imageURL} 
// //                     alt={raffle.name} 
// //                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
// //                 />
// //                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                
// //                 {/* Status Badge */}
// //                 <div className="absolute top-4 left-4">
// //                     <div className="bg-gradient-to-r from-[#E27625] to-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wider">
// //                         🔥 HOT RAFFLE
// //                     </div>
// //                 </div>

// //                 {/* Time Left Badge */}
// //                 <div className="absolute top-4 right-4">
// //                     <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
// //                         <Clock size={12} />
// //                         {formatTimeLeft(Number(raffle.endTime))}
// //                     </div>
// //                 </div>

// //                 {/* Prize Amount Overlay */}
// //                 <div className="absolute bottom-4 left-4 right-4">
// //                     <div className="bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/10">
// //                         <p className="text-gray-300 text-xs uppercase tracking-wide">Prize Pool</p>
// //                         <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
// //                             {raffle.prizeAmount} ETH
// //                         </p>
// //                     </div>
// //                 </div>
// //             </div>

// //             <div className="p-6 space-y-4">
// //                 <div>
// //                     <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-[#E27625] transition-colors">
// //                         {raffle.name}
// //                     </h3>
// //                 </div>

// //                 {/* Stats Grid */}
// //                 <div className="grid grid-cols-2 gap-4">
// //                     <div className="bg-gray-800/50 rounded-lg p-3 text-center">
// //                         <div className="flex items-center justify-center gap-1.5 text-gray-400 mb-1">
// //                             <Ticket size={14} />
// //                             <span className="text-xs">Tickets</span>
// //                         </div>
// //                         <p className="font-bold text-white">{raffle.totalTicketsSold}</p>
// //                     </div>
                    
// //                     <div className="bg-gray-800/50 rounded-lg p-3 text-center">
// //                         <div className="flex items-center justify-center gap-1.5 text-gray-400 mb-1">
// //                             <DollarSign size={14} />
// //                             <span className="text-xs">Price</span>
// //                         </div>
// //                         <p className="font-bold text-white">{raffle.ticketPrice} ETH</p>
// //                     </div>
// //                 </div>

// //                 {/* Action Button */}
// //                 <Button 
// //                     className="w-full bg-gradient-to-r from-[#E27625] to-orange-600 hover:from-orange-600 hover:to-[#E27625] text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
// //                     disabled={!isRaffleActive} 
// //                     onClick={() => onBuyTickets(raffle)}
// //                 >
// //                     <div className="flex items-center justify-center gap-2">
// //                         <Coins size={18} />
// //                         {isRaffleActive ? 'Enter Raffle' : 'Raffle Ended'}
// //                     </div>
// //                 </Button>
// //             </div>
// //         </div>
// //     );
// // };

// // const RaffleSection = () => {
// //     const [raffles, setRaffles] = useState<Raffle[]>([]);
// //     const [loading, setLoading] = useState(true);
// //     const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);
// //     const [isModalOpen, setIsModalOpen] = useState(false);
// //     const [ticketQuantity, setTicketQuantity] = useState(1);
// //     const [isProcessing, setIsProcessing] = useState(false);
// //     const [showConfirmation, setShowConfirmation] = useState(false);
// //     const [purchasedTickets, setPurchasedTickets] = useState(0);
// //     const [showAllRaffles, setShowAllRaffles] = useState(false);

// //     const loadRaffles = useCallback(async () => {
// //         setLoading(true);
// //         try {
// //             const allRaffles = await raffleService.getAllRaffles();
// //             const activeRaffles = allRaffles.filter(r => !r.isCompleted);
// //             // Sort by end time, closest to ending first
// //             activeRaffles.sort((a, b) => Number(a.endTime) - Number(b.endTime));
// //             setRaffles(activeRaffles);
// //         } catch (error: any) {
// //             toast.error(error.message || "Failed to load raffles.");
// //         } finally {
// //             setLoading(false);
// //         }
// //     }, []);

// //     useEffect(() => {
// //         loadRaffles();
// //     }, [loadRaffles]);
    
// //     const handleBuyClick = (raffle: Raffle) => {
// //         setSelectedRaffle(raffle);
// //         setTicketQuantity(1);
// //         setIsModalOpen(true);
// //     };

// //     const handleConfirmPurchase = async () => {
// //         if (!selectedRaffle) return;
// //         setIsProcessing(true);
// //         try {
// //             toast.info(`Purchasing ${ticketQuantity} ticket(s)... Please confirm in your wallet.`);
// //             await raffleService.buyTickets(selectedRaffle.raffleId, ticketQuantity);
// //             toast.success("Tickets purchased successfully!");
            
// //             // Store purchase info for confirmation modal
// //             setPurchasedTickets(ticketQuantity);
            
// //             // Close ticket selection modal and show confirmation
// //             setIsModalOpen(false);
// //             setShowConfirmation(true);
            
// //             loadRaffles(); // Refresh data
// //         } catch (error: any) {
// //             toast.error(error.message || "Ticket purchase failed.");
// //         } finally {
// //             setIsProcessing(false);
// //         }
// //     };

// //     // Toggle view all raffles
// //     const handleToggleViewAll = () => {
// //         setShowAllRaffles(!showAllRaffles);
// //     };

// //     // Get displayed raffles based on current view mode
// //     const displayedRaffles = showAllRaffles ? raffles : raffles.slice(0, 8);
    
// //     if (loading) {
// //         return (
// //             <div className="flex flex-col justify-center items-center py-20">
// //                 <Loader2 className="h-12 w-12 text-[#E27625] animate-spin mb-4" />
// //                 <p className="text-gray-400">Loading awesome raffles...</p>
// //             </div>
// //         );
// //     }

// //     return (
// //         <section className="py-12">
// //             {/* Header Section*/}
// //             <div className="mb-6 sm:mb-8">
// //                 <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl border border-[#333447]">
// //                     <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold bg-gradient-to-r from-[#E27625] to-[#F59E0B] bg-clip-text text-transparent mb-2 text-center sm:text-left">
// //                         Active Raffles
// //                     </h1>
// //                     <p className="text-[#A1A1AA] text-sm sm:text-base lg:text-lg text-center sm:text-left leading-relaxed">
// //                         Join exciting raffles and win amazing prizes! 🪄🎲💫
// //                     </p>
// //                 </div>
// //             </div>
            
// //             {raffles.length === 0 ? (
// //                 <div className="text-center py-16 bg-gradient-to-br from-[#1a1b23] to-[#2a2b35] rounded-2xl border border-gray-700/50">
// //                     <div className="mb-6">
// //                         <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
// //                             <Ticket className="w-8 h-8 text-gray-400" />
// //                         </div>
// //                         <h3 className="text-2xl mb-3 font-bold text-white">No Active Raffles</h3>
// //                         <p className="text-gray-400 max-w-md mx-auto">
// //                             There are no active raffles at the moment. Check back soon for new opportunities to win amazing prizes!
// //                         </p>
// //                     </div>
// //                 </div>
// //             ) : (
// //                 <>
// //                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
// //                         {displayedRaffles.map(raffle => (
// //                             <RaffleCard key={raffle.raffleId} raffle={raffle} onBuyTickets={handleBuyClick} />
// //                         ))}
// //                     </div>
                    
// //                     {/* Show more indicator when not showing all */}
// //                     {!showAllRaffles && raffles.length > 8 && (
// //                         <div className="text-center mt-8">
// //                             <button 
// //                                 onClick={handleToggleViewAll}
// //                                 className="px-6 py-3 text-sm bg-transparent border-2 border-[#E27625] text-[#E27625] hover:bg-[#E27625] hover:text-white rounded-xl transition-all duration-300 font-semibold"
// //                             >
// //                                 View All Raffles
// //                             </button>
// //                         </div>
// //                     )}
// //                 </>
// //             )}

// //             {/* Ticket Count Selection Popup */}
// //             <TicketCountPopup
// //                 isOpen={isModalOpen}
// //                 onClose={() => setIsModalOpen(false)}
// //                 ticketQuantity={ticketQuantity}
// //                 setTicketQuantity={setTicketQuantity}
// //                 ticketPrice={selectedRaffle?.ticketPrice || "0"}
// //                 onConfirm={handleConfirmPurchase}
// //                 isProcessing={isProcessing}
// //                 raffleName={selectedRaffle?.name || ""}
// //             />

// //             {/* Confirmation Modal */}
// //             <ConfirmationModal
// //                 open={showConfirmation}
// //                 onOpenChange={setShowConfirmation}
// //                 raffle={selectedRaffle}
// //                 ticketQuantity={purchasedTickets}
// //             />
// //         </section>
// //     );
// // };

// // export default RaffleSection;



// //components/RewardCom/RaffleSection.tsx
// import React, { useState, useEffect, useCallback } from "react";
// import { raffleService, Raffle } from "@/services/raffleBlockchainService";
// import { toast } from "react-toastify";
// import { Loader2, Ticket, Clock, Coins, Plus, Minus, X , DollarSign} from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// //import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { ConfirmationModal } from "./Confirmation-model";

// // Helper function to format time left
// const formatTimeLeft = (endTime: number) => {
//     const now = Math.floor(Date.now() / 1000);
//     const timeLeft = endTime - now;

//     if (timeLeft <= 0) {
//         return "Ended";
//     }

//     const days = Math.floor(timeLeft / (3600 * 24));
//     const hours = Math.floor((timeLeft % (3600 * 24)) / 3600);
//     const minutes = Math.floor((timeLeft % 3600) / 60);

//     if (days > 0) {
//         return `${days}d ${hours}h left`;
//     }
//     if (hours > 0) {
//         return `${hours}h ${minutes}m left`;
//     }
//     return `${minutes}m left`;
// };

// // Ticket Count Selection Popup Component
// const TicketCountPopup: React.FC<{
//     isOpen: boolean;
//     onClose: () => void;
//     ticketQuantity: number;
//     setTicketQuantity: (quantity: number) => void;
//     ticketPrice: string;
//     onConfirm: () => void;
//     isProcessing: boolean;
//     raffleName: string;
// }> = ({ isOpen, onClose, ticketQuantity, setTicketQuantity, ticketPrice, onConfirm, isProcessing, raffleName }) => {
    
//     const quickSelectButtons = [1, 5, 10, 25, 50, 100];
    
//     const handleQuickSelect = (quantity: number) => {
//         setTicketQuantity(quantity);
//     };

//     const handleIncrement = () => {
//         if (ticketQuantity < 1000) {
//             setTicketQuantity(ticketQuantity + 1);
//         }
//     };

//     const handleDecrement = () => {
//         if (ticketQuantity > 1) {
//             setTicketQuantity(ticketQuantity - 1);
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//             <div className="bg-[#1a1b23] border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
//                 <div className="flex items-center justify-between p-6 border-b border-gray-700">
//                     <h3 className="text-xl font-bold text-white">Select Tickets</h3>
//                     <button
//                         onClick={onClose}
//                         className="text-gray-400 hover:text-white transition-colors"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>
                
//                 <div className="p-6 space-y-6">
//                     <div className="text-center">
//                         <p className="text-gray-400 text-sm mb-1">Entering raffle for</p>
//                         <p className="text-[#E27625] font-semibold text-3xl">{raffleName}</p>
//                     </div>

//                     {/* Quick Select Buttons
//                     <div>
//                         <p className="text-gray-300 text-sm mb-3">Quick Select:</p>
//                         <div className="grid grid-cols-3 gap-2">
//                             {quickSelectButtons.map((quantity) => (
//                                 <button
//                                     key={quantity}
//                                     onClick={() => handleQuickSelect(quantity)}
//                                     className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
//                                         ticketQuantity === quantity
//                                             ? 'bg-[#E27625] text-white'
//                                             : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                                     }`}
//                                 >
//                                     {quantity}
//                                 </button>
//                             ))}
//                         </div>
//                     </div> */}

//                     {/* Manual Input */}
//                     <div>
//                         <p className="text-gray-300 text-sm mb-3">Ticket Amount:</p>
//                         <div className="flex items-center gap-3">
//                             <button
//                                 onClick={handleDecrement}
//                                 disabled={ticketQuantity <= 1}
//                                 className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white"
//                             >
//                                 <Minus size={16} />
//                             </button>
                            
//                             <div className="flex-1">
//                                 <Input
//                                     type="number"
//                                     value={ticketQuantity}
//                                     onChange={(e) => {
//                                         const value = Math.max(1, Math.min(1000, Number(e.target.value) || 1));
//                                         setTicketQuantity(value);
//                                     }}
//                                     className="bg-gray-800 border-gray-600 text-white text-center text-lg font-semibold"
//                                     min="1"
//                                     max="1000"
//                                 />
//                             </div>
                            
//                             <button
//                                 onClick={handleIncrement}
//                                 disabled={ticketQuantity >= 1000}
//                                 className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white"
//                             >
//                                 <Plus size={16} />
//                             </button>
//                         </div>
//                         <p className="text-xs text-gray-500 mt-1 text-center">Maximum 1000 tickets per transaction</p>
//                     </div>

//                     {/* Total Cost */}
//                     <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-4">
//                         <div className="text-center">
//                             <p className="text-gray-400 text-sm mb-1">Total Cost</p>
//                             <p className="text-2xl font-bold text-green-400">
//                                 {(Number(ticketPrice) * ticketQuantity).toFixed(4)} ETH
//                             </p>
//                             <p className="text-xs text-gray-500 mt-1">
//                                 {ticketQuantity} {ticketQuantity === 1 ? 'ticket' : 'tickets'} × {ticketPrice} ETH
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="p-6 border-t border-gray-700">
//                     <div className="flex gap-3">
//                         <Button
//                             variant="outline"
//                             onClick={onClose}
//                             className="flex-1 border-gray-600 hover:bg-gray-700 text-gray-300"
//                             disabled={isProcessing}
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             onClick={onConfirm}
//                             disabled={isProcessing}
//                             className="flex-1 bg-gradient-to-r from-[#E27625] to-orange-600 hover:from-orange-600 hover:to-[#E27625] text-white font-semibold"
//                         >
//                             {isProcessing ? (
//                                 <>
//                                     <Loader2 className="animate-spin h-4 w-4 mr-2" />
//                                     Processing...
//                                 </>
//                             ) : (
//                                 'Confirm Purchase'
//                             )}
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const RaffleCard: React.FC<{ raffle: Raffle, onBuyTickets: (raffle: Raffle) => void }> = ({ raffle, onBuyTickets }) => {
//     const now = Date.now();
//     const startTime = Number(raffle.startTime) * 1000;
//     const endTime = Number(raffle.endTime) * 1000;

//     const isUpcoming = now < startTime;
//     const isEnded = now >= endTime;
//     const isActive = !isUpcoming && !isEnded;

//     let badgeText: string;
//     let buttonText: string;
//     let isButtonDisabled: boolean;

//     if (isUpcoming) {
//         badgeText = "Upcoming";
//         buttonText = "Upcoming";
//         isButtonDisabled = true;
//     } else if (isActive) {
//         badgeText = formatTimeLeft(Number(raffle.endTime));
//         buttonText = "Enter Raffle";
//         isButtonDisabled = false;
//     } else { // isEnded
//         badgeText = "Ended";
//         buttonText = "Raffle Ended";
//         isButtonDisabled = true;
//     }

//     return (
//         <div className="bg-gradient-to-br from-[#1a1b23] to-[#252538] rounded-2xl overflow-hidden border border-gray-700/50 hover:border-[#E27625]/50 transition-all duration-300 group shadow-xl hover:shadow-2xl hover:shadow-[#E27625]/10">
//             <div className="relative h-56 overflow-hidden">
//                 <img 
//                     src={raffle.imageURL} 
//                     alt={raffle.name} 
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                
//                 {/* Status Badge */}
//                 <div className="absolute top-4 left-4">
//                     <div className=" bg-gradient-to-r from-[#E27625] to-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wider">
//                         🔥 HOT
//                     </div>
//                 </div>

//                 {/* Time Left Badge */}
//                 <div className="absolute top-4 right-4">
//                     <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
//                         <Clock size={12} />
//                         {badgeText}
//                     </div>
//                 </div>

//                 {/* Prize Amount Overlay */}
//                 <div className="absolute bottom-4 left-4 right-4">
//                     <div className="bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/10">
//                         <p className="text-gray-300 text-xs uppercase tracking-wide">Prize Pool</p>
//                         <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
//                             {raffle.prizeAmount} ETH
//                         </p>
//                     </div>
//                 </div>
//             </div>

//             <div className="p-6 space-y-4">
//                 <div>
//                     <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-[#E27625] transition-colors">
//                         {raffle.name}
//                     </h3>
//                 </div>

//                 {/* Stats Grid */}
//                 <div className="grid grid-cols-2 gap-4">
//                     <div className="bg-gray-800/50 rounded-lg p-3 text-center">
//                         <div className="flex items-center justify-center gap-1.5 text-gray-400 mb-1">
//                             <Ticket size={14} />
//                             <span className="text-xs">Tickets</span>
//                         </div>
//                         <p className="font-bold text-white">{raffle.totalTicketsSold}</p>
//                     </div>
                    
//                     <div className="bg-gray-800/50 rounded-lg p-3 text-center">
//                         <div className="flex items-center justify-center gap-1.5 text-[#1ab859] mb-1">
//                             <DollarSign size={12} />
//                             <span className="text-xs ">Price</span>
//                         </div>
//                         <p className="font-bold text-white">{raffle.ticketPrice} ETH</p>
//                     </div>
//                 </div>

//                 {/* Action Button */}
//                 <Button 
//                     className="w-full bg-gradient-to-r from-[#E27625] to-orange-600 hover:from-orange-600 hover:to-[#E27625] text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
//                     disabled={isButtonDisabled} 
//                     onClick={() => onBuyTickets(raffle)}
//                 >
//                     <div className="flex items-center justify-center gap-2">
//                         <Coins size={18} />
//                         {buttonText}
//                     </div>
//                 </Button>
//             </div>
//         </div>
//     );
// };


// const RaffleSection = () => {
//     const [raffles, setRaffles] = useState<Raffle[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [ticketQuantity, setTicketQuantity] = useState(1);
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [showConfirmation, setShowConfirmation] = useState(false);
//     const [purchasedTickets, setPurchasedTickets] = useState(0);
//     const [showAllRaffles, setShowAllRaffles] = useState(false);

//     const loadRaffles = useCallback(async () => {
//         setLoading(true);
//         try {
//             const allRaffles = await raffleService.getAllRaffles();
//             const activeRaffles = allRaffles.filter(r => !r.isCompleted);
//             // Sort by end time, closest to ending first
//             activeRaffles.sort((a, b) => Number(a.endTime) - Number(b.endTime));
//             setRaffles(activeRaffles);
//         } catch (error: any) {
//             toast.error(error.message || "Failed to load raffles.");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         loadRaffles();
//     }, [loadRaffles]);
    
//     const handleBuyClick = (raffle: Raffle) => {
//         setSelectedRaffle(raffle);
//         setTicketQuantity(1);
//         setIsModalOpen(true);
//     };

//     const handleConfirmPurchase = async () => {
//         if (!selectedRaffle) return;
//         setIsProcessing(true);
//         try {
//             toast.info(`Purchasing ${ticketQuantity} ticket(s)... Please confirm in your wallet.`);
//             await raffleService.buyTickets(selectedRaffle.raffleId, ticketQuantity);
//             toast.success("Tickets purchased successfully!");
            
//             // Store purchase info for confirmation modal
//             setPurchasedTickets(ticketQuantity);
            
//             // Close ticket selection modal and show confirmation
//             setIsModalOpen(false);
//             setShowConfirmation(true);
            
//             loadRaffles(); // Refresh data
//         } catch (error: any) {
//             toast.error(error.message || "Ticket purchase failed.");
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     // Toggle view all raffles
//     const handleToggleViewAll = () => {
//         setShowAllRaffles(!showAllRaffles);
//     };

//     // Get displayed raffles based on current view mode
//     const displayedRaffles = showAllRaffles ? raffles : raffles.slice(0, 8);
    
//     if (loading) {
//         return (
//             <div className="flex flex-col justify-center items-center py-20">
//                 <Loader2 className="h-12 w-12 text-[#E27625] animate-spin mb-4" />
//                 <p className="text-gray-400">Loading awesome raffles...</p>
//             </div>
//         );
//     }

//     return (
//         <section className="py-12">
//             {/* Header Section */}
//             <div className="mb-6 sm:mb-8">
//                 <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl border border-[#333447]">
//                     <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold bg-gradient-to-r from-[#E27625] to-[#F59E0B] bg-clip-text text-transparent mb-2 text-center sm:text-left">
//                         Active Raffles
//                     </h1>
//                     <p className="text-[#A1A1AA] text-sm sm:text-base lg:text-lg text-center sm:text-left leading-relaxed">
//                         Join exciting raffles and win amazing prizes! 🪄🎲💫
//                     </p>
//                 </div>
//             </div>
            
//             {raffles.length === 0 ? (
//                 <div className="text-center py-16 bg-gradient-to-br from-[#1a1b23] to-[#2a2b35] rounded-2xl border border-gray-700/50">
//                     <div className="mb-6">
//                         <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <Ticket className="w-8 h-8 text-gray-400" />
//                         </div>
//                         <h3 className="text-2xl mb-3 font-bold text-white">No Active Raffles</h3>
//                         <p className="text-gray-400 max-w-md mx-auto">
//                             There are no active raffles at the moment. Check back soon for new opportunities to win amazing prizes!
//                         </p>
//                     </div>
//                 </div>
//             ) : (
//                 <>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                         {displayedRaffles.map(raffle => (
//                             <RaffleCard key={raffle.raffleId} raffle={raffle} onBuyTickets={handleBuyClick} />
//                         ))}
//                     </div>
                    
//                     {/* Show more indicator when not showing all */}
//                     {!showAllRaffles && raffles.length > 8 && (
//                         <div className="text-center mt-8">
//                             <button 
//                                 onClick={handleToggleViewAll}
//                                 className="px-6 py-3 text-sm bg-transparent border-2 border-[#E27625] text-[#E27625] hover:bg-[#E27625] hover:text-white rounded-xl transition-all duration-300 font-semibold"
//                             >
//                                 View All Raffles
//                             </button>
//                         </div>
//                     )}
//                 </>
//             )}

//             {/* Ticket Count Selection Popup */}
//             <TicketCountPopup
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//                 ticketQuantity={ticketQuantity}
//                 setTicketQuantity={setTicketQuantity}
//                 ticketPrice={selectedRaffle?.ticketPrice || "0"}
//                 onConfirm={handleConfirmPurchase}
//                 isProcessing={isProcessing}
//                 raffleName={selectedRaffle?.name || ""}
//             />

//             {/* Confirmation Modal */}
//             <ConfirmationModal
//                 open={showConfirmation}
//                 onOpenChange={setShowConfirmation}
//                 raffle={selectedRaffle}
//                 ticketQuantity={purchasedTickets}
//             />
//         </section>
//     );
// };

// export default RaffleSection;



//components/RewardCom/RaffleSection.tsx
import React, { useState, useEffect, useCallback } from "react";
import { raffleService, Raffle } from "@/services/raffleBlockchainService";
import { toast } from "react-toastify";
import { Loader2, Ticket, Clock, Coins, Plus, Minus, X , DollarSign} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
//import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ConfirmationModal } from "./Confirmation-model";

// Helper function to format time left
const formatTimeLeft = (endTime: number) => {
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = endTime - now;

    if (timeLeft <= 0) {
        return "Ended";
    }

    const days = Math.floor(timeLeft / (3600 * 24));
    const hours = Math.floor((timeLeft % (3600 * 24)) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);

    if (days > 0) {
        return `${days}d ${hours}h left`;
    }
    if (hours > 0) {
        return `${hours}h ${minutes}m left`;
    }
    return `${minutes}m left`;
};

// Ticket Count Selection Popup Component
const TicketCountPopup: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    ticketQuantity: number;
    setTicketQuantity: (quantity: number) => void;
    ticketPrice: string;
    onConfirm: () => void;
    isProcessing: boolean;
    raffleName: string;
}> = ({ isOpen, onClose, ticketQuantity, setTicketQuantity, ticketPrice, onConfirm, isProcessing, raffleName }) => {
    
    const quickSelectButtons = [1, 5, 10, 25, 50, 100];
    
    const handleQuickSelect = (quantity: number) => {
        setTicketQuantity(quantity);
    };

    const handleIncrement = () => {
        if (ticketQuantity < 1000) {
            setTicketQuantity(ticketQuantity + 1);
        }
    };

    const handleDecrement = () => {
        if (ticketQuantity > 1) {
            setTicketQuantity(ticketQuantity - 1);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1a1b23] border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">Select Tickets</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <p className="text-gray-400 text-sm mb-1">Entering raffle for</p>
                        <p className="text-[#E27625] font-semibold text-3xl">{raffleName}</p>
                    </div>

                    {/* Manual Input */}
                    <div>
                        <p className="text-gray-300 text-sm mb-3">Ticket Amount:</p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleDecrement}
                                disabled={ticketQuantity <= 1}
                                className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white"
                            >
                                <Minus size={16} />
                            </button>
                            
                            <div className="flex-1">
                                <Input
                                    type="number"
                                    value={ticketQuantity}
                                    onChange={(e) => {
                                        const value = Math.max(1, Math.min(1000, Number(e.target.value) || 1));
                                        setTicketQuantity(value);
                                    }}
                                    className="bg-[#1C1C27] border-gray-600 text-white text-center text-lg font-semibold"
                                    min="1"
                                    max="1000"
                                />
                            </div>
                            
                            <button
                                onClick={handleIncrement}
                                disabled={ticketQuantity >= 1000}
                                className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-center">Maximum 1000 tickets per transaction</p>
                    </div>

                    {/* Total Cost */}
                    <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-4">
                        <div className="text-center">
                            <p className="text-gray-400 text-sm mb-1">Total Cost</p>
                            <p className="text-2xl font-bold text-green-400">
                                {(Number(ticketPrice) * ticketQuantity).toFixed(4)} ETH
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {ticketQuantity} {ticketQuantity === 1 ? 'ticket' : 'tickets'} × {ticketPrice} ETH
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 border-t border-gray-700">
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 border-gray-600 hover:bg-gray-700 text-gray-300"
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={isProcessing}
                            className="flex-1 bg-gradient-to-r from-[#E27625] to-orange-600 hover:from-orange-600 hover:to-[#E27625] text-white font-semibold"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                    Processing...
                                </>
                            ) : (
                                'Confirm Purchase'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RaffleCard: React.FC<{ raffle: Raffle, onBuyTickets: (raffle: Raffle) => void }> = ({ raffle, onBuyTickets }) => {
    const now = Date.now();
    const startTime = Number(raffle.startTime) * 1000;
    const endTime = Number(raffle.endTime) * 1000;

    const isUpcoming = now < startTime;
    const isEnded = now >= endTime;
    const isActive = !isUpcoming && !isEnded;

    // Badge display logic
    const isHot = Number(raffle.prizeAmount) > 1;
    const threeHoursInMillis = 3 * 60 * 60 * 1000;
    const isNew = isActive && (now - startTime) < threeHoursInMillis;

    let badgeText: string;
    let buttonText: string;
    let isButtonDisabled: boolean;

    if (isUpcoming) {
        badgeText = "Upcoming";
        buttonText = "Upcoming";
        isButtonDisabled = true;
    } else if (isActive) {
        badgeText = formatTimeLeft(Number(raffle.endTime));
        buttonText = "Enter Raffle";
        isButtonDisabled = false;
    } else { // isEnded
        badgeText = "Ended";
        buttonText = "Raffle Ended";
        isButtonDisabled = true;
    }

    return (
        <div className="bg-gradient-to-br from-[#1a1b23] to-[#252538] rounded-2xl overflow-hidden border border-gray-700/50 hover:border-[#E27625]/50 transition-all duration-300 group shadow-xl hover:shadow-2xl hover:shadow-[#E27625]/10">
            <div className="relative h-56 overflow-hidden">
                <img 
                    src={raffle.imageURL} 
                    alt={raffle.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                
                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col items-start gap-y-2">
                    {isNew && (
                         <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 rounded-full text-[10px] font-bold tracking-wider">
                            ✨ NEW
                        </div>
                    )}
                    {isHot && (
                        <div className="bg-gradient-to-r from-[#E27625] to-orange-600 text-white px-2 py-1 rounded-full text-[10px] font-bold tracking-wider">
                            🔥 HOT
                        </div>
                    )}
                </div>

                {/* Time Left Badge */}
                <div className="absolute top-4 right-4">
                    <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
                        <Clock size={12} />
                        {badgeText}
                    </div>
                </div>

                {/* Prize Amount Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/10">
                        <p className="text-gray-300 text-xs uppercase tracking-wide">Prize Pool</p>
                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                            {raffle.prizeAmount} ETH
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-[#E27625] transition-colors">
                        {raffle.name}
                    </h3>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-[#ddc23c] mb-1">
                            <Ticket size={14} />
                            <span className="text-xs">Tickets</span>
                        </div>
                        <p className="font-bold text-white">{raffle.totalTicketsSold}</p>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-[#1ab859] mb-1">
                            <DollarSign size={12} />
                            <span className="text-xs ">Price</span>
                        </div>
                        <p className="font-bold text-white">{raffle.ticketPrice} ETH</p>
                    </div>
                </div>

                {/* Action Button */}
                <Button 
                    className="w-full bg-gradient-to-r from-[#E27625] to-orange-600 hover:from-orange-600 hover:to-[#E27625] text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                    disabled={isButtonDisabled} 
                    onClick={() => onBuyTickets(raffle)}
                >
                    <div className="flex items-center justify-center gap-2">
                        <Coins size={18} />
                        {buttonText}
                    </div>
                </Button>
            </div>
        </div>
    );
};


const RaffleSection = () => {
    const [raffles, setRaffles] = useState<Raffle[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ticketQuantity, setTicketQuantity] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [purchasedTickets, setPurchasedTickets] = useState(0);
    const [showAllRaffles, setShowAllRaffles] = useState(false);

    const loadRaffles = useCallback(async () => {
        setLoading(true);
        try {
            const allRaffles = await raffleService.getAllRaffles();
            
            const twelveHoursAgo = (Math.floor(Date.now() / 1000)) - (12 * 3600);

            const visibleRaffles = allRaffles.filter(raffle => {
                const endTime = Number(raffle.endTime);
                // Keep the raffle if it's not ended, OR if it ended within the last 12 hours.
                return endTime > twelveHoursAgo;
            });

            // Sort by end time, closest to ending first
            visibleRaffles.sort((a, b) => Number(a.endTime) - Number(b.endTime));
            setRaffles(visibleRaffles);

        } catch (error: any) {
            toast.error(error.message || "Failed to load raffles.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRaffles();
        // Set up an interval to refresh the list periodically to remove old raffles
        const interval = setInterval(loadRaffles, 60 * 60 * 1000); // Refresh every hour
        return () => clearInterval(interval);
    }, [loadRaffles]);
    
    const handleBuyClick = (raffle: Raffle) => {
        setSelectedRaffle(raffle);
        setTicketQuantity(1);
        setIsModalOpen(true);
    };

    const handleConfirmPurchase = async () => {
        if (!selectedRaffle) return;
        setIsProcessing(true);
        try {
            toast.info(`Purchasing ${ticketQuantity} ticket(s)... Please confirm in your wallet.`);
            await raffleService.buyTickets(selectedRaffle.raffleId, ticketQuantity);
            toast.success("Tickets purchased successfully!");
            
            // Store purchase info for confirmation modal
            setPurchasedTickets(ticketQuantity);
            
            // Close ticket selection modal and show confirmation
            setIsModalOpen(false);
            setShowConfirmation(true);
            
            loadRaffles(); // Refresh data
        } catch (error: any) {
            toast.error(error.message || "Ticket purchase failed.");
        } finally {
            setIsProcessing(false);
        }
    };

    // Toggle view all raffles
    const handleToggleViewAll = () => {
        setShowAllRaffles(!showAllRaffles);
    };

    // Get displayed raffles based on current view mode
    const displayedRaffles = showAllRaffles ? raffles : raffles.slice(0, 8);
    
    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center py-20">
                <Loader2 className="h-12 w-12 text-[#E27625] animate-spin mb-4" />
                <p className="text-gray-400">Loading awesome raffles...</p>
            </div>
        );
    }

    return (
        <section className="py-5">
            {/* Header Section */}
            {/* <div className="mb-6 sm:mb-8">
                <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl border border-[#333447]">
                    <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold bg-gradient-to-r from-[#E27625] to-[#F59E0B] bg-clip-text text-transparent mb-2 text-center sm:text-left">
                        Active Raffles
                    </h1>
                    <p className="text-[#A1A1AA] text-sm sm:text-base lg:text-lg text-center sm:text-left leading-relaxed">
                        Join exciting raffles and win amazing prizes! 🪄🎲💫
                    </p>
                </div>
            </div> */}
            
            {raffles.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-[#1a1b23] to-[#2a2b35] rounded-2xl border border-gray-700/50">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Ticket className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-2xl mb-3 font-bold text-white">No Active Raffles</h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                            There are no active raffles at the moment. Check back soon for new opportunities to win amazing prizes!
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {displayedRaffles.map(raffle => (
                            <RaffleCard key={raffle.raffleId} raffle={raffle} onBuyTickets={handleBuyClick} />
                        ))}
                    </div>
                    
                    {/* Show more indicator when not showing all */}
                    {!showAllRaffles && raffles.length > 8 && (
                        <div className="text-center mt-8">
                            <button 
                                onClick={handleToggleViewAll}
                                className="px-6 py-3 text-sm bg-transparent border-2 border-[#E27625] text-[#E27625] hover:bg-[#E27625] hover:text-white rounded-xl transition-all duration-300 font-semibold"
                            >
                                View All Raffles
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Ticket Count Selection Popup */}
            <TicketCountPopup
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                ticketQuantity={ticketQuantity}
                setTicketQuantity={setTicketQuantity}
                ticketPrice={selectedRaffle?.ticketPrice || "0"}
                onConfirm={handleConfirmPurchase}
                isProcessing={isProcessing}
                raffleName={selectedRaffle?.name || ""}
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
                open={showConfirmation}
                onOpenChange={setShowConfirmation}
                raffle={selectedRaffle}
                ticketQuantity={purchasedTickets}
            />
        </section>
    );
};

export default RaffleSection;