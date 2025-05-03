// components/admin/events/EventsPage.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { EventListTable } from "./EventListTable"; // Use the table list
import { AddEventModal } from "./AddEventModal";

interface EventsPageProps {
  events: any[];
  contract: any;
  web3: any;
  onWinnerDeclared: () => void;
  onEventCreated: () => void; // To refresh list after creation
}

export const EventsPage: React.FC<EventsPageProps> = ({
  events,
  contract,
  web3,
  onWinnerDeclared,
  onEventCreated,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Manage Events</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Event
        </Button>
      </div>

      <EventListTable
        events={events}
        contract={contract}
        web3={web3}
        onWinnerDeclared={onWinnerDeclared}
      />

      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        contract={contract}
        web3={web3}
        onEventCreated={() => {
          onEventCreated(); // Call parent's refresh logic
          // Modal closes itself via its internal logic now
        }}
      />
    </div>
  );
};
