import { useEffect, useState, useCallback } from "react";
import Web3 from "web3";
import axios from "axios";
import { toast } from "react-toastify";

import BettingCard from "@/components/BettingCard/BettingCard";
import { contractABI, contractAddress } from "@/config/contractConfig";
import { FilterBar } from "@/components/NewSerachBar/FilterBar";
import AutoSlider from "@/components/AutomaticSlider/AutomaticSlider";
import { Button } from "@/components/ui/button";

// Define TypeScript interfaces
interface EventData {
  eventId: string;
  name: string;
  imageURL: string;
  options: string[];
  endTime: string;
  startTime: string;
  createdAt: string;
  description?: string;
  prizePool: string;
  category?: string;
}

interface OptionOdds {
  optionName: string;
  oddsPercentage: number;
}

type EventOddsMap = {
  [eventId: string]: OptionOdds[] | null;
};

const slides = [
  { src: "/sliderImages/slider-img (1).jpg", alt: "Slider Image 1" },
  { src: "/sliderImages/slider-img (2).jpg", alt: "Slider Image 2" },
  { src: "/sliderImages/slider-img (3).jpg", alt: "Slider Image 3" },
  { src: "/sliderImages/slider-img (4).jpg", alt: "Slider Image 4" },
];

const Home = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [eventOdds, setEventOdds] = useState<EventOddsMap>({});
  const [isBlockchainLoading, setIsBlockchainLoading] = useState(true);
  const [isFilterApiLoading, setIsFilterApiLoading] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [currentDisplayableEvents, setCurrentDisplayableEvents] = useState<
    EventData[]
  >([]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isNewFilterActive, setIsNewFilterActive] = useState<boolean>(false);

  // Function to calculate odds
  const calculateEventOdds = useCallback(
    async (
      betContract: any,
      eventId: string,
      options: string[]
    ): Promise<OptionOdds[] | null> => {
      try {
        const oddsArray: OptionOdds[] = [];
        const totalBets = await betContract.methods
          .getTotalBetsForEvent(eventId)
          .call();
        if (parseInt(totalBets) === 0) {
          return options.map((option) => ({
            optionName: option,
            oddsPercentage: parseFloat((100 / options.length).toFixed(2)),
          }));
        }
        for (const option of options) {
          const optionBets = await betContract.methods
            .getBetsForOption(eventId, option)
            .call();
          const percentage = (parseInt(optionBets) / parseInt(totalBets)) * 100;
          oddsArray.push({
            optionName: option,
            oddsPercentage: parseFloat(percentage.toFixed(2)),
          });
        }
        return oddsArray;
      } catch (error) {
        console.error(`Error calculating odds for event ${eventId}:`, error);
        return options.map((option) => ({
          optionName: option,
          oddsPercentage: 0,
        }));
      }
    },
    []
  );

  // Effect for initializing Web3 and loading events from blockchain
  useEffect(() => {
    const init = async () => {
      if ((window as any).ethereum) {
        try {
          setIsBlockchainLoading(true);
          const web3Instance = new Web3((window as any).ethereum);
          setWeb3(web3Instance);
          const betContract = new web3Instance.eth.Contract(
            contractABI,
            contractAddress
          );

          const eventCountBigInt = await betContract.methods
            .nextEventId()
            .call();
          const eventCount = Number(eventCountBigInt);
          const fetchedEvents: EventData[] = [];
          const fetchedOddsMap: EventOddsMap = {};
          const currentTime = Math.floor(Date.now() / 1000);

          for (let i = 1; i < eventCount; i++) {
            try {
              const eventDataRaw = (await betContract.methods
                .getEvent(i)
                .call()) as any;
              const formattedEvent: EventData = {
                eventId: i.toString(),
                name: eventDataRaw.name || `Event ${i}`,
                imageURL: eventDataRaw.imageURL || "/placeholder.svg",
                options: eventDataRaw.options || [],
                startTime: eventDataRaw.startTime.toString(),
                endTime: eventDataRaw.endTime.toString(),
                createdAt: eventDataRaw.createdAt?.toString() || "0",
                prizePool: eventDataRaw.prizePool.toString(),
              };

              if (Number(formattedEvent.startTime) <= currentTime) {
                fetchedEvents.push(formattedEvent);
                const oddsData = await calculateEventOdds(
                  betContract,
                  formattedEvent.eventId,
                  formattedEvent.options
                );
                if (oddsData) {
                  fetchedOddsMap[formattedEvent.eventId] = oddsData;
                }
              }
            } catch (eventError) {
              console.error(`Error fetching event ${i}:`, eventError);
            }
          }

          fetchedEvents.sort(
            (a, b) => Number(b.startTime) - Number(a.startTime)
          );
          setEvents(fetchedEvents);
          setEventOdds(fetchedOddsMap);
        } catch (error) {
          console.error("Error initializing blockchain/loading events:", error);
          toast.error("Failed to load event data from blockchain.");
        } finally {
          setIsBlockchainLoading(false);
        }
      } else {
        console.error("Ethereum provider not found. Please install MetaMask.");
        toast.warn("MetaMask not found. Event loading may be affected.");
        setIsBlockchainLoading(false);
      }
    };
    init();
  }, [calculateEventOdds]);

  // Effect for filtering events based on backend search and local blockchain data
  useEffect(() => {
    if (isBlockchainLoading) {
      return;
    }

    const filtersActive =
      searchTerm || selectedCategories.length > 0 || isNewFilterActive;

    const applyFiltersAndDisplay = async () => {
      if (!filtersActive && !isBlockchainLoading) {
        setCurrentDisplayableEvents(
          showAllEvents ? events : events.slice(0, 16)
        );
        return;
      }

      if (filtersActive && isBlockchainLoading) {
        return;
      }

      if (filtersActive && (!isBlockchainLoading || events.length === 0)) {
        setIsFilterApiLoading(true);
        try {
          const params = new URLSearchParams();
          if (searchTerm) params.append("searchTerm", searchTerm);
          selectedCategories.forEach((cat) => params.append("categories", cat));
          if (isNewFilterActive) params.append("isNew", "true");

          const apiUrl = `/api/events/search?${params.toString()}`;
          console.log("[FRONTEND HomePage] Calling API:", apiUrl);

          const response = await axios.get(apiUrl);

          console.log("[FRONTEND HomePage] Raw API Response object:", response);
          console.log(
            "[FRONTEND HomePage] API Response data (response.data):",
            response.data
          );
          console.log(
            "[FRONTEND HomePage] Type of response.data:",
            typeof response.data,
            "Is Array:",
            Array.isArray(response.data)
          );

          if (!Array.isArray(response.data)) {
            console.error(
              "[FRONTEND HomePage] Error: response.data is not an array! Received:",
              response.data
            );
            toast.error(
              "Received unexpected data format from server for filters."
            );
            setCurrentDisplayableEvents([]);
            setIsFilterApiLoading(false);
            return;
          }

          const backendMatchedEvents: { eventId: string }[] = response.data.map(
            (event: any) => ({
              ...event,
              eventId: event.eventId.toString(),
            })
          );
          const backendFilteredEventIds = backendMatchedEvents.map(
            (e) => e.eventId
          );

          const newFilteredDisplayEvents = events.filter((bcEvent) =>
            backendFilteredEventIds.includes(bcEvent.eventId)
          );
          setCurrentDisplayableEvents(newFilteredDisplayEvents);
        } catch (error: any) {
          console.error("Error fetching or applying filtered events:", error);
          if (error.response) {
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
          } else if (error.request) {
            console.error("Error request:", error.request);
          } else {
            console.error("Error message:", error.message);
          }
          setCurrentDisplayableEvents([]);
          toast.error("Could not apply filters. Please try again.");
        } finally {
          setIsFilterApiLoading(false);
        }
      }
    };

    applyFiltersAndDisplay();
  }, [
    events,
    searchTerm,
    selectedCategories,
    isNewFilterActive,
    showAllEvents,
    isBlockchainLoading,
  ]);

  const handleFilterChange = useCallback(
    (filters: {
      searchTerm: string;
      selectedCategories: string[];
      isNew: boolean;
    }) => {
      setSearchTerm(filters.searchTerm);
      setSelectedCategories(filters.selectedCategories);
      setIsNewFilterActive(filters.isNew);
    },
    []
  );

  const toggleShowAllEvents = () => {
    setShowAllEvents((prev) => !prev);
  };

  const isLoadingUI = isBlockchainLoading || isFilterApiLoading;
  const filtersCurrentlyActive =
    searchTerm || selectedCategories.length > 0 || isNewFilterActive;
  const showSeeMoreButton = !filtersCurrentlyActive && events.length > 16;

  // Create enriched events with odds data embedded
  const enrichedEvents = currentDisplayableEvents.map((event) => {
    // Add odds data to the event object (as a temporary property)
    const enrichedEvent = {
      ...event,
      odds: eventOdds[event.eventId] || null,
    };
    return enrichedEvent;
  });

  return (
    <div>
      <section className="mb-2">
        <AutoSlider slides={slides} interval={5000} height={400} />
      </section>
      <FilterBar onFilterChange={handleFilterChange} />
      <div className="flex flex-col w-full items-center mt-8">
        {isLoadingUI ? (
          <div className="flex justify-center py-8">
            <p className="text-center text-gray-400">
              {isBlockchainLoading
                ? "Loading events from blockchain..."
                : "Applying filters..."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-5 sm:px-3 md:px-4 lg:px-20 w-full mb-16">
              {currentDisplayableEvents.length === 0 ? (
                <p className="text-center col-span-full py-8 text-gray-300">
                  {filtersCurrentlyActive
                    ? "No events match your current filters."
                    : events.length === 0 && !isBlockchainLoading
                    ? "No active events found."
                    : "No events to display."}
                </p>
              ) : (
                // Modified: Pass event with embedded odds data, and web3
                enrichedEvents.map((enrichedEvent) => (
                  <BettingCard
                    key={enrichedEvent.eventId}
                    event={enrichedEvent}
                    web3={web3}
                    // eventOdds prop is removed
                  />
                ))
              )}
            </div>

            {showSeeMoreButton && (
              <div className="flex justify-center w-full my-6">
                <Button
                  onClick={toggleShowAllEvents}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-md"
                >
                  {showAllEvents ? "See Less" : "See More"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
