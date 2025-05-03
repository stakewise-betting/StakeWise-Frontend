// components/admin/AdminPanel.tsx
import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import axios from "axios"; // Import axios for backend API calls
import { AdminLayout } from "./layout/AdminLayout";
import { Dashboard } from "./dashboard/Dashboard";
import { EventsPage } from "./events/EventsPage";
import setupWeb3AndContract from "@/services/blockchainService";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// Define the expected structure for user count API response
interface UserCountApiResponse {
  success: boolean;
  data: {
    totalUsers: number;
  };
  message?: string;
}

const AdminPanel = () => {
  // --- Web3 & Contract State ---
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [adminProfit, setAdminProfit] = useState<string>("0");
  const [adminAddress, setAdminAddress] = useState<string>("");

  // --- Events State ---
  const [events, setEvents] = useState<any[]>([]);
  const [totalEventsCount, setTotalEventsCount] = useState<number>(0);
  const [ongoingEventsCount, setOngoingEventsCount] = useState<number>(0);

  // --- User Count State ---
  const [totalUsers, setTotalUsers] = useState<number>(0); // State for dynamic user count

  // --- General Loading & Error State ---
  const [loadingBlockchain, setLoadingBlockchain] = useState<boolean>(true); // Loading for web3/contract/events
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true); // Separate loading for user count
  const [error, setError] = useState<string | null>(null); // General error state

  // --- Placeholder data for parts not yet fetched from backend ---
  const [dashboardPlaceholders] = useState({
    totalBetsPlaced: 0, // Start at 0, will fetch later
  });

  // --- Backend URL ---
  const backendBaseUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  console.log("Using Backend URL:", backendBaseUrl); // Keep for debugging

  // --- Fetch User Count (Backend API Call) ---
  const fetchUserCount = useCallback(async () => {
    setLoadingUsers(true); // Start loading users
    console.log("Fetching user count...");
    try {
      // Make sure axios sends credentials (like cookies/tokens) if needed by your backend auth
      axios.defaults.withCredentials = true; // Add this if using cookie-based auth
      const response = await axios.get<UserCountApiResponse>(
        `${backendBaseUrl}/api/admin/user-count`
      );

      if (response.data && response.data.success) {
        setTotalUsers(response.data.data.totalUsers);
        console.log("User count fetched:", response.data.data.totalUsers);
      } else {
        console.error("Failed to fetch user count:", response.data.message);
        setError(
          (prev) =>
            prev ||
            `Failed to fetch user count: ${
              response.data.message || "Unknown error"
            }`
        ); // Set general error if user fetch fails
      }
    } catch (err: any) {
      console.error("Error fetching user count via API:", err);
      setError(
        (prev) =>
          prev ||
          `API Error fetching users: ${
            err.response?.data?.message || err.message
          }`
      ); // Set general error
    } finally {
      setLoadingUsers(false); // Finish loading users
    }
  }, [backendBaseUrl]); // Dependency on backend URL

  // --- Load Events (Blockchain Interaction) ---
  const loadEvents = useCallback(
    async (betContract: any) => {
      console.log("Loading events...");
      try {
        const eventCountBigInt = await betContract.methods.nextEventId().call();
        const eventCount = Number(eventCountBigInt);
        console.log("Total event IDs (nextEventId):", eventCount);

        const eventPromises: Promise<any>[] = [];
        for (let eventId = 1; eventId < eventCount; eventId++) {
          // Assuming IDs start at 1
          eventPromises.push(
            (async () => {
              try {
                const [eventData, eventOptions] = await Promise.all([
                  betContract.methods.getEvent(eventId).call(),
                  betContract.methods.getEventOptions(eventId).call(),
                ]);
                // Optional: Fetch backend metadata (keep existing logic)
                let backendData = {};
                try {
                  const response = await fetch(
                    `${backendBaseUrl}/api/events/${eventId}`
                  );
                  if (response.ok) backendData = await response.json();
                  // else if (response.status !== 404) console.warn(...);
                } catch (apiError) {
                  /* console.warn(...) */
                }

                return {
                  ...backendData,
                  ...eventData,
                  options: eventOptions,
                  eventId: eventId,
                };
              } catch (error) {
                console.warn(`Skipping event ${eventId} due to error:`, error);
                return null;
              }
            })()
          );
        }

        const resolvedEvents = await Promise.all(eventPromises);
        const validEvents = resolvedEvents.filter((event) => event !== null);

        // Calculate stats
        const now = Date.now() / 1000;
        const ongoing = validEvents.filter(
          (e) => !e.isCompleted && Number(e.endTime) > now
        ).length;
        const total = validEvents.length;

        setEvents(validEvents);
        setOngoingEventsCount(ongoing);
        setTotalEventsCount(total);
        console.log(
          `Loaded ${validEvents.length} valid events. Ongoing: ${ongoing}`
        );
      } catch (err) {
        console.error("Error loading events list:", err);
        setError((prev) => prev || "Failed to load events list."); // Set general error
      }
    },
    [backendBaseUrl] // Dependency
  );

  // --- Fetch Blockchain Admin Details ---
  const fetchBlockchainAdminDetails = async (
    betContract: any,
    web3Instance: Web3
  ) => {
    try {
      const [adminAddr, profitWei] = await Promise.all([
        betContract.methods.admin().call(),
        betContract.methods.totalAdminProfit().call(),
      ]);
      const profitInEther = web3Instance.utils.fromWei(profitWei, "ether");
      setAdminAddress(adminAddr);
      setAdminProfit(profitInEther);
      console.log("Contract Admin Address:", adminAddr);
      console.log("Total Admin Profit:", profitInEther, "ETH");
    } catch (err) {
      console.error("Error fetching blockchain admin details:", err);
      setError(
        (prev) => prev || "Failed to fetch admin details from blockchain."
      );
    }
  };

  // --- Main Data Fetching Function ---
  const fetchData = useCallback(async () => {
    setLoadingBlockchain(true);
    setLoadingUsers(true); // Start both loadings
    setError(null);
    console.log("Initiating data fetch...");

    // --- Fetch User Count (runs concurrently with Web3 setup) ---
    fetchUserCount(); // Call the user fetch function

    // --- Initialize Web3 and Contract ---
    console.log("Initializing Web3 and Contract...");
    try {
      const { web3Instance, betContract } = await setupWeb3AndContract();
      setWeb3(web3Instance);
      setContract(betContract);
      console.log("Web3 and Contract setup complete.");

      if (betContract && web3Instance) {
        console.log("Fetching blockchain data (events, admin details)...");
        // Fetch blockchain related data
        await Promise.all([
          loadEvents(betContract),
          fetchBlockchainAdminDetails(betContract, web3Instance),
        ]);
        console.log("Blockchain data fetch complete.");
      } else {
        console.error("Failed to initialize contract or web3 instance.");
        setError((prev) => prev || "Failed to connect to blockchain services.");
      }
    } catch (err: any) {
      console.error("Initialization or Blockchain fetch failed:", err);
      setError((prev) => prev || `Initialization failed: ${err.message}`);
    } finally {
      setLoadingBlockchain(false); // Finish blockchain loading
      // loadingUsers is set within fetchUserCount
    }
  }, [fetchUserCount, loadEvents]); // Add dependencies

  // --- Initial Fetch on Mount ---
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Run once on mount

  // --- Refresh Handler ---
  const refreshAllData = useCallback(() => {
    console.log("Refreshing all data...");
    fetchData(); // Simply re-run the main fetch function
  }, [fetchData]);

  // --- Event Handlers ---
  const handleEventCreated = useCallback(() => {
    console.log("Event created handler triggered.");
    refreshAllData();
  }, [refreshAllData]);

  const handleWinnerDeclared = useCallback(() => {
    console.log("Winner declared handler triggered.");
    refreshAllData();
  }, [refreshAllData]);

  // --- Combined Loading State ---
  // Show loading skeleton if EITHER blockchain OR user data is initially loading
  const showInitialLoadingSkeleton =
    (loadingBlockchain || loadingUsers) && events.length === 0 && !error;

  // --- Render Logic ---

  // Initial Loading Skeleton
  if (showInitialLoadingSkeleton) {
    return (
      <div className="flex h-screen bg-muted/40">
        <Skeleton className="w-64 bg-background border-r h-full" />
        <main className="flex-1 p-6 md:p-8 space-y-6">
          <Skeleton className="h-8 w-1/4" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-28" /> <Skeleton className="h-28" />
            <Skeleton className="h-28" /> <Skeleton className="h-28" />
          </div>
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    );
  }

  // Error State UI
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen flex-col">
        <p className="text-red-600 text-xl mb-4">{error}</p>
        {/* Allow retry only if it wasn't a contract/web3 init failure maybe?
            Or just always allow retry */}
        <Button onClick={fetchData}>Retry Fetching Data</Button>
      </div>
    );
  }

  // Main Render with Layout
  // Determine the overall loading state for the dashboard cards ("Loading...") text
  const isDashboardLoading = loadingBlockchain || loadingUsers;

  return (
    <AdminLayout>
      {(activeSection) => (
        <>
          {activeSection === "dashboard" && (
            <Dashboard
              adminProfit={adminProfit}
              adminAddress={adminAddress}
              totalEvents={totalEventsCount}
              ongoingEvents={ongoingEventsCount}
              totalBetsPlaced={dashboardPlaceholders.totalBetsPlaced} // Still placeholder
              totalUsers={totalUsers} // Pass dynamic user count
              loading={isDashboardLoading} // Use combined loading for card text
            />
          )}
          {activeSection === "events" && contract && web3 && (
            <EventsPage
              events={events}
              contract={contract}
              web3={web3}
              onWinnerDeclared={handleWinnerDeclared}
              onEventCreated={handleEventCreated}
              // Consider passing a loading prop to EventsPage if needed
              // isLoading={loadingBlockchain}
            />
          )}
          {/* Add more sections here */}
        </>
      )}
    </AdminLayout>
  );
};

export default AdminPanel;
