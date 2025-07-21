// components/admin/shared/DeclareWinnerSection.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Using shadcn Select
import { Loader2, X, AlertTriangle } from "lucide-react"; // Import icons for loading, cancel, and alert

interface DeclareWinnerSectionProps {
  event: any; // Consider defining a specific Event type
  contract: any; // Define contract type if possible
  web3: any; // Define Web3 type if possible (e.g., import Web3 from 'web3')
  onWinnerDeclared: () => void;
  onCancel: () => void;
}

export const DeclareWinnerSection: React.FC<DeclareWinnerSectionProps> = ({
  event,
  contract,
  web3,
  onWinnerDeclared,
  onCancel,
}) => {
  const [winningOption, setWinningOption] = useState<string>("");
  const [isDeclaring, setIsDeclaring] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // State for error messages

  const confirmDeclareWinner = async () => {
    setErrorMsg(null); // Clear previous errors
    if (!contract || !web3) {
      setErrorMsg(
        "Web3 provider or contract not available. Please ensure your wallet is connected and the page is loaded correctly."
      );
      return;
    }
    if (!winningOption) {
      setErrorMsg("Please select a winning option before declaring.");
      return;
    }

    setIsDeclaring(true);
    try {
      const accounts = await web3.eth.getAccounts();
      if (!accounts || accounts.length === 0) {
        setErrorMsg(
          "Cannot retrieve accounts. Please ensure your wallet (e.g., MetaMask) is connected and unlocked."
        );
        setIsDeclaring(false);
        return;
      }

      console.log(
        `Attempting to declare winner for event ${event.eventId} with option "${winningOption}" from account ${accounts[0]}`
      );

      // Estimate gas (optional but good practice)
      // const gasEstimate = await contract.methods
      //   .declareWinner(event.eventId, winningOption)
      //   .estimateGas({ from: accounts[0] });

      // Send transaction
      const receipt = await contract.methods
        .declareWinner(event.eventId, winningOption)
        .send({
          from: accounts[0],
          // gas: Math.round(gasEstimate * 1.2), // Add a buffer to gas estimate
        });

      console.log("Transaction successful:", receipt);
      // Optionally show a success toast instead of alert
      alert(
        `Winner declared successfully for Event ID: ${event.eventId}! Winning Option: ${winningOption}`
      );
      setWinningOption("");
      onWinnerDeclared(); // Callback for successful declaration
      // onCancel(); // Typically called by parent after onWinnerDeclared re-renders list
    } catch (error: any) {
      console.error("Error declaring winner:", error);
      let friendlyError = "An error occurred while declaring the winner.";
      if (error.message) {
        if (error.message.includes("User denied transaction signature")) {
          friendlyError = "Transaction rejected in wallet.";
        } else if (error.message.includes("Admin only")) {
          // Example: Check for specific contract errors
          friendlyError = "Only an admin can perform this action.";
        } else {
          // Try to extract a more specific message if available
          const messageMatch = error.message.match(/Reason: (.*?)\./);
          if (messageMatch && messageMatch[1]) {
            friendlyError = `Error: ${messageMatch[1]}`;
          } else {
            friendlyError = `Error: ${error.message.substring(0, 100)}...`; // Keep it concise
          }
        }
      }
      setErrorMsg(friendlyError);
      // Don't automatically call onCancel here, let the user see the error
    } finally {
      setIsDeclaring(false);
    }
  };

  // Use optional chaining for safer access
  const options = Array.isArray(event?.options) ? event.options : [];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label
          htmlFor={`select-winner-${event?.eventId}`}
          className="text-lg font-semibold text-white block"
        >
          Select Winning Option
        </Label>
        <Select
          value={winningOption}
          onValueChange={setWinningOption}
          disabled={isDeclaring}
        >
          <SelectTrigger
            id={`select-winner-${event?.eventId}`}
            className="w-full h-12 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-gray-600/30 text-white focus:border-emerald-500/50 focus:ring-emerald-500/30 rounded-lg font-medium"
            aria-label="Select winning option"
          >
            <SelectValue placeholder="Choose the winning outcome..." />
          </SelectTrigger>
          <SelectContent className="bg-[#282836] border-gray-600/50 rounded-lg shadow-2xl max-h-60">
            {options.length > 0 ? (
              options.map((option: string, index: number) => (
                <SelectItem
                  key={index}
                  value={option}
                  className="hover:bg-emerald-500/10 focus:bg-emerald-500/10 cursor-pointer transition-all duration-200 rounded-md my-1 py-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="font-medium text-white">{option}</span>
                  </div>
                </SelectItem>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-slate-400 italic text-center">
                No options available for this event.
              </div>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Display Error Message */}
      {errorMsg && (
        <div className="p-4 bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-700/40 rounded-lg flex items-start gap-3 backdrop-blur-sm">
          <div className="p-1 rounded-full bg-red-500/20 mt-0.5">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-red-300">Error</p>
            <p className="text-sm text-red-200">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex pt-2 space-x-4 justify-end items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isDeclaring}
          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 active:scale-95"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={confirmDeclareWinner}
          disabled={!winningOption || isDeclaring || options.length === 0}
          className={`font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform min-w-[180px] ${
            !winningOption || isDeclaring || options.length === 0
              ? "bg-gradient-to-r from-gray-700 to-gray-600 cursor-not-allowed opacity-60 text-gray-400"
              : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-95 hover:shadow-xl shadow-emerald-500/20 text-white"
          }`}
        >
          {isDeclaring ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-5 w-5 mr-3 animate-spin" />
              <span>Declaring Winner...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span>Declare Winner</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};
