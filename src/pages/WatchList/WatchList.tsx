import { useState, useEffect, useMemo, useContext } from "react";
import Web3 from "web3";
import FilterSidebar from "@/components/dropdownMenu/DropdownMenu";
import BettingCard from "@/components/BettingCard/BettingCard";
import { contractABI, contractAddress } from "@/config/contractConfig";
import { AppContext } from "@/context/AppContext";
import { useWatchlist } from "@/context/WatchlistContext";
import SearchAndFilterSection from "@/components/SearchAndFilterSection/SearchAndFilterSection";

// Interfaces
interface OptionOdds {
  optionName: string;
  oddsPercentage: number;
}

type EventOddsMap = {
  [eventId: string]: OptionOdds[] | null;
};

// --- Odds Calculation Logic (Helper function) ---
type CalculateOddsFunction = (
  betContract: any,
  eventId: string,
  options: string[]
) => Promise<OptionOdds[] | null>;

const calculateEventOdds: CalculateOddsFunction = async (
  betContract,
  eventId,
  options
) => {
  if (!options || options.length === 0) return null;
  try {
    const totalVolumeWei = await betContract.methods
      .getTotalBetsForEvent(eventId)
      .call();
    const totalVolume = BigInt(totalVolumeWei);

    if (totalVolume === 0n) {
      const equalPercentage = 100 / options.length;
      return options.map((option) => ({
        optionName: option,
        oddsPercentage: equalPercentage,
      }));
    }

    const oddsPromises = options.map(async (option) => {
      try {
        const optionBetsWei = await betContract.methods
          .getBetsForOption(eventId, option)
          .call();
        const optionVolume = BigInt(optionBetsWei);
        const percentage =
          totalVolume === 0n
            ? 0
            : Number((optionVolume * 10000n) / totalVolume) / 100;
        return { optionName: option, oddsPercentage: percentage };
      } catch (error) {
        console.error(
          `Error fetching odds for option ${option} in event ${eventId}:`,
          error
        );
        return { optionName: option, oddsPercentage: 0 };
      }
    });

    return await Promise.all(oddsPromises);
  } catch (error) {
    console.error(`Error calculating odds for event ${eventId}:`, error);
    return null;
  }
};

