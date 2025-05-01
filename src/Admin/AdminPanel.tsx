// StakeWise-Frontend/src/Admin/shared/AdminPanel.tsx
import React, { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import axios from "axios";
import { AdminLayout } from "@/Admin/layout/AdminLayout"; // Updated path to match project structure
import { Dashboard } from "@/Admin/dashboard/Dashboard"; // Updated to use the correct alias path
import { EventsPage } from "@/Admin/events/EventsPage"; // Updated path to match project structure
import UserManagementPage from "@/Admin/users/UserManagementPage"; // Updated to use the correct alias path
import setupWeb3AndContract from "@/services/blockchainService";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RecentBet } from "@/Admin/dashboard/RecentBetsTable"; // Corrected path, Import the RecentBet type
import { toast } from "sonner"; // Assuming you use sonner for notifications
import AdminProfilePage from "@/Admin/profile/AdminProfilePage";

// Define the expected structure for user count API response
// Using the one from adminService for consistency if possible, otherwise define here
interface AdminUserCountApiResponse {
  // Assuming the backend route /api/admin/user-count returns this structure directly
  // Adjust if the actual structure differs (e.g., nested under 'data')
  count: number;
  // Or if it matches the structure you initially had:
  // success?: boolean;
  // data?: { totalUsers: number };
  // message?: string;
}

// --- Define structure for raw event data ---
interface BetPlacedEventLog {
  returnValues: {
    eventId: string | bigint; // Can be string or bigint depending on web3 version
    bettor: string;
    amount: string | bigint; // Wei value
    option: string; // Assuming option is a string, adjust if it's numeric index
  };
  blockNumber: number;
  transactionHash: string;
  // other event properties...
}

