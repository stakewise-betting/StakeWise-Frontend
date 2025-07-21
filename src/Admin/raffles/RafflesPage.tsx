import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Web3 from "web3";
import AddRaffleModal from "@/Admin/raffles/AddRaffleModal";
import RaffleListTable from "./RaffleListTable";
import { Button } from "@/components/ui/button";
import { PlusIcon, RefreshCw } from "lucide-react";

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

interface RafflesPageProps {
  contract: any;
  web3: Web3;
  onRaffleCreated?: () => void;
  onWinnerSelected?: () => void;
  isLoading?: boolean;
}

export const RafflesPage: React.FC<RafflesPageProps> = ({
  contract,
  web3,
  onRaffleCreated,
  onWinnerSelected,
}) => {
  const [raffles, setRaffles] = useState<RaffleData[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backendBaseUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Load raffles from backend and blockchain
  const loadRaffles = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch raffles from backend
      const response = await axios.get(`${backendBaseUrl}/api/raffles`);

      if (response.data.success) {
        const backendRaffles = response.data.data;

        // Enhance with blockchain data when possible
        if (contract) {
          const rafflePromises = backendRaffles.map(
            async (raffle: RaffleData) => {
              try {
                // Try to get additional blockchain data
                const blockchainRaffle = await contract.methods
                  .getRaffle(raffle.raffleId)
                  .call();

                // Convert Wei values to ETH
                const ticketPrice = web3.utils.fromWei(
                  blockchainRaffle.ticketPrice.toString(),
                  "ether"
                );
                const prizeAmount = web3.utils.fromWei(
                  blockchainRaffle.prizeAmount.toString(),
                  "ether"
                );

                // Merge data, prioritizing blockchain for accurate state
                return {
                  ...raffle,
                  isCompleted: blockchainRaffle.isCompleted,
                  winner: blockchainRaffle.winner,
                  totalTicketsSold: Number(blockchainRaffle.totalTicketsSold),
                  ticketPrice: parseFloat(ticketPrice),
                  prizeAmount: parseFloat(prizeAmount),
                };
              } catch (err) {
                console.warn(
                  `Failed to fetch blockchain data for raffle ${raffle.raffleId}:`,
                  err
                );
                // Return backend data if blockchain fetch fails
                return raffle;
              }
            }
          );

          const enhancedRaffles = await Promise.all(rafflePromises);
          setRaffles(enhancedRaffles);
        } else {
          // If contract is not available, use backend data only
          setRaffles(backendRaffles);
        }
      } else {
        throw new Error(response.data.message || "Failed to fetch raffles");
      }
    } catch (err: any) {
      console.error("Error loading raffles:", err);
      setError(`Failed to load raffles: ${err.message}`);
      toast.error("Failed to load raffles. Please try again.");
      setRaffles([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadRaffles();
  }, [contract, web3]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRaffles();
    setRefreshing(false);
  };

  // Handle raffle created
  const handleRaffleCreated = async () => {
    await loadRaffles();
    if (onRaffleCreated) onRaffleCreated();
  };

  // Delete raffle
  const handleDeleteRaffle = async (raffleId: number) => {
    try {
      const response = await axios.delete(
        `${backendBaseUrl}/api/raffles/${raffleId}`
      );

      if (response.data.success) {
        toast.success("Raffle deleted successfully");
        await loadRaffles();
      } else {
        throw new Error(response.data.message || "Failed to delete raffle");
      }
    } catch (err: any) {
      console.error("Error deleting raffle:", err);
      toast.error(`Failed to delete raffle: ${err.message}`);
    }
  };

  // Select winner
  const handleSelectWinner = async (raffleId: number) => {
    try {
      const response = await axios.post(
        `${backendBaseUrl}/api/raffles/${raffleId}/select-winner`
      );

      if (response.data.success) {
        toast.success(`Winner selected: ${response.data.data.winner}`);
        await loadRaffles();
        if (onWinnerSelected) onWinnerSelected();
      } else {
        throw new Error(response.data.message || "Failed to select winner");
      }
    } catch (err: any) {
      console.error("Error selecting winner:", err);
      toast.error(`Failed to select winner: ${err.message}`);
    }
  };

  return (
    <div className="animate-admin-fade-in space-y-8 bg-gradient-to-br from-[#1C1C27] via-[#252538] to-[#2A2A3E] min-h-screen p-6 -m-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-2xl p-8 shadow-2xl shadow-black/20 border border-gray-700/50">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#E27625] to-[#F59E0B] bg-clip-text text-transparent flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#E27625] to-[#F59E0B] flex items-center justify-center shadow-lg shadow-[#E27625]/30">
                <span className="text-2xl">🎟️</span>
              </div>
              Raffle Draws Management
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              Create, manage, and monitor raffle draws for your platform
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] hover:from-[#2A2A3E] hover:to-[#252538] border-gray-600/50 text-white hover:text-white transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              🔄 Refresh
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-[#E27625] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#E27625] text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-[#E27625]/30"
            >
              <PlusIcon className="h-4 w-4 mr-2" />➕ Create Raffle
            </Button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-gradient-to-r from-[#EF4444]/10 to-[#DC2626]/10 border-2 border-[#EF4444]/50 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#EF4444] to-[#DC2626] flex items-center justify-center">
              <span className="text-white text-xl">⚠️</span>
            </div>
            <div>
              <h3 className="text-[#EF4444] font-semibold text-lg">
                Error Loading Raffles
              </h3>
              <p className="text-gray-300 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !raffles.length ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-xl p-6 border border-gray-600/50 shadow-lg">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-6 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg w-1/4"></div>
                <div className="h-8 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg w-32"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded w-full"></div>
                <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded w-3/4"></div>
                <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-xl p-8 border border-gray-600/50 shadow-lg">
            <div className="animate-pulse">
              <div className="h-64 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl"></div>
            </div>
          </div>
        </div>
      ) : (
        <RaffleListTable
          raffles={raffles}
          onDeleteRaffle={handleDeleteRaffle}
          onSelectWinner={handleSelectWinner}
          web3={web3}
        />
      )}

      {/* Add Raffle Modal */}
      <AddRaffleModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onRaffleCreated={handleRaffleCreated}
        contract={contract}
        web3={web3}
      />
    </div>
  );
};

export default RafflesPage;
