// components/admin/events/EventsPage.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { EventListTable } from "./EventListTable";
import { AddEventModal } from "./AddEventModal";
import Web3 from "web3";

interface EventsPageProps {
  events: any[];
  contract: any;
  web3: Web3 | null;
  onWinnerDeclared: () => void;
  onEventCreated: () => void;
  isLoading?: boolean;
}

const LoadingIndicator: React.FC<{ message?: string }> = ({
  message = "Loading Events...",
}) => (
  <div className="flex flex-col items-center justify-center gap-4 py-16 text-center text-dark-secondary">
    <Loader2 className="h-8 w-8 animate-spin text-secondary" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

export const EventsPage: React.FC<EventsPageProps> = ({
  events,
  contract,
  web3,
  onWinnerDeclared,
  onEventCreated,
  isLoading = false,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen bg-primary text-dark-primary">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-dark-primary whitespace-nowrap">
            Manage Betting Events
          </h2>

          {/* Add Event Button - Focus ring removed */}
          <Button
            onClick={() => setIsAddModalOpen(true)}
            variant="outline"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                       bg-secondary/10
                       text-secondary
                       border-secondary/50
                       hover:bg-secondary/20
                       hover:border-secondary/70
                       hover:-translate-y-0.5
                       transition-all duration-300 ease-in-out shadow-sm hover:shadow-md hover:shadow-secondary/20
                       focus:outline-none focus:ring-0 focus:ring-offset-0 /* Removed focus ring */
                       w-full sm:w-auto
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            disabled={isLoading}
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add New Event</span>
          </Button>
          {/* --- End Button Styling --- */}
        </div>

        {/* Content Area: Shows loading indicator or the table */}
        <div className="bg-card border border-gray-700/60 rounded-xl shadow-lg overflow-hidden">
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <EventListTable
              events={events}
              contract={contract}
              web3={web3}
              onWinnerDeclared={onWinnerDeclared}
            />
          )}
        </div>

        <AddEventModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          contract={contract}
          web3={web3}
          onEventCreated={onEventCreated}
        />
      </div>
    </div>
  );
};