const AdminPanel: React.FC = () => {
  // Added React.FC type
  // --- Web3 & Contract State ---
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null); // Consider defining a Contract type if using TypeChain or similar
  const [adminProfit, setAdminProfit] = useState<string>("0");
  const [adminAddress, setAdminAddress] = useState<string>("");

  // --- Events State ---
  const [events, setEvents] = useState<any[]>([]); // Consider a specific Event type
  const [totalEventsCount, setTotalEventsCount] = useState<number>(0);
  const [ongoingEventsCount, setOngoingEventsCount] = useState<number>(0);

  // --- User Count State ---
  const [totalUsers, setTotalUsers] = useState<number>(0);

  // --- Bets Placed State ---
  const [totalBetsPlacedValue, setTotalBetsPlacedValue] = useState<string>("0");

  // --- Recent Bets State ---
  const [recentBets, setRecentBets] = useState<RecentBet[]>([]);
  const [loadingRecentBets, setLoadingRecentBets] = useState<boolean>(true);

  // --- General Loading & Error State ---
  const [loadingBlockchain, setLoadingBlockchain] = useState<boolean>(true);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true); // Specific loading for user count fetch
  const [error, setError] = useState<string | null>(null);

  // --- Backend URL ---
  const backendBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"; // Use VITE_API_BASE_URL and append /api
  console.log("Using Backend API URL:", backendBaseUrl);

  // --- Fetch User Count ---
  const fetchUserCount = useCallback(async () => {
    setLoadingUsers(true);
    console.log("Fetching user count...");
    try {
      // Use the adminService function if available, otherwise keep direct axios call
      // Example using direct axios (ensure cookies/auth are handled):
      axios.defaults.withCredentials = true; // Or handle token via headers
      const response = await axios.get<AdminUserCountApiResponse>(
        `${backendBaseUrl}/admin/user-count` // Ensure this endpoint matches your backend routes
        // Add Authorization header if using token-based auth
        // headers: { 'Authorization': `Bearer ${your_token}` }
      );

      // Adjust based on the actual response structure from /api/admin/user-count
      // If it directly returns { count: number }
      if (typeof response.data.count === "number") {
        setTotalUsers(response.data.count);
        console.log("User count fetched:", response.data.count);
      }
      // If it matches the old structure { success: boolean, data: { totalUsers: number } }
      // else if (response.data && response.data.success && response.data.data) {
      //     setTotalUsers(response.data.data.totalUsers);
      //     console.log("User count fetched:", response.data.data.totalUsers);
      // }
      else {
        console.error(
          "Failed to fetch user count: Invalid response format",
          response.data
        );
        const message =
          (response.data as any)?.message || "Invalid response format";
        setError((prev) => prev || `Failed to fetch user count: ${message}`);
        toast.error(`Failed to fetch user count: ${message}`);
      }
    } catch (err: any) {
      console.error("Error fetching user count via API:", err);
      const message =
        err.response?.data?.message || err.message || "Server error";
      setError((prev) => prev || `API Error fetching users: ${message}`);
      toast.error(`API Error fetching users: ${message}`);
    } finally {
      setLoadingUsers(false);
    }
  }, [backendBaseUrl]);

  // --- Load Events List --- (Assumed correct from previous state)
  const loadEvents = useCallback(
    async (betContract: any) => {
      console.log("Loading events list...");
      try {
        const eventIdArray: bigint[] = await betContract.methods
          .getAllEventIds()
          .call();
        console.log("Fetched Event IDs:", eventIdArray.map(String));

        if (!eventIdArray || eventIdArray.length === 0) {
          console.log("No event IDs found on the contract.");
          setEvents([]);
          setOngoingEventsCount(0);
          setTotalEventsCount(0);
          return;
        }

        const eventPromises: Promise<any>[] = [];
        for (const eventIdBigInt of eventIdArray) {
          const eventId = Number(eventIdBigInt);
          if (isNaN(eventId) || eventId === 0) {
            console.warn(`Skipping invalid event ID: ${eventIdBigInt}`);
            continue;
          }
          eventPromises.push(
            (async () => {
              try {
                const [eventData, eventOptions] = await Promise.all([
                  betContract.methods.getEvent(eventId).call(),
                  betContract.methods.getEventOptions(eventId).call(),
                ]);
                let backendData = {};
                try {
                  // Fetch associated backend data for the event
                  const response = await axios.get(
                    `${backendBaseUrl}/events/${eventId}`
                  );
                  if (response.status === 200 && response.data) {
                    backendData = response.data; // Assuming response.data is the event object
                  }
                } catch (apiError: any) {
                  if (apiError.response?.status !== 404) {
                    // Ignore 404s (event might only be on-chain)
                    console.warn(
                      `API error fetching details for event ${eventId}:`,
                      apiError.message
                    );
                  }
                }

                return {
                  ...backendData, // Include backend fields like title, description etc.
                  // Ensure blockchain data overwrites if names clash and chain is source of truth for these fields
                  ...eventData, // Contains on-chain data like endTime, isCompleted, etc.
                  options: eventOptions, // Array of options from the contract
                  eventId: eventId, // Ensure eventId is consistently set
                };
              } catch (error: any) {
                if (
                  error.message &&
                  error.message.includes("Event does not exist")
                ) {
                  console.warn(
                    `Event ID ${eventId} exists in array but returned 'Event does not exist' from contract. Skipping.`
                  );
                } else {
                  console.error(
                    `Error fetching contract details for event ${eventId}:`,
                    error
                  );
                }
                return null; // Skip this event if contract call fails
              }
            })()
          );
        }

        const resolvedEvents = await Promise.all(eventPromises);
        const validEvents = resolvedEvents.filter(
          (event): event is any =>
            event !== null && event.eventId !== 0 && event.endTime // Basic validation
        );

        const now = Date.now() / 1000; // Current time in seconds
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
        setError((prev) => prev || "Failed to load events list.");
        toast.error("Failed to load events list from contract.");
      }
    },
    [backendBaseUrl] // Dependency on backendBaseUrl for fetching associated data
  );

  // --- Fetch Recent Bets --- (Assumed correct from previous state)
  const fetchRecentBets = useCallback(
    async (betContract: any, web3Instance: Web3) => {
      if (!betContract || !web3Instance) return;
      console.log("Fetching recent bets...");
      setLoadingRecentBets(true);
      try {
        const fromBlock = 0; // Consider using contract deployment block or a recent block
        const limit = 20;

        const pastEvents: BetPlacedEventLog[] = await betContract.getPastEvents(
          "BetPlaced",
          {
            fromBlock: fromBlock,
            toBlock: "latest",
          }
        );

        console.log(`Fetched ${pastEvents.length} BetPlaced events.`);

        const betsWithTimestampsPromises = pastEvents.map(async (eventLog) => {
          try {
            // Fetch block only if timestamp is needed (can be slow)
            const block = await web3Instance.eth.getBlock(eventLog.blockNumber);
            const timestamp =
              typeof block.timestamp === "string"
                ? parseInt(block.timestamp, 10)
                : Number(block.timestamp); // Handle both string and number timestamps

            return {
              transactionHash: eventLog.transactionHash,
              eventId: String(eventLog.returnValues.eventId),
              bettor: eventLog.returnValues.bettor,
              amount: web3Instance.utils.fromWei(
                eventLog.returnValues.amount,
                "ether"
              ),
              option: eventLog.returnValues.option,
              timestamp: timestamp || Math.floor(Date.now() / 1000), // Fallback timestamp
              blockNumber: Number(eventLog.blockNumber), // Ensure number type
            };
          } catch (blockError) {
            console.error(
              `Error fetching block ${eventLog.blockNumber} for timestamp:`,
              blockError
            );
            // Fallback without timestamp if block fetch fails
            return {
              transactionHash: eventLog.transactionHash,
              eventId: String(eventLog.returnValues.eventId),
              bettor: eventLog.returnValues.bettor,
              amount: web3Instance.utils.fromWei(
                eventLog.returnValues.amount,
                "ether"
              ),
              option: eventLog.returnValues.option,
              timestamp: Math.floor(Date.now() / 1000), // Use current time as fallback
              blockNumber: Number(eventLog.blockNumber),
            };
          }
        });

        const resolvedBets = await Promise.all(betsWithTimestampsPromises);
        const validBets = resolvedBets.filter(
          (bet) => bet !== null
        ) as RecentBet[];

        validBets.sort((a, b) => b.timestamp - a.timestamp); // Sort newest first
        setRecentBets(validBets.slice(0, limit)); // Limit to 'limit'
        console.log(
          `Processed and limited to ${
            validBets.slice(0, limit).length
          } recent bets.`
        );
      } catch (err) {
        console.error("Error fetching recent bets:", err);
        setError((prev) => prev || "Failed to fetch recent bets.");
        toast.error("Failed to fetch recent betting activity.");
      } finally {
        setLoadingRecentBets(false);
      }
    },
    [] // Dependencies are passed as arguments
  );

  // --- Main Data Fetching Function --- (Combined fetch)
  const fetchData = useCallback(async () => {
    setLoadingBlockchain(true);
    setLoadingUsers(true); // Reset loading state for user count
    setLoadingRecentBets(true); // Reset loading state for bets
    setError(null);
    console.log("Initiating data fetch...");

    // Start user count fetch immediately (non-blocking)
    fetchUserCount();

    // Initialize Web3 and Contract
    console.log("Initializing Web3 and Contract...");
    try {
      const { web3Instance, betContract } = await setupWeb3AndContract();
      setWeb3(web3Instance);
      setContract(betContract);
      console.log("Web3 and Contract setup complete.");

      if (betContract && web3Instance) {
        console.log("Fetching blockchain data...");

        // Fetch core stats, events, and recent bets concurrently
        await Promise.all([
          // Fetch Stats
          (async () => {
            try {
              const [adminProfitWei, adminAddr, totalBetsWei] =
                await Promise.all([
                  betContract.methods.totalAdminProfit().call(),
                  betContract.methods.admin().call(),
                  betContract.methods.getTotalBetsPlaced().call(),
                ]);
              const adminProfitEth = web3Instance.utils.fromWei(
                adminProfitWei,
                "ether"
              );
              const totalBetsEth = web3Instance.utils.fromWei(
                totalBetsWei,
                "ether"
              );
              setAdminProfit(adminProfitEth);
              setAdminAddress(adminAddr);
              setTotalBetsPlacedValue(totalBetsEth);
              console.log("Admin Profit:", adminProfitEth, "ETH");
              console.log("Admin Address:", adminAddr);
              console.log("Total Bets Value:", totalBetsEth, "ETH");
            } catch (statsError) {
              console.error("Error fetching core contract stats:", statsError);
              setError((prev) => prev || "Failed to fetch contract stats.");
              toast.error("Failed to fetch core contract statistics.");
            }
          })(),
          // Fetch Events
          loadEvents(betContract),
          // Fetch Recent Bets
          fetchRecentBets(betContract, web3Instance),
        ]);

        console.log("Blockchain data fetch complete.");
      } else {
        console.error("Failed to initialize contract or web3 instance.");
        setError((prev) => prev || "Failed to connect to blockchain services.");
        toast.error("Failed to initialize Web3 or Smart Contract connection.");
      }
    } catch (err: any) {
      console.error("Initialization or Blockchain fetch failed:", err);
      setError((prev) => prev || `Initialization failed: ${err.message}`);
      toast.error(`Initialization failed: ${err.message}`);
    } finally {
      // Loading states for users and bets are handled in their respective functions
      setLoadingBlockchain(false); // Mark blockchain part as done
    }
  }, [fetchUserCount, loadEvents, fetchRecentBets]); // Dependencies

  // --- Initial Fetch on Mount ---
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Run once on mount

  // --- Refresh Handler ---
  const refreshAllData = useCallback(() => {
    console.log("Refreshing all data...");
    fetchData(); // Re-run the main data fetching function
  }, [fetchData]);

  // --- Event Handlers --- (Assumed correct)
  const handleEventCreated = useCallback(() => {
    console.log("Event created handler triggered. Refreshing data.");
    toast.info("New event detected, refreshing data...");
    refreshAllData();
  }, [refreshAllData]);

  const handleWinnerDeclared = useCallback(() => {
    console.log("Winner declared handler triggered. Refreshing data.");
    toast.info("Event winner declared, refreshing data...");
    refreshAllData();
  }, [refreshAllData]);

  // --- Add listeners for contract events if needed (e.g., for real-time updates) ---
  /*
  useEffect(() => {
      if (!contract) return;
      const eventCreatedSub = contract.events.EventCreated({}, handleEventCreated);
      const winnerDeclaredSub = contract.events.WinnerDeclared({}, handleWinnerDeclared);
      // Add BetPlaced listener if desired for real-time bets table update
      // const betPlacedSub = contract.events.BetPlaced({}, () => fetchRecentBets(contract, web3));

      return () => {
          eventCreatedSub.unsubscribe();
          winnerDeclaredSub.unsubscribe();
          // betPlacedSub.unsubscribe();
      };
  }, [contract, web3, handleEventCreated, handleWinnerDeclared, fetchRecentBets]); // Add web3 and fetchRecentBets if BetPlaced is used
  */

  // --- Combined Loading State for initial page load ---
  const showInitialLoadingSkeleton =
    (loadingBlockchain || loadingUsers || loadingRecentBets) && // Check all relevant loading states
    !contract && // Only show full skeleton if contract isn't loaded yet
    !error; // Don't show if there's an error

  // --- Render Logic ---

  // Initial Loading Skeleton
  if (showInitialLoadingSkeleton) {
    return (
      <div className="flex h-screen bg-muted/40 dark:bg-primary">
        {" "}
        {/* Added dark mode bg */}
        {/* Sidebar Skeleton */}
        <Skeleton className="w-64 bg-card border-r border-gray-700/60 h-full" />
        {/* Main Content Skeleton */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-auto">
          {/* Header Skeleton */}
          <Skeleton className="h-8 w-1/3 mb-6 bg-gray-700/50" />
          {/* Dashboard Cards Skeleton */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-32 rounded-lg bg-gray-700/50" />
            <Skeleton className="h-32 rounded-lg bg-gray-700/50" />
            <Skeleton className="h-32 rounded-lg bg-gray-700/50" />
            <Skeleton className="h-32 rounded-lg bg-gray-700/50" />
          </div>
          {/* Recent Bets Table Skeleton */}
          <Skeleton className="h-8 w-1/4 mt-8 mb-4 bg-gray-700/50" />
          <Skeleton className="h-64 w-full rounded-lg bg-gray-700/50" />
        </main>
      </div>
    );
  }

  // Error State UI
  if (error && !contract) {
    // Show full page error only if core loading failed
    return (
      <div className="flex items-center justify-center h-screen flex-col bg-primary text-red-400 p-4">
        <h2 className="text-2xl font-semibold mb-4">
          Error Loading Admin Panel
        </h2>
        <p className="text-center mb-6">{error}</p>
        <Button variant="destructive" onClick={refreshAllData}>
          Retry Fetching Data
        </Button>
      </div>
    );
  }

  // --- Function to render the active section based on Sidebar selection ---
  const renderSection = (activeSection: string) => {
    switch (activeSection) {
      case "dashboard":
        // Dashboard needs web3 instance for potential ETH conversions in children
        // Pass all necessary props down. Loading states are combined.
        return web3 ? (
          <Dashboard
            adminProfit={adminProfit}
            adminAddress={adminAddress}
            totalEvents={totalEventsCount}
            ongoingEvents={ongoingEventsCount}
            totalBetsPlaced={totalBetsPlacedValue}
            totalUsers={totalUsers}
            loading={loadingBlockchain || loadingUsers} // Loading for top cards
            recentBets={recentBets}
            loadingRecentBets={loadingRecentBets} // Specific loading for bets table
            web3Instance={web3}
          />
        ) : (
          // Show skeleton or loading specific to dashboard area if web3 not ready
          <div className="p-6">Loading Dashboard Data...</div>
        );

      case "events":
        // EventsPage needs contract and web3
        return contract && web3 ? (
          <EventsPage
            events={events}
            contract={contract}
            web3={web3}
            onWinnerDeclared={handleWinnerDeclared}
            onEventCreated={handleEventCreated}
            // Pass loading state if EventsPage needs it
            isLoading={loadingBlockchain && events.length === 0} // Example loading prop
          />
        ) : (
          <div className="p-6">Loading Events Data...</div>
        );

      case "users":
        // UserManagementPage fetches its own data, needs no props from here
        return <UserManagementPage />;

      case "profile": // <-- Add this case
        // AdminProfilePage fetches its own data
        return <AdminProfilePage />;

      default:
        // Default to dashboard, same logic as 'dashboard' case
        return web3 ? (
          <Dashboard
            adminProfit={adminProfit}
            adminAddress={adminAddress}
            totalEvents={totalEventsCount}
            ongoingEvents={ongoingEventsCount}
            totalBetsPlaced={totalBetsPlacedValue}
            totalUsers={totalUsers}
            loading={loadingBlockchain || loadingUsers}
            recentBets={recentBets}
            loadingRecentBets={loadingRecentBets}
            web3Instance={web3}
          />
        ) : (
          <div className="p-6">Loading Dashboard...</div>
        );
    }
  };

  // --- Main Render with Layout ---
  return (
    <AdminLayout>
      {(activeSection: string) => renderSection(activeSection)}
    </AdminLayout>
  );
};

export default AdminPanel;
