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
    // Changed background, added padding, consistent border
    <div className="space-y-4 p-4 md:p-5 bg-primary/30 border border-gray-700/40 rounded-lg">
      <div>
        <Label
          htmlFor={`select-winner-${event?.eventId}`} // Add unique ID for accessibility
          className="text-sm font-semibold text-dark-primary block mb-2"
        >
          Select Winning Option for Event #{event?.eventId || "N/A"}
        </Label>
        <Select
          value={winningOption}
          onValueChange={setWinningOption}
          disabled={isDeclaring}
        >
          <SelectTrigger
            id={`select-winner-${event?.eventId}`}
            className="w-full bg-primary/50 border-gray-600/80 text-dark-primary focus:border-secondary/60 focus:ring-secondary/30"
            aria-label="Select winning option"
          >
            <SelectValue placeholder="Choose the outcome..." />
          </SelectTrigger>
          {/* Style the dropdown content */}
          <SelectContent className="bg-card border-gray-600 text-dark-primary">
            {options.length > 0 ? (
              options.map((option: string, index: number) => (
                <SelectItem
                  key={index}
                  value={option}
                  className="hover:bg-primary/50 focus:bg-primary/50 cursor-pointer"
                >
                  {option}
                </SelectItem>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-dark-secondary italic">
                No options available for this event.
              </div>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Display Error Message */}
      {errorMsg && (
        <div className="p-3 text-sm text-admin-danger bg-admin-danger/10 border border-admin-danger/30 rounded-md flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Action Buttons - Justify End */}
      <div className="flex pt-2 space-x-3 justify-end items-center">
        <Button
          variant="ghost" // Ghost variant for cancel
          size="sm"
          onClick={onCancel}
          disabled={isDeclaring}
          className="text-dark-secondary hover:text-dark-primary hover:bg-primary/50"
        >
          <X className="h-4 w-4 mr-1.5" /> {/* Added icon */}
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={confirmDeclareWinner}
          disabled={!winningOption || isDeclaring || options.length === 0} // Disable if no option selected, declaring, or no options exist
          // Use secondary color for the primary action in this context
          className="bg-secondary hover:bg-secondary/90 text-white min-w-[160px] flex items-center justify-center disabled:bg-secondary/50 disabled:cursor-not-allowed"
        >
          {isDeclaring ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Declaring...
            </>
          ) : (
            "Confirm & Declare Winner"
          )}
        </Button>
      </div>
    </div>
  );
};
