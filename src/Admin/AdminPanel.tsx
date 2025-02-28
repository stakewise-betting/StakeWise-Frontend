// components/admin/AdminPanel.tsx
import { useState, useEffect } from "react";
import Web3 from "web3";
import { EventForm } from "./EventForm";
import { EventList } from "./EventList";
import DownloadReport from "./DownloadReport";

import setupWeb3AndContract from "@/services/blockchainService";

export const AdminPanel = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      const { web3Instance, betContract } = await setupWeb3AndContract();
      setWeb3(web3Instance);
      setContract(betContract);
      if (betContract) {
        loadEvents(betContract);
        checkAdminAddress(betContract);
      }
    };
    init();
  }, []);

  const loadEvents = async (betContract: any) => {
    try {
      const eventCount = await betContract.methods.nextEventId().call();
      console.log("Total events:", eventCount);

      const eventList: any[] = [];
      for (let eventId = 1; eventId < eventCount; eventId++) {
        try {
          const eventData = await betContract.methods.getEvent(eventId).call();
          const eventOptions = await betContract.methods
            .getEventOptions(eventId)
            .call();
          eventList.push({ ...eventData, options: eventOptions });
        } catch (error) {
          console.warn(`Skipping invalid event ${eventId}:`, error);
        }
      }
      setEvents(eventList);
    } catch (err) {
      console.error("Error loading events:", err);
    }
  };

  const checkAdminAddress = async (betContract: any) => {
    if (contract) {
      const adminAddress = await betContract.methods.admin().call();
      console.log("Contract Admin Address:", adminAddress);
    }
  };

  const handleEventCreated = () => {
    if (contract) {
      loadEvents(contract); // Reload events after a new event is created.
    }
  };

  const handleWinnerDeclared = () => {
    if (contract) {
      loadEvents(contract); // Reload events after a winner is declared.
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-black">
        Admin Panel - Betting Events
      </h1>

      <EventForm
        contract={contract}
        web3={web3}
        onEventCreated={handleEventCreated}
      />

      <EventList
        events={events}
        contract={contract}
        web3={web3}
        onWinnerDeclared={handleWinnerDeclared}
      />

      <DownloadReport />
    </div>
  );
};

export default AdminPanel;
