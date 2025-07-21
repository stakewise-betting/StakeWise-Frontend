import { useState, useEffect, useMemo, useContext } from "react";
import Web3 from "web3";
import FilterSidebar from "@/components/DropdownMenu/DropdownMenu";
import BettingCard from "@/components/BettingCard/BettingCard";
import { contractABI, contractAddress } from "@/config/contractConfig";
import { AppContext } from "@/context/AppContext";
import { useWatchlist } from '@/context/WatchlistContext';
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

const calculateEventOdds: CalculateOddsFunction = async (betContract, eventId, options) => {
  if (!options || options.length === 0) return null;
  try {
    const totalVolumeWei = await betContract.methods.getTotalBetsForEvent(eventId).call();
    const totalVolume = BigInt(totalVolumeWei);

    if (totalVolume === 0n) {
      const equalPercentage = 100 / options.length;
      return options.map((option) => ({ optionName: option, oddsPercentage: equalPercentage }));
    }

    const oddsPromises = options.map(async (option) => {
      try {
        const optionBetsWei = await betContract.methods.getBetsForOption(eventId, option).call();
        const optionVolume = BigInt(optionBetsWei);
        const percentage = totalVolume === 0n ? 0 : Number((optionVolume * 10000n) / totalVolume) / 100;
        return { optionName: option, oddsPercentage: percentage };
      } catch (error) {
        console.error(`Error fetching odds for option ${option} in event ${eventId}:`, error);
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
    { title: "Categories", items: [
      { name: "Politics", count: 21 },
      { name: "Sports", count: 32 },
      { name: "Games", count: 12 },
    ] },
    { title: "Locations", items: [
      { name: "USA", count: 12 },
      { name: "Sri Lanka", count: 34 },
      { name: "India", count: 8 },
      { name: "Australia", count: 15 },
    ] },
    { title: "Date Range", items: [
      { name: "Today", count: 9 },
      { name: "This Weekend", count: 14 },
      { name: "Next Week", count: 8 },
      { name: "Next 3 Months", count: 45 },
    ] },
  ];

  const [searchQuery, setSearchQuery] = useState("");

  // Get AppContext
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("WatchListPage must be used within AppContextProvider");
  const { isLoggedin } = appContext;

  // Get Watchlist Data from WatchlistContext
  const {
    watchlistEvents,
    isLoading: isWatchlistLoading,
    error: watchlistError,
    refreshWatchlist
  } = useWatchlist();

  // State for Web3 and dynamic odds
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [betContract, setBetContract] = useState<any>(null);
  const [eventOdds, setEventOdds] = useState<EventOddsMap>({});
  const [isOddsLoading, setIsOddsLoading] = useState<boolean>(false);

  // Initialize Web3
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          try {
            const contract = new web3Instance.eth.Contract(contractABI, contractAddress);
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

      const oddsPromises = watchlistEvents.map(event =>
        calculateEventOdds(betContract, String(event.eventId), event.options)
          .then(odds => ({ eventId: String(event.eventId), odds }))
          .catch(err => ({ eventId: String(event.eventId), odds: null }))
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
    return watchlistEvents.filter(event =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [watchlistEvents, searchQuery]);

  // Render content based on loading and error states
  const renderContent = () => {
    if (!isLoggedin) {
      return <p className="text-gray-400 text-center mt-10">Please log in to view your watchlist</p>;
    }
    if (isWatchlistLoading && !watchlistError) {
      return <p className="text-gray-400 text-center mt-10">Loading watchlist...</p>;
    }
    if (watchlistError) {
      return <p className="text-red-500 text-center mt-10">Error: {watchlistError}</p>;
    }
    if (filteredEvents.length === 0) {
      if (searchQuery) {
        return <p className="text-gray-400 text-center mt-10">No watchlist events match your search.</p>;
      }
      return <p className="text-gray-400 text-center mt-10">Your watchlist is empty. Add events using the star icon!</p>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
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
              prizePool: "0"
            }}
            web3={web3}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1C1C27] px-[100px] py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Watch List</h1>
      <div className="grid gap-6 md:grid-cols-[240px,1fr]">
        <div className="space-y-6 text-[#ffffff]">
          {filterItems.map((filter, index) => (
            <FilterSidebar key={index} title={filter.title} items={filter.items} />
          ))}
        </div>
        <div className="space-y-6">
          {/* Use the new SearchAndFilterSection component */}
          <SearchAndFilterSection
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-1 px-0 sm:px-0 md:px-0 lg:px-0 w-full">
            {isOddsLoading && <p className="text-gray-400 text-center mt-4">Loading odds...</p>}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}