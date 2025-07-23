// import { useState, useEffect } from "react";
// import { UpcomingCard } from "@/components/UpcomingCard/UpcomingCard";
// import FilterSidebar from "@/components/DropdownMenu/DropdownMenu";
// import Pagination from "@/components/Pagination/Pagination";
// import Web3 from "web3";
// import { contractABI, contractAddress } from "@/config/contractConfig";
// import SearchAndFilterSection from "@/components/SearchAndFilterSection/SearchAndFilterSection";

// // Define TypeScript interface for event data
// interface BlockchainEvent {
//   eventId: string;
//   name: string;
//   imageURL: string;
//   description: string;
//   createdAt: string;
//   startTime: string;
//   endTime: string;
//   interestedCount: number;
//   isUserInterested: boolean;
//   tags: string[];
//   options: string[];
//   category: string;
//   onInterestedClick?: () => void;
// }

// export default function Page() {
//   const [web3, setWeb3] = useState<Web3 | null>(null); // State to store the web3 instance
//   const [events, setEvents] = useState<BlockchainEvent[]>([]); // State to store all upcoming blockchain events
//   const [isLoading, setIsLoading] = useState(true); 

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState(""); // This state is now passed to SearchAndFilterSection
//   const eventsPerPage = 4;

//   // Filter items
//   const filterItems = [
//     { title: "Categories", items: [
//       { name: "Politics", count: 21 },
//       { name: "Sports", count: 32 },
//       { name: "Games", count: 12 },
//       { name: "Entertainment", count: 15 },
//       { name: "Other", count: 7 },
//     ] },
//     { title: "Locations", items: [
//       { name: "USA", count: 12 },
//       { name: "Sri Lanka", count: 34 },
//       { name: "India", count: 8 },
//       { name: "Australia", count: 15 },
//     ] },
//     { title: "Date Range", items: [
//       { name: "Today", count: 9 },
//       { name: "This Weekend", count: 14 },
//       { name: "Next Week", count: 8 },
//       { name: "Next 3 Months", count: 45 },
//     ] },
//   ];

//   // Load blockchain events
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
//           await loadEvents(betContract);
//         } catch (error) {
//           console.error("Error initializing blockchain:", error);
//         } finally {
//           setIsLoading(false);
//         }
//       } else {
//         setIsLoading(false);
//         console.error("Ethereum provider not found. Please install MetaMask or another provider.");
//       }
//     };
//     init();
//   }, []);

//    // Fetch and format events from the blockchain
//   const loadEvents = async (betContract: any) => {
//     try {
//       const eventCount = await betContract.methods.nextEventId().call(); // Get total event count
//       const eventList: BlockchainEvent[] = [];
//       const currentTime = Math.floor(Date.now() / 1000); // Current timestamp

//       // Loop through each event ID
//       for (let eventId = 1; eventId < eventCount; eventId++) {
//         try {
//           const eventData = await betContract.methods.getEvent(eventId).call();
//           const startTimeSeconds = Number(eventData.startTime);

//           // Filter: Only add events that are in the future
//           if (startTimeSeconds > currentTime) {
//             const formattedEvent: BlockchainEvent = {
//               ...eventData,
//               eventId: eventId.toString(),
//               name: eventData.name || eventData.title || `Event ${eventId}`,
//               imageURL: eventData.imageURL || eventData.image || "/placeholder.svg",
//               description: eventData.description || "No description available",
//               interestedCount: Number(eventData.interestedCount) || 0,
//               isUserInterested: eventData.isUserInterested || false,
//               tags: eventData.tags || eventData.categories || ["Event"],
//               startTime: eventData.startTime || "0",
//               endTime: eventData.endTime || "0",
//               createdAt: eventData.createdAt || (Date.now() / 1000).toString(),
//               options: eventData.options || [],
//               category: eventData.category || "Event",
//              };
//             eventList.push(formattedEvent);
//           }
//         } catch (error) {
//           console.error(`Error fetching event ${eventId}:`, error);
//         }
//       }

//       // Sort upcoming events by start time
//       eventList.sort((a, b) => Number(a.startTime) - Number(b.startTime));
//       setEvents(eventList);
//     } catch (error) {
//       console.error("Error loading events:", error);
//       setEvents([]);
//     }
//   };

//   // Filter events based on the search input
//   const filteredEvents = events.filter((event) =>
//     event.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

//   // Get events for the current page
//   const getCurrentEvents = () => {
//     const indexOfLastEvent = currentPage * eventsPerPage;
//     const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
//     return filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
//   };

