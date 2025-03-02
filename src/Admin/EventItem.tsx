// components/admin/EventItem.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DeclareWinnerSection } from "./DeclareWinnerSection";

interface EventItemProps {
  event: any;
  contract: any;
  web3: any;
  onWinnerDeclared: () => void;
}

export const EventItem: React.FC<EventItemProps> = ({
  event,
  contract,
  web3,
  onWinnerDeclared,
}) => {
  const [declaringWinner, setDeclaringWinner] = useState(false);

  const handleDeclareWinnerClick = () => {
    setDeclaringWinner(true);
  };

  const handleCancelDeclareWinner = () => {
    setDeclaringWinner(false);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4">
      <h3 className="text-lg font-bold text-black">{event.name}</h3>
      <p className="text-black">{event.description}</p>
      <img
        src={event.imageURL}
        alt={event.name}
        className="w-full h-40 object-cover mt-2 rounded"
      />
      {event.notificationImageURL && (
        <img
          src={event.notificationImageURL}
          alt={`${event.name} Notification`}
          className="w-full h-40 object-cover mt-2 rounded"
        />
      )}
      <p className="text-gray-600">Options: {event.options.join(", ")}</p>
      <p className="text-gray-600">
        Start Time: {new Date(Number(event.startTime) * 1000).toLocaleString()}
      </p>
      <p className="text-gray-600">
        End Time: {new Date(Number(event.endTime) * 1000).toLocaleString()}
      </p>

      {!event.isCompleted && (
        <div>
          {declaringWinner ? (
            <DeclareWinnerSection
              event={event}
              contract={contract}
              web3={web3}
              onWinnerDeclared={onWinnerDeclared}
              onCancel={handleCancelDeclareWinner}
            />
          ) : (
            <Button className="mt-4" onClick={handleDeclareWinnerClick}>
              Declare Winner
            </Button>
          )}
        </div>
      )}
      {event.isCompleted && (
        <p className="text-green-600 font-semibold mt-2">
          Winner Declared: {event.winningOption}
        </p>
      )}
    </div>
  );
};
