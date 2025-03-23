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
  const [adminProfit, setAdminProfit] = useState<string>("0");
  const [adminAddress, setAdminAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const { web3Instance, betContract } = await setupWeb3AndContract();
      setWeb3(web3Instance);
      setContract(betContract);
      if (betContract && web3Instance) {
        await Promise.all([
          loadEvents(betContract),
          checkAdminAddress(betContract),
          fetchTotalAdminProfit(betContract, web3Instance),
        ]);
      }
      setLoading(false);
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
    try {
      const admin = await betContract.methods.admin().call();
      setAdminAddress(admin);
      console.log("Contract Admin Address:", admin);
    } catch (error) {
      console.error("Error fetching admin address:", error);
    }
  };

  const fetchTotalAdminProfit = async (
    betContract: any,
    web3Instance: Web3
  ) => {
    try {
      const profit = await betContract.methods.totalAdminProfit().call();
      // Convert from wei to ether for better readability
      const profitInEther = web3Instance.utils.fromWei(profit, "ether");
      setAdminProfit(profitInEther);
      console.log("Total Admin Profit:", profitInEther, "ETH");
    } catch (error) {
      console.error("Error fetching total admin profit:", error);
    }
  };

  const handleEventCreated = () => {
    if (contract && web3) {
      loadEvents(contract);
      fetchTotalAdminProfit(contract, web3);
    }
  };

  const handleWinnerDeclared = () => {
    if (contract && web3) {
      loadEvents(contract);
      fetchTotalAdminProfit(contract, web3); // Update profit after winner declaration
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-black">
        Admin Panel - Betting Events
      </h1>

      {/* Admin Stats Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Admin Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Admin Address</p>
            <p className="text-gray-800 font-mono text-sm break-all">
              {adminAddress || "Loading..."}
            </p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Total Admin Profit</p>
            <p className="text-2xl font-bold text-green-700">
              {loading ? "Loading..." : `${adminProfit} ETH`}
            </p>
            <p className="text-xs text-gray-500">
              Accumulated 5% fee from all betting events
            </p>
          </div>
        </div>
      </div>

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

      <DownloadReport adminProfit={adminProfit} />
    </div>
  );
};

export default AdminPanel;
