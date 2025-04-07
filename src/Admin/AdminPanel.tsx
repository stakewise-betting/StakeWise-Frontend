// components/admin/AdminPanel.tsx
import React, { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { AdminLayout } from "./layout/AdminLayout";
import { Dashboard } from "./dashboard/Dashboard";
import { EventsPage } from "./events/EventsPage";
import setupWeb3AndContract from "@/services/blockchainService";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { Button } from "@/components/ui/button"; // Added for retry button

const AdminPanel = () => {
  // Default export for page/component usage
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [adminProfit, setAdminProfit] = useState<string>("0");
  const [adminAddress, setAdminAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Placeholder data for dashboard (replace with actual fetching)
  const [dashboardStats, setDashboardStats] = useState({
    totalBetsPlaced: 1234, // Hardcoded
    totalUsers: 567, // Hardcoded
    ongoingEventsCount: 0,
    totalEventsCount: 0,
  });

  // --- Fetch Backend URL using Vite's import.meta.env ---
  // Ensure VITE_BACKEND_URL is set in your .env file
  const backendBaseUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  // Log the URL being used for debugging
  console.log("Using Backend URL:", backendBaseUrl);
  // --- End Environment Variable Handling ---

  const loadEvents = useCallback(
    async (betContract: any) => {
      // Removed backendBaseUrl definition from here, use the one defined above
      try {
        console.log("Loading events...");
        const eventCountBigInt = await betContract.methods.nextEventId().call();
        const eventCount = Number(eventCountBigInt); // Convert BigInt
        console.log("Total event IDs (nextEventId):", eventCount);

        const eventPromises: Promise<any>[] = [];
        // Event IDs usually start from 1 if 0 is unused or represents null
        for (let eventId = 1; eventId < eventCount; eventId++) {
          eventPromises.push(
            (async () => {
              try {
                // Fetch core data and options concurrently
                const [eventData, eventOptions] = await Promise.all([
                  betContract.methods.getEvent(eventId).call(),
                  betContract.methods.getEventOptions(eventId).call(),
                ]);

                // Fetch metadata from your backend API
                let backendData = {};
                try {
                  // Use the backendBaseUrl defined outside the loop
                  const response = await fetch(
                    `${backendBaseUrl}/api/events/${eventId}`
                  );
                  if (response.ok) {
                    backendData = await response.json();
                    // console.log(`Fetched backend data for event ${eventId}`); // Less verbose logging
                  } else if (response.status !== 404) {
                    console.warn(
                      `Could not fetch backend data for event ${eventId}: ${response.statusText}`
                    );
                  }
                } catch (apiError) {
                  console.warn(
                    `API error fetching event ${eventId}:`,
                    apiError
                  );
                }

                // Combine blockchain data and backend metadata
                return {
                  ...backendData, // Include category, volume, listedBy etc.
                  ...eventData, // Override with blockchain state like isCompleted, winningOption
                  options: eventOptions, // Always use blockchain options
                  eventId: eventId, // Ensure correct ID type (number)
                };
              } catch (error) {
                // Log specific error for this event fetch
                console.warn(
                  `Skipping event ${eventId} due to error during contract/API call:`,
                  error
                );
                return null; // Return null for failed fetches
              }
            })()
          );
        }

        const resolvedEvents = await Promise.all(eventPromises);
        const validEvents = resolvedEvents.filter((event) => event !== null); // Filter out nulls

        // Calculate stats after fetching events
        const now = Date.now() / 1000;
        const ongoing = validEvents.filter(
          (e) => !e.isCompleted && Number(e.endTime) > now
        ).length;
        const total = validEvents.length;

        setEvents(validEvents);
        setDashboardStats((prev) => ({
          ...prev, // Keep hardcoded stats
          ongoingEventsCount: ongoing,
          totalEventsCount: total,
        }));
        console.log(`Loaded ${validEvents.length} valid events.`);
      } catch (err) {
        console.error("Error loading events list:", err); // More specific error log
        setError("Failed to load events list.");
      }
    },
    [backendBaseUrl]
  ); // Add backendBaseUrl as dependency

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
      const profitWei = await betContract.methods.totalAdminProfit().call();
      const profitInEther = web3Instance.utils.fromWei(profitWei, "ether");
      setAdminProfit(profitInEther);
      console.log("Total Admin Profit:", profitInEther, "ETH");
    } catch (error) {
      console.error("Error fetching total admin profit:", error);
    }
  };

  // Main data fetching function, depends on loadEvents now
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log("Initializing Web3 and Contract...");
    try {
      const { web3Instance, betContract } = await setupWeb3AndContract();
      setWeb3(web3Instance);
      setContract(betContract);
      console.log("Web3 and Contract setup complete.");

      if (betContract && web3Instance) {
        console.log("Fetching admin address, profit, and events...");
        // Use the loadEvents defined above which now has backendBaseUrl dependency
        await Promise.all([
          loadEvents(betContract), // Call the loadEvents hook depends on
          checkAdminAddress(betContract),
          fetchTotalAdminProfit(betContract, web3Instance),
        ]);
        console.log("Initial data fetch complete.");
      } else {
        console.error("Failed to initialize contract or web3 instance.");
        setError("Failed to connect to blockchain services.");
      }
    } catch (err: any) {
      console.error("Initialization failed:", err);
      setError(`Failed to initialize: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [loadEvents]); // Add loadEvents as dependency here

  useEffect(() => {
    fetchData();
  }, [fetchData]); // fetchData depends on loadEvents, which depends on backendBaseUrl

  // Refresh handler
  const refreshAllData = useCallback(() => {
    if (contract && web3) {
      console.log("Refreshing all data...");
      setLoading(true); // Show loading indicator during refresh
      Promise.all([
        loadEvents(contract), // Re-use the loadEvents hook
        fetchTotalAdminProfit(contract, web3),
      ]).finally(() => setLoading(false));
    }
  }, [contract, web3, loadEvents]); // loadEvents is a dependency

  // Handlers passed down
  const handleEventCreated = useCallback(() => {
    console.log("Event created handler triggered.");
    refreshAllData(); // Refresh everything after creation
  }, [refreshAllData]);

  const handleWinnerDeclared = useCallback(() => {
    console.log("Winner declared handler triggered.");
    refreshAllData(); // Refresh everything after declaration
  }, [refreshAllData]);

  // Loading state UI
  if (loading && events.length === 0 && !error) {
    // Show skeleton only on initial load
    return (
      <div className="flex h-screen bg-muted/40">
        <Skeleton className="w-64 bg-background border-r h-full" />
        <main className="flex-1 p-6 md:p-8 space-y-6">
          <Skeleton className="h-8 w-1/4" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen flex-col">
        <p className="text-red-600 text-xl mb-4">{error}</p>
        <Button onClick={fetchData}>Retry Connection</Button>
      </div>
    );
  }

  // Main Render with Layout
  return (
    <AdminLayout>
      {(activeSection) => (
        <>
          {activeSection === "dashboard" && (
            <Dashboard
              adminProfit={adminProfit}
              adminAddress={adminAddress}
              totalEvents={dashboardStats.totalEventsCount}
              ongoingEvents={dashboardStats.ongoingEventsCount}
              totalBetsPlaced={dashboardStats.totalBetsPlaced} // Pass down
              totalUsers={dashboardStats.totalUsers} // Pass down
              loading={loading} // Pass loading state
            />
          )}
          {activeSection === "events" && contract && web3 && (
            <EventsPage
              events={events}
              contract={contract}
              web3={web3}
              onWinnerDeclared={handleWinnerDeclared}
              onEventCreated={handleEventCreated}
            />
          )}
          {/* Add more sections here */}
        </>
      )}
    </AdminLayout>
  );
};

export default AdminPanel;
