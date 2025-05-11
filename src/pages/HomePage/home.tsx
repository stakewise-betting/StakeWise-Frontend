// import { useEffect, useState } from "react";
// import Web3 from "web3";
// import BettingCard from "@/components/BettingCard/BettingCard";
// import { contractABI, contractAddress } from "@/config/contractConfig";
// import { FilterBar } from "@/components/NewSerachBar/FilterBar";
// import AutoSlider from "@/components/AutomaticSlider/AutomaticSlider";
// import { Button } from "@/components/ui/button";

// // Define TypeScript interfaces
// interface EventData {
//   eventId: string;
//   name: string;
//   imageURL: string;
//   options: string[];
//   endTime: string;
//   startTime: string;
//   createdAt: string;
//   description?: string;
//   prizePool: string;
// }

// interface OptionOdds {
//   optionName: string;
//   oddsPercentage: number;
// }

// // Map to store odds for each event
// type EventOddsMap = {
//   [eventId: string]: OptionOdds[] | null;
// };

// const Home = () => {
//   const [web3, setWeb3] = useState<Web3 | null>(null);
//   const [events, setEvents] = useState<EventData[]>([]);
//   const [eventOdds, setEventOdds] = useState<EventOddsMap>({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [showAllEvents, setShowAllEvents] = useState(false);

//   useEffect(() => {
//     const init = async () => {
//       if ((window as any).ethereum) {
//         try {
//           setIsLoading(true);
//           const web3Instance = new Web3((window as any).ethereum);
//           setWeb3(web3Instance);
//           const betContract = new web3Instance.eth.Contract(
//             contractABI,
//             contractAddress
//           );
//           await loadEvents(betContract, web3Instance);
//         } catch (error) {
//           console.error("Error initializing blockchain:", error);
//         } finally {
//           setIsLoading(false);
//         }
//       } else {
//         console.error("Ethereum provider not found. Please install MetaMask.");
//         setIsLoading(false);
//       }
//     };
//     init();
//   }, []);

//   // Calculate betting odds for event options
//   const calculateEventOdds = async (
//     betContract: any,
//     eventId: string,
//     options: string[]
//   ) => {
//     try {
//       // Initialize odds array
//       const oddsArray: OptionOdds[] = [];

//       // Get total bets for this event (implementation depends on your contract)
//       const totalBets = await betContract.methods
//         .getTotalBetsForEvent(eventId)
//         .call();

//       // If no bets yet, return equal odds
//       if (parseInt(totalBets) === 0) {
//         return options.map((option) => ({
//           optionName: option,
//           oddsPercentage: 100 / options.length,
//         }));
//       }

//       // Calculate odds for each option
//       for (const option of options) {
//         try {
//           // Get bets for this option (implementation depends on your contract)
//           const optionBets = await betContract.methods
//             .getBetsForOption(eventId, option)
//             .call();

//           // Calculate percentage
//           const percentage = (parseInt(optionBets) / parseInt(totalBets)) * 100;

//           oddsArray.push({
//             optionName: option,
//             oddsPercentage: percentage,
//           });
//         } catch (error) {
//           console.error(`Error calculating odds for ${option}:`, error);
//           // Add default value if calculation fails
//           oddsArray.push({
//             optionName: option,
//             oddsPercentage: 0,
//           });
//         }
//       }

//       return oddsArray;
//     } catch (error) {
//       console.error(`Error calculating odds for event ${eventId}:`, error);
//       return null;
//     }
//   };

//   const loadEvents = async (betContract: any, web3Instance: Web3) => {
//     try {
//       const eventCount = await betContract.methods.nextEventId().call();
//       const eventList: EventData[] = [];
//       const oddsMap: EventOddsMap = {};
//       const currentTime = Math.floor(Date.now() / 1000);

//       // Loop through valid eventIds, starting from 1
//       for (let eventId = 1; eventId < eventCount; eventId++) {
//         try {
//           const eventData = await betContract.methods.getEvent(eventId).call();