//    // Handler to toggle user interest in an event
//   const handleInterestedClick = async (eventId: string) => {
//     if (!web3) {
//       console.error("Web3 not initialized");
//       return;
//     }
//     try {
//       // Request user's Ethereum address
//       const accounts = await (window as any).ethereum.request({
//         method: 'eth_requestAccounts'
//       });
//       const account = accounts[0];
//       setEvents((prevEvents) =>
//         prevEvents.map((event) =>
//           event.eventId === eventId
//             ? {
//                 ...event,
//                 isUserInterested: !event.isUserInterested,
//                 interestedCount: event.isUserInterested
//                   ? Math.max(0, event.interestedCount - 1)
//                   : event.interestedCount + 1,
//               }
//             : event
//         )
//       );
      
//       console.log(`Toggled interest for event ${eventId} by account ${account}`);
//     } catch (error) {
//       console.error("Error toggling interest:", error);
//       setEvents((prevEvents) =>
//         prevEvents.map((event) => (event.eventId === eventId ? { ...event } : event))
//       );
//     }
//   };

//   // Handler to change pagination
//   const handlePageChange = (pageNumber: number) => {
//     setCurrentPage(pageNumber);
//     window.scrollTo(0, 0);
//   };

//   // Reset to page 1 when the search query changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchQuery]);

//   return (
//     <div className="min-h-screen bg-[#1C1C27] px-[100px] py-8">
//       <h1 className="text-4xl font-bold text-white mb-8">Upcoming Events</h1>
//       <div className="grid gap-6 md:grid-cols-[240px,1fr]">
//         <div className="space-y-6 text-[#ffffff]">
//           {filterItems.map((filter, index) => (
//             <FilterSidebar key={index} title={filter.title} items={filter.items} />
//           ))}
//         </div>
//         <div className="space-y-6">
          
//           <SearchAndFilterSection
//             searchQuery={searchQuery}
//             onSearchChange={setSearchQuery} // Pass the setSearchQuery function directly
//           />

//           {isLoading ? (
//             <div className="text-center py-10">
//               <p className="text-white">Loading upcoming events from blockchain...</p>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {/* Events list */}
//               {getCurrentEvents().length > 0 ? (
//                 getCurrentEvents().map((event) => {
//                   const eventWithHandler = {
//                     ...event,
//                     onInterestedClick: () => handleInterestedClick(event.eventId)
//                   };
//                   return <UpcomingCard key={event.eventId} event={eventWithHandler} />;
//                 })
//               ) : (
//                 <div className="text-center py-10">
//                   <p className="text-gray-400">No upcoming events found. Check back later or explore current events on the homepage.</p>
//                 </div>
//               )}
//             </div>
//           )}


//           {/* Pagination control */}
//           {!isLoading && filteredEvents.length > 0 && (
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={handlePageChange}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



import { useState, useEffect, useContext } from "react"; // 1. Import useContext
import axios from 'axios';
import { UpcomingCard } from "@/components/UpcomingCard/UpcomingCard";
import FilterSidebar from "@/components/DropdownMenu/DropdownMenu";
import Pagination from "@/components/Pagination/Pagination";
import Web3 from "web3";
import { contractABI, contractAddress } from "@/config/contractConfig";
import SearchAndFilterSection from "@/components/SearchAndFilterSection/SearchAndFilterSection";
import { AppContext, AppContextType } from "@/context/AppContext"; // 2. Import AppContext

// Define TypeScript interface for event data (no change here)
interface BlockchainEvent {
  eventId: string;
  name: string;
  imageURL: string;
  description: string;
  createdAt: string;
  startTime: string;
  endTime: string;
  interestedCount: number;
  isUserInterested: boolean;
  tags: string[];
  options: string[];
  category: string;
  onInterestedClick?: (eventId: string) => void; // Changed to pass eventId
}


