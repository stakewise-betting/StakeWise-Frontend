// components/admin/DeclareWinnerSection.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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

  const confirmDeclareWinner = async () => {
    if (!contract || !web3) return;
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) {
      alert("Please connect to MetaMask.");
      return;
    }

    if (!winningOption) {
      alert("Please select a winning option.");
      return;
    }

    try {
      await contract.methods
        .declareWinner(event.eventId, winningOption)
        .send({ from: accounts[0] });
      alert(
        `Winner declared for Event ID: ${event.eventId} - Winning Option: ${winningOption}`
      );
      setWinningOption("");
      onWinnerDeclared();
      onCancel();
    } catch (error: any) {
      console.error("Error declaring winner:", error);
      alert(`Error declaring winner: ${error.message}`);
    }
  };

  return (
    <div className="mt-4">
      <Label className="text-black">Select Winning Option:</Label>
      <select
        value={winningOption}
        onChange={(e) => setWinningOption(e.target.value)}
        className="block w-full p-2 border border-gray-300 rounded text-black"
      >
        <option value="">Select Winning Option</option>
        {event.options.map((option: string, index: number) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="flex mt-2 space-x-2">
        <Button size="sm" onClick={confirmDeclareWinner}>
          Confirm Declare Winner
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
