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

interface DeclareWinnerSectionProps {
  event: any;
  contract: any;
  web3: any;
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
  const [isDeclaring, setIsDeclaring] = useState(false); // Loading state

  const confirmDeclareWinner = async () => {
    if (!contract || !web3 || !winningOption) {
      alert("Please connect wallet and select a winning option.");
      return;
    }
    setIsDeclaring(true);
    try {
      const accounts = await web3.eth.getAccounts();
      if (!accounts || accounts.length === 0) {
        alert("Please connect to MetaMask.");
        setIsDeclaring(false);
        return;
      }

      await contract.methods
        .declareWinner(event.eventId, winningOption)
        .send({ from: accounts[0] });

      alert(
        `Winner declared for Event ID: ${event.eventId} - Winning Option: ${winningOption}`
      );
      setWinningOption("");
      onWinnerDeclared(); // Propagate success
      onCancel(); // Close the section/modal if needed
    } catch (error: any) {
      console.error("Error declaring winner:", error);
      alert(`Error declaring winner: ${error.message}`);
    } finally {
      setIsDeclaring(false);
    }
  };

  return (
    <div className="mt-4 p-4 border rounded-md bg-secondary/50">
      <Label className="font-semibold">Declare Winning Option:</Label>
      <Select value={winningOption} onValueChange={setWinningOption}>
        <SelectTrigger className="w-full mt-2">
          <SelectValue placeholder="Select Winning Option" />
        </SelectTrigger>
        <SelectContent>
          {event.options.map((option: string, index: number) => (
            <SelectItem key={index} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex mt-4 space-x-2 justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isDeclaring}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={confirmDeclareWinner}
          disabled={!winningOption || isDeclaring}
        >
          {isDeclaring ? "Declaring..." : "Confirm Declare Winner"}
        </Button>
      </div>
    </div>
  );
};
