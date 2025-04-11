// components/admin/events/EventTableItem.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Trash2, CheckCircle, XCircle, Award } from "lucide-react";
import { DeclareWinnerSection } from "../shared/DeclareWinnerSection";
import Web3 from "web3"; // Import Web3

interface EventTableItemProps {
  event: any; // Ensure event object contains 'prizePool' from contract
  contract: any;
  web3: Web3 | null; // Pass web3 instance down
  onWinnerDeclared: () => void;
}

export const EventTableItem: React.FC<EventTableItemProps> = ({
  event,
  contract,
  web3, // Receive web3 prop
  onWinnerDeclared,
}) => {
  const [isDeclaringWinner, setIsDeclaringWinner] = useState(false);
  const isEventEnded = new Date(Number(event.endTime) * 1000) < new Date();
  const isOngoing = !event.isCompleted && !isEventEnded;
  const isAwaitingResult = !event.isCompleted && isEventEnded;

  const getStatusBadge = () => {
    if (event.isCompleted) {
      return (
        <Badge variant="default" className="bg-green-500 text-white">
          Completed
        </Badge>
      );
    } else if (isAwaitingResult) {
      return (
        <Badge variant="default" className="bg-yellow-500 text-black">
          Awaiting Result
        </Badge>
      );
    } else if (isOngoing) {
      return (
        <Badge variant="secondary" className="bg-blue-500 text-white">
          Ongoing
        </Badge>
      );
    } else {
      return <Badge variant="outline">Scheduled</Badge>;
    }
  };

  const handleDeclareWinnerClick = () => setIsDeclaringWinner(true);
  const handleCancelDeclareWinner = () => setIsDeclaringWinner(false);

  // --- Updated function to format Prize Pool ---
  const formatPrizePool = (
    prizePoolWei: string | undefined | null, // Expecting Wei value as string from contract
    web3Instance: Web3 | null
  ): string => {
    // Check if web3 is available and prizePool value exists
    if (!web3Instance || !prizePoolWei || prizePoolWei === "0") {
      return "0.00 ETH"; // Default if no web3 or no prize pool
    }
    try {
      // Convert Wei to Ether
      const prizePoolInEther = web3Instance.utils.fromWei(
        prizePoolWei,
        "ether"
      );
      // Format to 2 decimal places
      return `${Number(prizePoolInEther).toFixed(2)} ETH`;
    } catch (error) {
      console.error(
        `Error formatting prize pool (value: ${prizePoolWei}):`,
        error
      );
      return "Error ETH"; // Indicate formatting error
    }
  };
  // --- End Updated function ---

  return (
    <>
      {/* Data Row */}
      <TableRow key={Number(event.eventId)}>
        <TableCell>{getStatusBadge()}</TableCell>
        <TableCell className="font-mono text-xs">
          {event.eventId?.toString() ?? "N/A"}
        </TableCell>
        <TableCell className="font-medium max-w-xs truncate" title={event.name}>
          {event.name}
        </TableCell>
        <TableCell>{event.category || "N/A"}</TableCell>
        <TableCell>
          {new Date(Number(event.startTime) * 1000).toLocaleDateString()}
        </TableCell>
        {/* Use the new formatting function with event.prizePool */}
        <TableCell>{formatPrizePool(event.prizePool, web3)}</TableCell>
        <TableCell>{event.listedBy || "Admin"}</TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end space-x-2">
            {!event.isCompleted && isAwaitingResult && !isDeclaringWinner && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeclareWinnerClick}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                <Award className="h-4 w-4 mr-1" /> Declare
              </Button>
            )}
            {/* Add Edit/Delete Buttons - Requires Implementation */}
          </div>
          {event.isCompleted && (
            <p
              className="text-xs text-green-700 font-semibold mt-1 truncate"
              title={`Winner: ${event.winningOption}`}
            >
              Winner: {event.winningOption}
            </p>
          )}
        </TableCell>
      </TableRow>

      {/* Declare Winner Row (conditional) */}
      {isDeclaringWinner && (
        <TableRow>
          <TableCell colSpan={8}>
            <DeclareWinnerSection
              event={event}
              contract={contract}
              web3={web3}
              onWinnerDeclared={() => {
                setIsDeclaringWinner(false);
                onWinnerDeclared();
              }}
              onCancel={handleCancelDeclareWinner}
            />
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