//           // Format event data with types
//           const formattedEvent: EventData = {
//             ...eventData,
//             eventId: eventId.toString(),
//             name: eventData.name || `Event ${eventId}`,
//             imageURL: eventData.imageURL || "/placeholder.svg",
//             options: eventData.options || [],
//             endTime: eventData.endTime || "0",
//             startTime: eventData.startTime || "0",
//             createdAt: eventData.createdAt || "0",
//             prizePool: eventData.prizePool || "0",
//           };

//           // Only show events where startTime is in the past or present
//           const startTimeSeconds = Number(formattedEvent.startTime);
//           if (startTimeSeconds <= currentTime) {
//             eventList.push(formattedEvent);

//             // Calculate odds for this event
//             const eventOddsData = await calculateEventOdds(
//               betContract,
//               formattedEvent.eventId,
//               formattedEvent.options
//             );

//             // Store odds in the map
//             oddsMap[formattedEvent.eventId] = eventOddsData;
//           }
//         } catch (error) {
//           console.error(`Error fetching event ${eventId}:`, error);
//         }
//       }

//       // Sort events by start time (most recent first)
//       eventList.sort((a, b) => Number(b.startTime) - Number(a.startTime));

//       setEvents(eventList);
//       setEventOdds(oddsMap);
//     } catch (error) {
//       console.error("Error loading events:", error);
//     }
//   };

//   const toggleShowAllEvents = () => {
//     setShowAllEvents(!showAllEvents);
//   };

//   const displayedEvents = showAllEvents ? events : events.slice(0, 16);
//   const hasMoreEvents = events.length > 16;

//   const slides = [
//     { src: "/sliderImages/slider-img (1).jpg", alt: "Slider Image 1" },
//     { src: "/sliderImages/slider-img (2).jpg", alt: "Slider Image 2" },
//     { src: "/sliderImages/slider-img (3).jpg", alt: "Slider Image 3" },
//     { src: "/sliderImages/slider-img (4).jpg", alt: "Slider Image 4" },
//   ];

//   return (
//     <div>
//       <section className="mb-2">
//         <AutoSlider slides={slides} interval={5000} height={400} />
//       </section>
//       <FilterBar />
//       <div className="flex flex-col w-full items-center mt-2">
//         {isLoading ? (
//           <div className="flex justify-center py-8">
//             <p className="text-center text-gray-400">
//               Loading current events...
//             </p>
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-5 sm:px-3 md:px-4 lg:px-20 w-full">
//               {displayedEvents.length === 0 ? (
//                 <p className="text-center col-span-full py-8">
//                   No active events found.
//                 </p>
//               ) : (
//                 displayedEvents.map((event, index) => (
//                   <BettingCard
//                     key={index}
//                     event={event}
//                     eventOdds={eventOdds[event.eventId] || null}
//                     web3={web3}
//                   />
//                 ))
//               )}
//             </div>

//             {hasMoreEvents && (
//               <div className="flex justify-center w-full my-6">
//                 <Button
//                   onClick={toggleShowAllEvents}
//                   className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-md"
//                 >
//                   {showAllEvents ? "See Less" : "See More"}
//                 </Button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;














import { useEffect, useState, useCallback } from "react"; // Added useCallback
import Web3 from "web3";
import axios from 'axios'; // Import axios
import { toast } from "react-toastify"; // For user feedback

import BettingCard from "@/components/BettingCard/BettingCard";
import { contractABI, contractAddress } from "@/config/contractConfig";
import { FilterBar } from "@/components/NewSerachBar/FilterBar"; // Corrected path if it's NewSearchBar
import AutoSlider from "@/components/AutomaticSlider/AutomaticSlider";
import { Button } from "@/components/ui/button";

// Define TypeScript interfaces (ensure these are consistent)
interface EventData {
  eventId: string;
  name: string;
  imageURL: string;
  options: string[];
  endTime: string;
  startTime: string;
  createdAt: string; // Make sure this is part of your blockchain event data if needed, or it's from DB
  description?: string;
  prizePool: string;
  // Add category if it's part of the EventData structure from blockchain, otherwise it's only in DB
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
  const [events, setEvents] = useState<EventData[]>([]); // Raw events from blockchain
  const [eventOdds, setEventOdds] = useState<EventOddsMap>({});
  const [isBlockchainLoading, setIsBlockchainLoading] = useState(true);
  const [isFilterApiLoading, setIsFilterApiLoading] = useState(false); // For backend filter API
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [currentDisplayableEvents, setCurrentDisplayableEvents] = useState<EventData[]>([]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isNewFilterActive, setIsNewFilterActive] = useState<boolean>(false);

