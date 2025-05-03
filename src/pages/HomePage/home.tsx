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

// pages/HomePage/home.tsx
import { useEffect, useState, useCallback } from "react";
import Web3 from "web3";
import axios from 'axios'; // Import axios for API calls
import BettingCard from "@/components/BettingCard/BettingCard";
import { contractABI, contractAddress } from "@/config/contractConfig";
import { FilterBar } from "@/components/NewSerachBar/FilterBar"; // Ensure path is correct
import AutoSlider from "@/components/AutomaticSlider/AutomaticSlider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // Import Card components for skeleton

// Define TypeScript interfaces for data consistency
interface EventData {
  _id: string; // MongoDB ID
  eventId: string; // Blockchain event ID (as string or number from backend)
  name: string;
  imageURL: string;
  options: string[];
  endTime: string;
  startTime: string;
  createdAt: string;
  description?: string;
  category: string;
  prizePool: string; // Fetched from contract, stored as string (Wei)
}

interface OptionOdds {
  optionName: string;
  oddsPercentage: number;
}

type EventOddsMap = {
  [eventId: string]: OptionOdds[] | null;
};

// Define backend URL using Vite's environment variable mechanism
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'; // Fallback for local dev

const Home = () => {
  // --- State Variables ---
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null); // Store contract instance
  const [events, setEvents] = useState<EventData[]>([]); // Holds events from backend
  const [eventOdds, setEventOdds] = useState<EventOddsMap>({});
  const [isLoadingEvents, setIsLoadingEvents] = useState(true); // Loading state for backend event fetch
  const [isLoadingOdds, setIsLoadingOdds] = useState(false); // Loading state for contract odds/pool fetch
  const [showAllEvents, setShowAllEvents] = useState(false); // State for "See More" button
  const [currentSearchTerm, setCurrentSearchTerm] = useState(''); // State for search input
  // --- RENAMED STATE ---
  const [currentSelectedKeywords, setCurrentSelectedKeywords] = useState<string[]>([]); // State for selected keyword filters
  const [currentIsNewActive, setCurrentIsNewActive] = useState<boolean>(false); // State for "New" button filter
  const [error, setError] = useState<string | null>(null); // State for displaying errors

  // Log component renders and current state for debugging
  console.log("--- HomePage Component Render ---");
  // --- UPDATED LOG ---
  console.log("States:", { isLoadingEvents, isLoadingOdds, events: events.length, error: error, contract: !!contract, currentSearchTerm, currentSelectedKeywords, currentIsNewActive });

  // --- Effects ---

  // Initialize Web3 and Smart Contract Instance on Mount
  useEffect(() => {
    const initWeb3 = async () => {
        console.log("Initializing Web3...");
      if ((window as any).ethereum) {
        try {
          const web3Instance = new Web3((window as any).ethereum);
          setWeb3(web3Instance);
          const betContract = new web3Instance.eth.Contract(
            contractABI,
            contractAddress
          );
          setContract(betContract);
           console.log("Web3 and Contract Initialized successfully.");
        } catch (err) {
          console.error("!!! Error initializing Web3:", err);
          setError("Failed to initialize Web3. Please ensure MetaMask is connected and configured, then refresh.");
           setIsLoadingEvents(false); // Stop loading if web3 init fails
        }
      } else {
        console.error("Ethereum provider (MetaMask) not found.");
        setError("Ethereum provider (MetaMask) not found. Please install MetaMask and refresh.");
        setIsLoadingEvents(false); // Stop loading if no web3
      }
    };
    initWeb3();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect to Fetch Events from Backend when Filters or Contract Change
  useEffect(() => {
    // --- UPDATED LOG ---
    console.log("Filter/Contract useEffect triggered.", { contract: !!contract, currentSearchTerm, currentSelectedKeywords, currentIsNewActive });
    // Only fetch if the contract instance is ready
    if (contract) {
        console.log("Contract ready, calling fetchEventsFromBackend.");
        // --- Pass Keywords State ---
        fetchEventsFromBackend(currentSearchTerm, currentSelectedKeywords, currentIsNewActive);
    } else {
        console.log("Contract not yet ready, fetch deferred.");
        if (!error) setIsLoadingEvents(true);
    }
    // --- UPDATED DEPENDENCIES ---
  }, [currentSearchTerm, currentSelectedKeywords, currentIsNewActive, contract]);


  // --- Data Fetching Functions ---

  // Fetch Filtered Events List from Backend API
  // --- UPDATED SIGNATURE: Accepts selectedKeywords ---
  const fetchEventsFromBackend = useCallback(async (searchTerm: string, selectedKeywords: string[], isNewActive: boolean) => {
    // --- UPDATED LOG ---
    console.log(`>>> fetchEventsFromBackend called with: term='${searchTerm}', keywords=[${selectedKeywords.join(',')}], new=${isNewActive}`);
    setIsLoadingEvents(true); // Start loading indicator for events
    setError(null); // Clear previous errors
    setEvents([]); // Clear existing events before fetching new ones
    setEventOdds({}); // Clear old odds as they correspond to old events

    try {
      // Construct query parameters for the API call
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('searchTerm', searchTerm);
      }
      // --- SEND KEYWORDS PARAM ---
      if (selectedKeywords.length > 0) {
        params.append('keywords', selectedKeywords.join(',')); // Send keywords as comma-separated string
      }
      if (isNewActive) {
        params.append('new', 'true'); // Add 'new' flag if filter is active
      }

      console.log(`Fetching events from: ${BACKEND_URL}/api/events/search with params: ${params.toString()}`);
      const response = await axios.get<EventData[]>(`${BACKEND_URL}/api/events/search`, { params });
      console.log("<<< Backend Response Received:", response.data); // Log raw backend data

      // --- Data Transformation (No changes needed here unless backend response structure changed) ---
      const formattedEvents = response.data.map(event => ({
         ...event,
         eventId: String(event.eventId),
         startTime: String(event.startTime),
         endTime: String(event.endTime),
         prizePool: "0",
      }));
      // ------------------------------------------------------------------------------------------------

      console.log(`Formatted ${formattedEvents.length} events received from backend.`);
      setEvents(formattedEvents);

      // Fetch odds/pools if events were found and contract/web3 are ready
      if (formattedEvents.length > 0 && contract && web3) {
         console.log("Events received, triggering odds/pool fetch...");
         await fetchOddsForEvents(formattedEvents, contract, web3);
      } else {
        console.log("Skipping odds fetch (no events found, or contract/web3 not ready).");
        setIsLoadingOdds(false);
      }

    } catch (err: any) {
      console.error("!!! Error in fetchEventsFromBackend:", err);
      const errorMessage = err.response?.data?.message || err.message || "An unknown error occurred";
      setError(`Failed to load events: ${errorMessage}`);
      setEvents([]);
    } finally {
       console.log("Setting isLoadingEvents to false.");
      setIsLoadingEvents(false);
    }
  }, [contract, web3]); // Dependencies ensure contract/web3 are available

  // Fetch Odds and Prize Pools from Smart Contract (No changes needed here)
  const fetchOddsForEvents = async (filteredEvents: EventData[], betContract: any, web3Instance: Web3) => {
     console.log(`>>> fetchOddsForEvents called for ${filteredEvents.length} events`);
     setIsLoadingOdds(true);
     const oddsMap: EventOddsMap = {};
     const updatedEvents = filteredEvents.map(event => ({ ...event }));

     try {
         await Promise.all(updatedEvents.map(async (event, index) => {
             const eventIdNum = Number(event.eventId);
             if (isNaN(eventIdNum)) { /* ... skip ... */ return; }
              try { /* ... fetch prize pool ... */
                 const prizePoolWei = await betContract.methods.getPrizePool(eventIdNum).call();
                 updatedEvents[index].prizePool = prizePoolWei ? prizePoolWei.toString() : "0";
                 /* ... calculate odds ... */
                 const eventOddsData = await calculateEventOdds(betContract, event.eventId, event.options);
                 oddsMap[event.eventId] = eventOddsData;
                 console.log(`Fetched odds for ${eventIdNum}:`, eventOddsData);
             } catch (contractError: any) { /* ... handle individual error ... */
                 console.error(`!!! Error fetching contract data for event ${event.eventId}:`, contractError.message || contractError);
                 oddsMap[event.eventId] = null;
             }
         }));
         setEventOdds(oddsMap);
         setEvents(updatedEvents);
         console.log("<<< Odds and Pools fetch complete.");
     } catch (error) { /* ... handle Promise.all error ... */
     } finally {
         console.log("Setting isLoadingOdds to false.");
        setIsLoadingOdds(false);
     }
  };

  // Calculate Betting Odds for a Single Event (No changes needed here)
  const calculateEventOdds = async (
    betContract: any,
    eventId: string,
    options: string[]
  ): Promise<OptionOdds[] | null> => {
    /* ... existing logic ... */
    const eventIdNum = Number(eventId);
    if (isNaN(eventIdNum)) return null;
    console.log(`Calculating odds for event ID: ${eventIdNum}`);
    try {
      // ... get total bets ...
      // ... handle no bets ...
      // ... loop through options, get option bets, calculate percentage ...
      // ... normalize if needed ...
      // return oddsArray;
       const oddsArray: OptionOdds[] = [];
       let totalBets = BigInt(0);
       try {
         const totalBetsResult = await betContract.methods.getTotalBetsForEvent(eventIdNum).call();
         totalBets = BigInt(totalBetsResult);
       } catch (error: any) { return null; }
       if (totalBets === BigInt(0)) { /* return equal odds */
           const equalPercentage = options.length > 0 ? 100 / options.length : 0;
           return options.map(option => ({ optionName: option, oddsPercentage: parseFloat(equalPercentage.toFixed(2)) }));
       }
       let calculatedTotalPercentage = 0;
       for (const option of options) { /* get option bets, calculate % */
           let percentage = 0;
           try {
               const optionBetsResult = await betContract.methods.getBetsForOption(eventIdNum, option).call();
               const optionBets = BigInt(optionBetsResult);
               if (totalBets > BigInt(0)) {
                   const percentageBigInt = (optionBets * BigInt(10000)) / totalBets;
                   percentage = Number(percentageBigInt) / 100;
               }
               const formattedPercentage = parseFloat(percentage.toFixed(2));
               oddsArray.push({ optionName: option, oddsPercentage: formattedPercentage });
               calculatedTotalPercentage += percentage;
           } catch (error: any) { oddsArray.push({ optionName: option, oddsPercentage: 0 }); }
       }
       if (calculatedTotalPercentage > 0 && Math.abs(calculatedTotalPercentage - 100) > 0.1) { /* normalize */
            const normalizationFactor = 100 / calculatedTotalPercentage;
            oddsArray.forEach(odd => {
                const normalized = odd.oddsPercentage * normalizationFactor;
                odd.oddsPercentage = isNaN(normalized) ? 0 : parseFloat(normalized.toFixed(2));
            });
       }
       return oddsArray;
    } catch (error: any) { return null; }
  };


  // --- Event Handlers ---

  // Callback Passed to FilterBar to Update Filter State
  // --- UPDATED SIGNATURE: Accepts selectedKeywords ---
  const handleFilterChange = useCallback((searchTerm: string, selectedKeywords: string[], isNewActive: boolean) => {
     // --- UPDATED LOG ---
     console.log(">>> handleFilterChange received:", { searchTerm, selectedKeywords, isNewActive });
    setCurrentSearchTerm(searchTerm);
    // --- SET KEYWORDS STATE ---
    setCurrentSelectedKeywords(selectedKeywords);
    setCurrentIsNewActive(isNewActive);
  }, []); // No dependencies needed as it only sets state

  // Toggle Function for "See More" / "See Less" Button
  const toggleShowAllEvents = () => {
    setShowAllEvents(prevShowAll => !prevShowAll);
  };


  // --- Derived State & Constants ---

  // Determine which events to display based on the 'showAllEvents' state
  const displayedEvents = showAllEvents ? events : events.slice(0, 16);
  const hasMoreEvents = events.length > 16;

  // Data for the automatic image slider
  const slides = [
    { src: "/sliderImages/slider-img (1).jpg", alt: "Slider Image 1" },
    { src: "/sliderImages/slider-img (2).jpg", alt: "Slider Image 2" },
    { src: "/sliderImages/slider-img (3).jpg", alt: "Slider Image 3" },
    { src: "/sliderImages/slider-img (4).jpg", alt: "Slider Image 4" },
  ];


  return (
    <div>
      {/* Top Image Slider Section */}
      <section className="mb-2">
        <AutoSlider slides={slides} interval={5000} height={400} />
      </section>

      {/* Filter Bar Component - Pass updated callback */}
      <FilterBar onFilterChange={handleFilterChange} />

      {/* Main Content Area */}
      <div className="flex flex-col w-full items-center mt-2">

        {/* Error Display Area */}
         {error && (
             <div className="w-full max-w-6xl mx-auto p-4 my-4 bg-red-900/80 border border-red-700 text-red-100 rounded-md shadow-lg px-5 sm:px-3 md:px-4 lg:px-20">
                 <p className="font-bold text-lg">Oops! An Error Occurred:</p>
                 <p className="text-sm">{error}</p>
                 <p className="text-xs mt-2">Please check your MetaMask connection or try refreshing the page.</p>
             </div>
         )}

        {/* Loading Skeletons */}
        {isLoadingEvents ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-5 sm:px-3 md:px-4 lg:px-20 w-full">
            {Array.from({ length: 8 }).map((_, index) => (
               <Card key={`skeleton-${index}`} className="w-full max-w-md bg-[#333447] text-white shadow-lg border-0 animate-pulse">
                 <CardHeader className="p-2 space-y-0">{/* Skeleton structure */}</CardHeader>
                 <CardContent className="p-2 pt-0 space-y-1">{/* Skeleton structure */}</CardContent>
               </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Event Grid */}
            {console.log("Rendering actual event grid section...")}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-5 sm:px-3 md:px-4 lg:px-20 w-full">
              {displayedEvents.length === 0 && !isLoadingEvents && !error ? (
                <div className="col-span-full text-center py-12">{/* No events message */}</div>
              ) : (
                displayedEvents.map((event) => (
                  <BettingCard
                    key={event._id}
                    event={event}
                    eventOdds={eventOdds[event.eventId] || null}
                    web3={web3}
                  />
                ))
              )}
            </div>

             {/* Odds Loading Indicator */}
             {isLoadingOdds && !isLoadingEvents && events.length > 0 && (
                 <div className="text-center text-gray-400 py-4 text-sm animate-pulse w-full">
                     Fetching latest odds and prize pools...
                 </div>
             )}

            {/* "See More" Button */}
            {hasMoreEvents && !isLoadingEvents && (
              <div className="flex justify-center w-full my-6">
                <Button
                  onClick={toggleShowAllEvents}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-md transition-colors duration-200 disabled:opacity-50"
                  disabled={isLoadingEvents || isLoadingOdds}
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