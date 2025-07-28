//StakeWise-Frontend/src/pages/Upcoming/Upcoming.tsx
import { useState, useEffect , useContext} from "react";
import axios from 'axios';
import { UpcomingCard } from "@/components/UpcomingCard/UpcomingCard";
import FilterSidebar from "@/components/FilterSidebarDropDown/FilterSidebarDropDown";
import Pagination from "@/components/Pagination/Pagination";
import Web3 from "web3";
import { contractABI, contractAddress } from "@/config/contractConfig";
import SearchAndFilterSection from "@/components/SearchAndFilterSection/SearchAndFilterSection";
import { AppContext, AppContextType } from "@/context/AppContext";

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
  onInterestedClick?: (eventId: string) => void; // Changed to pass eventId
}

// Add filter type - removed 'new' as requested
type FilterType = 'all' | 'trending';

export default function Page() {
  // 3. Get userData and isLoggedin from the context
  const { userData, isLoggedin } = useContext(AppContext) as AppContextType;
  
  // 4. Use the real user ID from context. It will be undefined if not logged in.
  const currentUserId = userData?.id;
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [events, setEvents] = useState<BlockchainEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // This state is now passed to SearchAndFilterSection
  
  // NEW: Add filter state
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  
  const eventsPerPage = 4;

  // Filter items
  const filterItems = [
    {
      title: "Categories",
      items: [
        { name: "Politics", count: 4 },
        { name: "Sports", count: 3 },
        { name: "Games", count: 1 },
        { name: "Entertainment", count: 1 },
        { name: "Other", count: 0 },
      ],
    },
    {
      title: "Date Range",
      items: [
        { name: "Today", count: 1 },
        { name: "This Weekend", count: 4 },
        { name: "Next Week", count: 3 },
        { name: "Next 3 Months", count: 3 },
      ],
    },
  ];

  // Load blockchain events
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        let web3Instance;

        if ((window as any).ethereum) {
          // If MetaMask is available, use it
          web3Instance = new Web3((window as any).ethereum);
          console.log("Using MetaMask provider");
        } else {
          // If no MetaMask, use a public RPC endpoint for reading data
          const rpcUrl =
            import.meta.env.VITE_RPC_URL || "http://localhost:7545";
          web3Instance = new Web3(rpcUrl);
          console.log(
            "Using public RPC provider for reading blockchain data:",
            rpcUrl
          );
        }

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

  // NEW: Updated filtering logic that includes search and trending filter
  const filteredEvents = events.filter((event) => {
    // Apply search filter
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const getCurrentEvents = () => {
    let eventsToShow = [...filteredEvents];
    
    // NEW: Sort by interest count only when trending filter is active
    if (activeFilter === 'trending') {
      eventsToShow.sort((a, b) => b.interestedCount - a.interestedCount);
    } else {
      // Default sort by start time when no filter is active
      eventsToShow.sort((a, b) => Number(a.startTime) - Number(b.startTime));
    }
    
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    return eventsToShow.slice(indexOfFirstEvent, indexOfLastEvent);
  };

  // NEW: Toggle trending filter handler
  const handleTrendingFilter = () => {
    if (activeFilter === 'trending') {
      // If trending is already active, toggle it off
      setActiveFilter('all');
    } else {
      // If trending is not active, turn it on
      setActiveFilter('trending');
    }
    setCurrentPage(1); // Reset to first page when filter changes
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

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter]); // Reset page when search or filter changes

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1C27] via-[#1E1E2E] to-[#1C1C27] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] py-6 sm:py-8">
      {/* Header Section - Mobile Responsive */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl border border-[#333447]">
          <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold bg-gradient-to-r from-[#E27625] to-[#F59E0B] bg-clip-text text-transparent mb-2 text-center sm:text-left">
            Upcoming Events
          </h1>
          <p className="text-[#A1A1AA] text-sm sm:text-base lg:text-lg text-center sm:text-left leading-relaxed">
            Discover and participate in exciting upcoming betting events
          </p>
        </div>
      </div>

      {/* Main Content Grid - Mobile Responsive */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[280px,1fr]">
        {/* Sidebar - Hidden on mobile, collapsible on tablet */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-gradient-to-br from-[#252538] to-[#2A2A3E] rounded-xl p-6 shadow-xl border border-[#333447]">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#E27625] rounded-full"></div>
              Filters
            </h3>
            <div className="space-y-4">
              {filterItems.map((filter, index) => (
                <FilterSidebar
                  key={index}
                  title={filter.title}
                  items={filter.items}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Mobile Filters Section */}
          <div className="lg:hidden bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl border border-[#333447]">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#E27625] rounded-full"></div>
              Filters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
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
          <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl border border-[#333447]">
            <SearchAndFilterSection
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={activeFilter}
              onTrendingClick={handleTrendingFilter}
            />
          </div>

          {/* Events Section */}
          <div className="bg-gradient-to-br from-[#252538] to-[#2A2A3E] rounded-lg sm:rounded-xl shadow-xl border border-[#333447] overflow-hidden">
            {isLoading ? (
              <div className="text-center py-12 sm:py-16 px-4">
                <div className="inline-flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-[#E27625] border-t-transparent"></div>
                  <p className="text-[#A1A1AA] text-sm sm:text-base lg:text-lg">
                    Loading upcoming events from blockchain...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-0">
                {getCurrentEvents().length > 0 ? (
                  getCurrentEvents().map((event, index) => {
                    const eventWithHandler = {
                      
                      ...event,
                      onInterestedClick: handleInterestedClick,
                    };
                    return (
                      <div
                        key={event.eventId}
                        
                        className={index > 0 ? "border-t border-[#333447]" : ""}
                      >
                        <UpcomingCard event={eventWithHandler} currentUserId={currentUserId} />
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 sm:py-16 px-4">
                    <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">
                      🎯
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                      {activeFilter === 'trending' && "No Trending Events"}
                      {activeFilter === 'all' && "No Upcoming Events"}
                    </h3>
                    <p className="text-[#A1A1AA] text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                      {activeFilter === 'trending' && "No trending events at the moment. Be the first to show interest in upcoming events!"}
                      {activeFilter === 'all' && "No upcoming events found. Check back later or explore current events on the homepage."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && filteredEvents.length > 0 && (
            <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl border border-[#333447]">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