  // Function to calculate odds (copied from your original, ensure it's correctly scoped or passed)
  const calculateEventOdds = useCallback(async (
    betContract: any,
    eventId: string,
    options: string[]
  ): Promise<OptionOdds[] | null> => {
    try {
      const oddsArray: OptionOdds[] = [];
      const totalBets = await betContract.methods.getTotalBetsForEvent(eventId).call();
      if (parseInt(totalBets) === 0) {
        return options.map((option) => ({
          optionName: option,
          oddsPercentage: parseFloat((100 / options.length).toFixed(2)),
        }));
      }
      for (const option of options) {
        const optionBets = await betContract.methods.getBetsForOption(eventId, option).call();
        const percentage = (parseInt(optionBets) / parseInt(totalBets)) * 100;
        oddsArray.push({
          optionName: option,
          oddsPercentage: parseFloat(percentage.toFixed(2)),
        });
      }
      return oddsArray;
    } catch (error) {
      console.error(`Error calculating odds for event ${eventId}:`, error);
      return options.map(option => ({ optionName: option, oddsPercentage: 0 })); // Default on error
    }
  }, []);


  // Effect for initializing Web3 and loading events from blockchain
  useEffect(() => {
    const init = async () => {
      if ((window as any).ethereum) {
        try {
          setIsBlockchainLoading(true);
          const web3Instance = new Web3((window as any).ethereum);
          setWeb3(web3Instance);
          const betContract = new web3Instance.eth.Contract(contractABI, contractAddress);
          
          const eventCountBigInt = await betContract.methods.nextEventId().call();
          const eventCount = Number(eventCountBigInt); // Convert BigInt to Number
          const fetchedEvents: EventData[] = [];
          const fetchedOddsMap: EventOddsMap = {};
          const currentTime = Math.floor(Date.now() / 1000);

          for (let i = 1; i < eventCount; i++) { // eventId typically starts from 1
            try {
              const eventDataRaw = await betContract.methods.getEvent(i).call() as any;
              const formattedEvent: EventData = {
                eventId: i.toString(),
                name: eventDataRaw.name || `Event ${i}`,
                imageURL: eventDataRaw.imageURL || "/placeholder.svg",
                options: eventDataRaw.options || [],
                startTime: eventDataRaw.startTime.toString(),
                endTime: eventDataRaw.endTime.toString(),
                createdAt: eventDataRaw.createdAt?.toString() || "0", // Ensure createdAt is available
                prizePool: eventDataRaw.prizePool.toString(),
                // category: eventDataRaw.category // If category is on blockchain event
              };

              if (Number(formattedEvent.startTime) <= currentTime) {
                fetchedEvents.push(formattedEvent);
                const oddsData = await calculateEventOdds(betContract, formattedEvent.eventId, formattedEvent.options);
                if (oddsData) {
                  fetchedOddsMap[formattedEvent.eventId] = oddsData;
                }
              }
            } catch (eventError) {
              console.error(`Error fetching event ${i}:`, eventError);
            }
          }
          
          fetchedEvents.sort((a, b) => Number(b.startTime) - Number(a.startTime));
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
  }, [calculateEventOdds]); // Added calculateEventOdds to dependencies of this useEffect

  // Effect for filtering events based on backend search and local blockchain data
  useEffect(() => {
    if (isBlockchainLoading) {
      return;
    }

    const filtersActive = searchTerm || selectedCategories.length > 0 || isNewFilterActive;

    const applyFiltersAndDisplay = async () => {
      if (!filtersActive && !isBlockchainLoading) { // ensure blockchain events are loaded
        setCurrentDisplayableEvents(showAllEvents ? events : events.slice(0, 16));
        return;
      }
      
      // If filters are active but blockchain events aren't loaded yet, wait.
      if (filtersActive && isBlockchainLoading) {
          return;
      }
      // if filters are active and events are loaded or no events
      if(filtersActive && (!isBlockchainLoading || events.length === 0) ) {

        setIsFilterApiLoading(true);
        try {
          const params = new URLSearchParams();
          if (searchTerm) params.append('searchTerm', searchTerm);
          selectedCategories.forEach(cat => params.append('categories', cat));
          if (isNewFilterActive) params.append('isNew', 'true');
          
          const apiUrl = `/api/events/search?${params.toString()}`;
          console.log("[FRONTEND HomePage] Calling API:", apiUrl);

          const response = await axios.get(apiUrl);
          
          console.log("[FRONTEND HomePage] Raw API Response object:", response);
          console.log("[FRONTEND HomePage] API Response data (response.data):", response.data);
          console.log("[FRONTEND HomePage] Type of response.data:", typeof response.data, "Is Array:", Array.isArray(response.data));

          // Defensive check before mapping
          if (!Array.isArray(response.data)) {
              console.error("[FRONTEND HomePage] Error: response.data is not an array! Received:", response.data);
              toast.error("Received unexpected data format from server for filters.");
              setCurrentDisplayableEvents([]); // Clear display on error
              setIsFilterApiLoading(false);
              return;
          }

          const backendMatchedEvents: { eventId: string }[] = response.data.map((event: any) => ({
              ...event, 
              eventId: event.eventId.toString() // Ensure eventId is a string
          }));
          const backendFilteredEventIds = backendMatchedEvents.map(e => e.eventId);

          const newFilteredDisplayEvents = events.filter(bcEvent =>
            backendFilteredEventIds.includes(bcEvent.eventId)
          );
          setCurrentDisplayableEvents(newFilteredDisplayEvents);

        } catch (error: any) { // Explicitly type error as any or unknown then check
          console.error("Error fetching or applying filtered events:", error);
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
          } else if (error.request) {
            // The request was made but no response was received
            console.error("Error request:", error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
          }
          setCurrentDisplayableEvents([]);
          toast.error("Could not apply filters. Please try again.");
        } finally {
          setIsFilterApiLoading(false);
        }
      }
    };

    applyFiltersAndDisplay();

  }, [events, searchTerm, selectedCategories, isNewFilterActive, showAllEvents, isBlockchainLoading]);

  const handleFilterChange = useCallback((filters: {
    searchTerm: string;
    selectedCategories: string[];
    isNew: boolean;
  }) => {
    setSearchTerm(filters.searchTerm);
    setSelectedCategories(filters.selectedCategories);
    setIsNewFilterActive(filters.isNew);
  }, []);

  const toggleShowAllEvents = () => {
    setShowAllEvents(prev => !prev);
  };

  const isLoadingUI = isBlockchainLoading || isFilterApiLoading;
  const filtersCurrentlyActive = searchTerm || selectedCategories.length > 0 || isNewFilterActive;
  const showSeeMoreButton = !filtersCurrentlyActive && events.length > 16;

  return (
    <div>
      <section className="mb-2">
        <AutoSlider slides={slides} interval={5000} height={400} />
      </section>
      <FilterBar onFilterChange={handleFilterChange} />
      <div className="flex flex-col w-full items-center mt-2">
        {isLoadingUI ? (
          <div className="flex justify-center py-8">
            <p className="text-center text-gray-400">
              {isBlockchainLoading ? "Loading events from blockchain..." : "Applying filters..."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-5 sm:px-3 md:px-4 lg:px-20 w-full">
              {currentDisplayableEvents.length === 0 ? (
                <p className="text-center col-span-full py-8 text-gray-300">
                  {filtersCurrentlyActive 
                    ? "No events match your current filters." 
                    : (events.length === 0 && !isBlockchainLoading ? "No active events found." : "No events to display.")}
                </p>
              ) : (
                currentDisplayableEvents.map((event) => (
                  <BettingCard
                    key={event.eventId} // eventId from blockchain should be unique
                    event={event}
                    eventOdds={eventOdds[event.eventId] || null} // Pass calculated odds
                    web3={web3}
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