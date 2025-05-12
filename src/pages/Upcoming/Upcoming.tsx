import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UpcomingCard } from "@/components/UpcomingCard/UpcomingCard";
import FilterSidebar from "@/components/DropdownMenu/DropdownMenu";
import Pagination from "@/components/Pagination/Pagination";
import Web3 from "web3";
import { contractABI, contractAddress } from "@/config/contractConfig";


// Define TypeScript interface for event data
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
  onInterestedClick?: () => void;
}

export default function Page() {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [events, setEvents] = useState<BlockchainEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const eventsPerPage = 4;

  // Filter items
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

  // Load blockchain events
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
        console.error("Ethereum provider not found. Please install MetaMask or another provider.");
      }
    };
    init();
  }, []);

  const loadEvents = async (betContract: any) => {
    try {
      const eventCount = await betContract.methods.nextEventId().call();
      const eventList: BlockchainEvent[] = [];
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      
      // Loop through valid eventIds, starting from 1
      for (let eventId = 1; eventId < eventCount; eventId++) {
        try {
          const eventData = await betContract.methods.getEvent(eventId).call();
          
          // Only include events where startTime is in the future (upcoming events)
          const startTimeSeconds = Number(eventData.startTime);
          if (startTimeSeconds > currentTime) {
            // Format event data to include fields needed by UpcomingCard
            const formattedEvent: BlockchainEvent = {
              ...eventData,
              eventId: eventId.toString(),
              name: eventData.name || eventData.title || `Event ${eventId}`,
              imageURL: eventData.imageURL || eventData.image || "/placeholder.svg",
              description: eventData.description || "No description available",
              interestedCount: Number(eventData.interestedCount) || 0,
              isUserInterested: eventData.isUserInterested || false,
              tags: eventData.tags || eventData.categories || ["Event"],
              startTime: eventData.startTime || "0",
              endTime: eventData.endTime || "0",
              createdAt: eventData.createdAt || (Date.now() / 1000).toString(),
              options: eventData.options || [],
              category: eventData.category || "Event",  // "Uncategorized" || here we can't pass category from blockchain, because there is no category field in the contract
             };
            
            eventList.push(formattedEvent);
          }
        } catch (error) {
          console.error(`Error fetching event ${eventId}:`, error);
        }
      }
      
      // Sort by startTime (soonest first)
      eventList.sort((a, b) => Number(a.startTime) - Number(b.startTime));
      
      setEvents(eventList);
    } catch (error) {
      console.error("Error loading events:", error);
      setEvents([]);
    }
  };

  // Filter events based on search query
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Get current events
  const getCurrentEvents = () => {
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    return filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  };

  // Toggle interested state for an event
  const handleInterestedClick = async (eventId: string) => {
    if (!web3) {
      console.error("Web3 not initialized");
      return;
    }
    
    try {
      // Get current account
      const accounts = await (window as any).ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      const account = accounts[0];
      
      // Update UI optimistically
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.eventId === eventId
            ? {
                ...event,
                isUserInterested: !event.isUserInterested,
                interestedCount: event.isUserInterested 
                  ? Math.max(0, event.interestedCount - 1) 
                  : event.interestedCount + 1,
              }
            : event
        )
      );
      
      // Update blockchain (you would implement this based on your contract)
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      // This is a placeholder - replace with your actual contract method
      // await contract.methods.toggleInterest(eventId).send({from: account});
      
      console.log(`Toggled interest for event ${eventId} by account ${account}`);
    } catch (error) {
      console.error("Error toggling interest:", error);
      
      // Revert UI change if blockchain update fails
      setEvents((prevEvents) =>
        prevEvents.map((event) => (event.eventId === eventId ? { ...event } : event))
      );
    }
  };

  

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  };

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
          <div className="flex gap-4">
            <div className="relative flex-1 border-2 border-[#333447] rounded-lg">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8488AC]" />
              <Input 
                className="pl-10 bg-[#1C1C27] placeholder-[#8488AC] text-white border-none focus:border-transparent outline-none focus:outline-none focus:ring-0" 
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="secondary" className="bg-[#333447] hover:bg-[#4A4E68]">New</Button>
            <Button variant="secondary" className="bg-[#333447] hover:bg-[#4A4E68]">Trending</Button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-white">Loading upcoming events from blockchain...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {getCurrentEvents().length > 0 ? (
                getCurrentEvents().map((event) => {
                  // Create a new event object with the click handler included
                  const eventWithHandler = {
                    ...event,
                    onInterestedClick: () => handleInterestedClick(event.eventId)
                  };
                  
                  return <UpcomingCard key={event.eventId} event={eventWithHandler} />;
                })
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-400">No upcoming events found. Check back later or explore current events on the homepage.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Only show pagination if there are events */}
          {!isLoading && filteredEvents.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

