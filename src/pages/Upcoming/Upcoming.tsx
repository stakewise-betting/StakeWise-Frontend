import { useState, useEffect } from "react";
// Removed: Search, Button, Input imports as they are now in SearchAndFilterSection
import { UpcomingCard } from "@/components/UpcomingCard/UpcomingCard";
import FilterSidebar from "@/components/dropdownMenu/DropdownMenu";
import Pagination from "@/components/Pagination/Pagination";
import Web3 from "web3";
import { contractABI, contractAddress } from "@/config/contractConfig";
import SearchAndFilterSection from "@/components/SearchAndFilterSection/SearchAndFilterSection"; // Added import

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
  const [searchQuery, setSearchQuery] = useState(""); // This state is now passed to SearchAndFilterSection
  const eventsPerPage = 4;

  // Filter items
  const filterItems = [
    {
      title: "Categories",
      items: [
        { name: "Politics", count: 21 },
        { name: "Sports", count: 32 },
        { name: "Games", count: 12 },
        { name: "Entertainment", count: 15 },
        { name: "Other", count: 7 },
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
        console.error(
          "Ethereum provider not found. Please install MetaMask or another provider."
        );
      }
    };
    init();
  }, []);

  const loadEvents = async (betContract: any) => {
    try {
      const eventCount = await betContract.methods.nextEventId().call();
      const eventList: BlockchainEvent[] = [];
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

      for (let eventId = 1; eventId < eventCount; eventId++) {
        try {
          const eventData = await betContract.methods.getEvent(eventId).call();
          const startTimeSeconds = Number(eventData.startTime);
          if (startTimeSeconds > currentTime) {
            const formattedEvent: BlockchainEvent = {
              ...eventData,
              eventId: eventId.toString(),
              name: eventData.name || eventData.title || `Event ${eventId}`,
              imageURL:
                eventData.imageURL || eventData.image || "/placeholder.svg",
              description: eventData.description || "No description available",
              interestedCount: Number(eventData.interestedCount) || 0,
              isUserInterested: eventData.isUserInterested || false,
              tags: eventData.tags || eventData.categories || ["Event"],
              startTime: eventData.startTime || "0",
              endTime: eventData.endTime || "0",
              createdAt: eventData.createdAt || (Date.now() / 1000).toString(),
              options: eventData.options || [],
              category: eventData.category || "Event",
            };
            eventList.push(formattedEvent);
          }
        } catch (error) {
          console.error(`Error fetching event ${eventId}:`, error);
        }
      }
      eventList.sort((a, b) => Number(a.startTime) - Number(b.startTime));
      setEvents(eventList);
    } catch (error) {
      console.error("Error loading events:", error);
      setEvents([]);
    }
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const getCurrentEvents = () => {
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    return filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  };

  const handleInterestedClick = async (eventId: string) => {
    if (!web3) {
      console.error("Web3 not initialized");
      return;
    }
    try {
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
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
      // const contract = new web3.eth.Contract(contractABI, contractAddress);
      // await contract.methods.toggleInterest(eventId).send({from: account});
      console.log(
        `Toggled interest for event ${eventId} by account ${account}`
      );
    } catch (error) {
      console.error("Error toggling interest:", error);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.eventId === eventId ? { ...event } : event
        )
      );
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1C27] via-[#1E1E2E] to-[#1C1C27] px-[100px] py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-xl p-6 shadow-xl border border-[#333447]">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#E27625] to-[#F59E0B] bg-clip-text text-transparent mb-2">
            Upcoming Events
          </h1>
          <p className="text-[#A1A1AA] text-lg">
            Discover and participate in exciting upcoming betting events
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[280px,1fr]">
        <div className="space-y-6">
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
        <div className="space-y-6">
          {/* Search and Filter Section */}
          <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-xl p-6 shadow-xl border border-[#333447]">
            <SearchAndFilterSection
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Events Section */}
          <div className="bg-gradient-to-br from-[#252538] to-[#2A2A3E] rounded-xl shadow-xl border border-[#333447] overflow-hidden">
            {isLoading ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#E27625] border-t-transparent"></div>
                  <p className="text-[#A1A1AA] text-lg">
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
                      onInterestedClick: () =>
                        handleInterestedClick(event.eventId),
                    };
                    return (
                      <div
                        key={event.eventId}
                        className={index > 0 ? "border-t border-[#333447]" : ""}
                      >
                        <UpcomingCard event={eventWithHandler} />
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No Upcoming Events
                    </h3>
                    <p className="text-[#A1A1AA] max-w-md mx-auto">
                      No upcoming events found. Check back later or explore
                      current events on the homepage.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {!isLoading && filteredEvents.length > 0 && (
            <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-xl p-6 shadow-xl border border-[#333447]">
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