// --- Watchlist Page Component ---
export default function WatchListPage() {
  // Filter items
  const filterItems = [
    {
      title: "Categories",
      items: [
        { name: "Politics", count: 21 },
        { name: "Sports", count: 32 },
        { name: "Games", count: 12 },
      ],
    },
    {
      title: "Locations",
      items: [
        { name: "USA", count: 12 },
        { name: "Sri Lanka", count: 34 },
        { name: "India", count: 8 },
        { name: "Australia", count: 15 },
      ],
    },
    {
      title: "Date Range",
      items: [
        { name: "Today", count: 9 },
        { name: "This Weekend", count: 14 },
        { name: "Next Week", count: 8 },
        { name: "Next 3 Months", count: 45 },
      ],
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");

  // Get AppContext
  const appContext = useContext(AppContext);
  if (!appContext)
    throw new Error("WatchListPage must be used within AppContextProvider");
  const { isLoggedin } = appContext;

  // Get Watchlist Data from WatchlistContext
  const {
    watchlistEvents,
    isLoading: isWatchlistLoading,
    error: watchlistError,
    refreshWatchlist,
  } = useWatchlist();

  // State for Web3 and dynamic odds
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [betContract, setBetContract] = useState<any>(null);
  // const [eventOdds, setEventOdds] = useState<EventOddsMap>({});
  const [, setEventOdds] = useState<EventOddsMap>({});
  const [isOddsLoading, setIsOddsLoading] = useState<boolean>(false);

  // Initialize Web3
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          try {
            const contract = new web3Instance.eth.Contract(
              contractABI,
              contractAddress
            );
            setBetContract(contract);
          } catch (contractError) {
            console.error("Error creating contract instance:", contractError);
          }
        } else {
          console.log("No Ethereum browser extension detected");
        }
      } catch (error) {
        console.error("Web3 initialization error:", error);
      }
    };
    initWeb3();
  }, []);

  // Refresh watchlist when login state changes
  useEffect(() => {
    if (isLoggedin) {
      refreshWatchlist();
    }
  }, [isLoggedin]); // <--- Reverted to original dependency array

  // Fetch Odds for watchlist events
  useEffect(() => {
    const fetchAllOdds = async () => {
      if (!betContract || watchlistEvents.length === 0) {
        setEventOdds({});
        return;
      }

      setIsOddsLoading(true);
      console.log(`Fetching odds for ${watchlistEvents.length} events...`);

      const oddsPromises = watchlistEvents.map(
        (event) =>
          calculateEventOdds(
            betContract,
            String(event.eventId),
            event.options
          ).then((odds) => ({ eventId: String(event.eventId), odds }))
        // .catch((err) => ({ eventId: String(event.eventId), odds: null }))
      );

      try {
        const oddsResults = await Promise.all(oddsPromises);
        const newOddsMap = oddsResults.reduce<EventOddsMap>((acc, result) => {
          if (result) acc[result.eventId] = result.odds;
          return acc;
        }, {});
        setEventOdds(newOddsMap);
      } catch (error) {
        console.error("Error fetching all odds:", error);
      } finally {
        setIsOddsLoading(false);
      }
    };
    fetchAllOdds();
  }, [watchlistEvents, betContract]);

  // Filter events based on search query
  const filteredEvents = useMemo(() => {
    return watchlistEvents.filter((event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [watchlistEvents, searchQuery]);

  // Render content based on loading and error states
  const renderContent = () => {
    if (!isLoggedin) {
      return (
        <div className="text-center py-12 sm:py-16">
          <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">🔒</div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
            Login Required
          </h3>
          <p className="text-gray-400 text-sm sm:text-base">
            Please log in to view your watchlist
          </p>
        </div>
      );
    }
    if (isWatchlistLoading && !watchlistError) {
      return (
        <div className="text-center py-12 sm:py-16">
          <div className="inline-flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-orange-500 border-t-transparent"></div>
            <p className="text-gray-400 text-sm sm:text-base">
              Loading watchlist...
            </p>
          </div>
        </div>
      );
    }
    if (watchlistError) {
      return (
        <div className="text-center py-12 sm:py-16">
          <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">❌</div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
            Error Loading Watchlist
          </h3>
          <p className="text-red-500 text-sm sm:text-base">{watchlistError}</p>
        </div>
      );
    }
    if (filteredEvents.length === 0) {
      if (searchQuery) {
        return (
          <div className="text-center py-12 sm:py-16">
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
              No Results Found
            </h3>
            <p className="text-gray-400 text-sm sm:text-base">
              No watchlist events match your search.
            </p>
          </div>
        );
      }
      return (
        <div className="text-center py-12 sm:py-16">
          <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">⭐</div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
            Empty Watchlist
          </h3>
          <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto">
            Your watchlist is empty. Add events using the star icon!
          </p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
        {filteredEvents.map((event) => (
          <BettingCard
            key={event.eventId}
            event={{
              eventId: String(event.eventId),
              name: event.name,
              imageURL: event.imageURL,
              options: event.options,
              endTime: event.endTime,
              startTime: event.startTime,
              description: event.description,
              prizePool: "0",
            }}
            web3={web3}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1C1C27] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] py-6 sm:py-8">
      {/* Header Section - Mobile Responsive */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center sm:text-left">
          Watch List
        </h1>
      </div>

      {/* Main Content Grid - Mobile Responsive */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-[240px,1fr]">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block space-y-6 text-[#ffffff]">
          {filterItems.map((filter, index) => (
            <FilterSidebar
              key={index}
              title={filter.title}
              items={filter.items}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Mobile Filters Section */}
          <div className="md:hidden bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-lg p-4 shadow-xl border border-[#333447]">
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Filters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {filterItems.map((filter, index) => (
                <FilterSidebar
                  key={index}
                  title={filter.title}
                  items={filter.items}
                />
              ))}
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-lg p-4 sm:p-6 shadow-xl border border-[#333447]">
            <SearchAndFilterSection
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Content Section */}
          <div className="bg-gradient-to-br from-[#252538] to-[#2A2A3E] rounded-lg shadow-xl border border-[#333447] overflow-hidden">
            {/* Loading indicator for odds */}
            {isOddsLoading && (
              <div className="text-center py-4 border-b border-[#333447]">
                <div className="inline-flex items-center gap-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
                  <p className="text-gray-400 text-sm">Loading odds...</p>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="p-4 sm:p-6">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