export default function Page() {
  // 3. Get userData and isLoggedin from the context
  const { userData, isLoggedin } = useContext(AppContext) as AppContextType;
  
  // 4. Use the real user ID from context. It will be undefined if not logged in.
  const currentUserId = userData?.id;

  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [events, setEvents] = useState<BlockchainEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true); 

  // Pagination and filter state (no change here)
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const eventsPerPage = 4;
  const filterItems = [
    { title: "Categories", items: [
      { name: "Politics", count: 21 },
      { name: "Sports", count: 32 },
      { name: "Games", count: 12 },
      { name: "Entertainment", count: 15 },
      { name: "Other", count: 7 },
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
  
  useEffect(() => {
    const init = async () => {
      if ((window as any).ethereum) {
        try {
          setIsLoading(true);
          const web3Instance = new Web3((window as any).ethereum);
          setWeb3(web3Instance);
          const betContract = new web3Instance.eth.Contract(
            contractABI,
            contractAddress
          );
          await loadEvents(betContract);
        } catch (error) {
          console.error("Error initializing blockchain:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        console.error("Ethereum provider not found.");
      }
    };
    init();
  }, []);

  // The loadEvents function now depends on currentUserId to fetch correct interest status
  useEffect(() => {
      if (!isLoading) { // Re-fetch interest data if user logs in/out
          const betContract = web3 && new web3.eth.Contract(contractABI, contractAddress);
          if (betContract) loadEvents(betContract);
      }
  }, [currentUserId, isLoading]);


  const loadEvents = async (betContract: any) => {
    try {
      const eventCount = await betContract.methods.nextEventId().call();
      const blockchainEvents: Omit<BlockchainEvent, 'onInterestedClick'>[] = [];
      const currentTime = Math.floor(Date.now() / 1000);

      for (let eventId = 1; eventId < eventCount; eventId++) {
        try {
          const eventData = await betContract.methods.getEvent(eventId).call();
          if (Number(eventData.startTime) > currentTime) {
            blockchainEvents.push({
              eventId: eventId.toString(),
              name: eventData.name || `Event ${eventId}`,
              imageURL: eventData.imageURL || "/placeholder.svg",
              description: eventData.description || "No description",
              createdAt: eventData.createdAt,
              startTime: eventData.startTime,
              endTime: eventData.endTime,
              tags: eventData.tags || ["Event"],
              options: eventData.options || [],
              category: eventData.category || "Event",
              interestedCount: 0,
              isUserInterested: false,
            });
          }
        } catch (err) { console.error(`Error fetching event ${eventId}:`, err); }
      }

      if (blockchainEvents.length > 0) {
        const eventIds = blockchainEvents.map(e => e.eventId);
        const response = await axios.post('http://localhost:5000/api/interests/status', {
            eventIds,
            userId: currentUserId, // Pass the dynamic user ID
        });
        const interestMap = response.data;

        const eventsWithInterest = blockchainEvents.map(event => ({
            ...event,
            interestedCount: interestMap[event.eventId]?.interestedCount || 0,
            isUserInterested: interestMap[event.eventId]?.isUserInterested || false,
        }));

        eventsWithInterest.sort((a, b) => Number(a.startTime) - Number(b.startTime));
        setEvents(eventsWithInterest);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Error loading events:", error);
      setEvents([]);
    }
  };

  const handleInterestedClick = async (eventId: string) => {
    // Check login status from context first
    if (!isLoggedin || !currentUserId) {
      alert("Please log in to register your interest.");
      return;
    }

    setEvents(prevEvents => prevEvents.map(event =>
      event.eventId === eventId ? {
          ...event,
          isUserInterested: !event.isUserInterested,
          interestedCount: event.isUserInterested ? event.interestedCount - 1 : event.interestedCount + 1,
        } : event
    ));
    
    try {
        await axios.post(`http://localhost:5000/api/interests/${eventId}/toggle`, {
            userId: currentUserId,
        });
    } catch (error) {
        console.error("Error toggling interest:", error);
        // Revert on error
        setEvents(prevEvents => prevEvents.map(event =>
            event.eventId === eventId ? {
                ...event,
                isUserInterested: !event.isUserInterested,
                interestedCount: event.isUserInterested ? event.interestedCount + 1 : event.interestedCount - 1,
              } : event
        ));
    }
  };
  
  // --- No change to the rest of the file ---
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const getCurrentEvents = () => {
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    return filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  };
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };
  useEffect(() => { setCurrentPage(1); }, [searchQuery]);


  return (
    <div className="min-h-screen bg-[#1C1C27] px-[100px] py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Upcoming Events</h1>
      <div className="grid gap-6 md:grid-cols-[240px,1fr]">
        <div className="space-y-6 text-[#ffffff]">
          {filterItems.map((filter, index) => (
            <FilterSidebar key={index} title={filter.title} items={filter.items} />
          ))}
        </div>
        <div className="space-y-6">
          <SearchAndFilterSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />

          {isLoading ? (
            <div className="text-center py-10"><p className="text-white">Loading events...</p></div>
          ) : (
            <div className="space-y-6">
              {getCurrentEvents().length > 0 ? (
                getCurrentEvents().map((event) => (
                  <UpcomingCard
                    key={event.eventId}
                    // 5. Pass the dynamic currentUserId to the card
                    currentUserId={currentUserId}
                    event={{
                      ...event,
                      onInterestedClick: handleInterestedClick,
                    }}
                  />
                ))
              ) : (
                <div className="text-center py-10"><p className="text-gray-400">No upcoming events found.</p></div>
              )}
            </div>
          )}

          {!isLoading && filteredEvents.length > 0 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </div>
      </div>
    </div>
  );
}