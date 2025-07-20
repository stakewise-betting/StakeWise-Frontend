import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Web3 from "web3";
import AddRaffleModal from "@/Admin/raffles/AddRaffleModal";
import RaffleListTable from "./RaffleListTable";
import { Button } from "@/components/ui/button";
import { PlusIcon, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
  isLoading = false,
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

  // Handle winner selected
  const handleWinnerSelected = async () => {
    await loadRaffles();
    if (onWinnerSelected) onWinnerSelected();
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
    <div className="animate-admin-fade-in space-y-8">
      {/* Page Header */}
      <div className="admin-section-header">
        <h1 className="admin-section-title">
          <span className="mr-2">🎟️</span> Raffle Draws Management
        </h1>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing || loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Raffle
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && !raffles.length ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full bg-gray-700/50" />
          <Skeleton className="h-64 w-full bg-gray-700/50" />
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
