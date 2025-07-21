// components/admin/events/EventsPage.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
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
  <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <div
        className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"
        style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
      ></div>
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-semibold text-white">{message}</h3>
      <p className="text-slate-400">
        Please wait while we fetch the latest data...
      </p>
    </div>
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
    <div className="min-h-screen bg-[#1C1C27] text-white">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-dark-primary flex items-center gap-3">
              <div className="p-2 rounded-full flex items-center justify-center bg-secondary/20">
                <PlusCircle className="w-6 h-6 text-secondary" />
              </div>
              Event Management
            </h2>
            <p className="text-slate-400 text-lg">
              Create, manage, and monitor betting events
            </p>
          </div>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            disabled={isLoading}
            className="group flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none relative overflow-hidden bg-secondary/20 text-dark-primary border border-secondary/50 shadow-lg hover:bg-secondary/30 hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none w-full sm:w-auto"
          >
            {/* Icon container matching sidebar style */}
            <div className="flex items-center justify-center mr-3 rounded-lg transition-all duration-300 h-8 w-8 bg-secondary/20 text-secondary shadow-lg">
              <PlusCircle
                className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300"
                aria-hidden="true"
              />
            </div>

            {/* Label matching sidebar style */}
            <span className="text-sm font-semibold transition-colors duration-300 text-dark-primary">
              Create New Event
            </span>
          </Button>
        </div>

        {/* Content Area */}
        <div className="bg-gradient-to-br from-[#1C1C27] to-[#262633] border border-gray-700/30 rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden">
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
