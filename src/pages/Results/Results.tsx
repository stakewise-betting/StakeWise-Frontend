import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronUp,
  CalendarDays,
  Clock,
  Tag,
  Trophy,
  Coins,
} from "lucide-react";
import Web3 from "web3";
import { contractABI, contractAddress } from "@/config/contractConfig";

const ResultsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [savedEvents, setSavedEvents] = useState<{ [key: number]: boolean }>(
    {}
  );
  const eventsPerPage = 5;

  // Hero section background image
  const heroBackgroundImage = "/src/assets/images/ResultsBanner.jpg";

  // Fetch events from blockchain
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if ((window as any).ethereum) {
          const web3Instance = new Web3((window as any).ethereum);
          const betContract = new web3Instance.eth.Contract(
            contractABI,
            contractAddress
          );
          await loadEvents(betContract);
        }
      } catch (error) {
        console.error("Error initializing web3:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const loadEvents = async (betContract: any) => {
    try {
      const eventCount = await betContract.methods.nextEventId().call();
      const eventList: any[] = [];

      for (let eventId = 1; eventId < eventCount; eventId++) {
        try {
          const eventData = await betContract.methods.getEvent(eventId).call();
          // Only include completed events with a winner declared
          if (eventData.isCompleted && eventData.winningOption) {
            eventList.push({
              ...eventData,
              id: eventId, // Add the eventId to the data
            });
          }
        } catch (error) {
          console.error(`Error fetching event ${eventId}:`, error);
        }
      }
      setEvents(eventList);
      setFilteredEvents(eventList);

      // Save all events to database automatically
      eventList.forEach((event) => {
        saveResultToDatabase(event);
      });
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  // Apply search filter when searchTerm changes
  useEffect(() => {
    if (events.length > 0) {
      applyFilters();
    }
  }, [searchTerm]);

  // Apply filters function
  const applyFilters = () => {
    let filtered = [...events];

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
    setCurrentPage(1);
  };

  // Toggle event expansion
  const toggleEventExpansion = (index: number) => {
    setExpandedEvent(expandedEvent === index ? null : index);
  };

  // Function to determine category based on event name
  const determineCategory = (eventName: string): string => {
    const name = eventName.toLowerCase();
    if (name.includes("crypto")) return "Crypto";
    if (name.includes("esports")) return "Esports";
    if (name.includes("politics")) return "Politics";
    if (name.includes("entertainment")) return "Entertainment";
    return "Sports";
  };

  // Save result to database
  const saveResultToDatabase = async (event: any) => {
    const eventId = parseInt(event.id);

    // Skip if already saved
    if (savedEvents[eventId]) {
      return;
    }

    try {
      // Prepare the data according to our schema
      const resultData = {
        eventId: eventId,
        name: event.name,
        category: determineCategory(event.name),
        winner: event.winningOption,
        prizepool: parseFloat(
          Web3.utils.fromWei(event.prizePool || "0", "ether")
        ),
      };

      // Make API call to save result
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/results/save-result`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resultData),
        }
      );

      if (response.ok) {
        // Mark this event as saved
        setSavedEvents((prev) => ({ ...prev, [eventId]: true }));
        console.log(`Result saved for event ID ${eventId}`);
      } else {
        const data = await response.json();
        // If it's not a duplicate entry error, log it
        if (!data.error?.includes("already exists")) {
          console.error(
            `Failed to save result for event ID ${eventId}:`,
            data.error
          );
        } else {
          // Still mark duplicates as saved to avoid retrying
          setSavedEvents((prev) => ({ ...prev, [eventId]: true }));
          console.log(
            `Result for event ID ${eventId} already exists in database`
          );
        }
      }
    } catch (error: any) {
      console.error(`Error saving result for event ID ${eventId}:`, error);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div
        className="relative h-[250px] w-full overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackgroundImage})` }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            Betting Results
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Explore all completed events and their outcomes. Check final prize
            pools, and all event details.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full rounded-lg bg-[#333447] border-none px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center p-4 text-white">Loading results...</div>
          ) : currentEvents.length === 0 ? (
            <div className="text-center p-4 text-white">No results found.</div>
          ) : (
            currentEvents.map((event, index) => (
              <div
                key={index}
                className="rounded-lg bg-[#333447] overflow-hidden border-none"
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleEventExpansion(index)}
                >
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#1C1C27] border-none flex items-center justify-center">
                      <img
                        src={
                          event.imageURL ||
                          "/src/assets/images/resultsLabel-icon.png"
                        }
                        alt="Event Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-white text-lg">
                        {event.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-400">
                        <span className="mr-2">
                          {new Date(
                            parseInt(event.startTime) * 1000
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(
                            parseInt(event.endTime) * 1000
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium 
                      ${
                        event.name.toLowerCase().includes("crypto")
                          ? "bg-purple-600 text-white"
                          : event.name.toLowerCase().includes("sports")
                          ? "bg-blue-600 text-white"
                          : "bg-green-600 text-white"
                      }`}
                    >
                      {determineCategory(event.name)}
                    </span>
                    <button className="ml-4 text-gray-400">
                      {expandedEvent === index ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedEvent === index && (
                  <div className="p-4 border-t border-[#353846] bg-[#1e2233] text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center mb-3 text-gray-300">
                          <h4 className="font-semibold text-base text-white">
                            Event Details
                          </h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <CalendarDays className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-400 w-24 flex-shrink-0">
                              Start Date
                            </span>
                            <span className="text-white ml-2 break-words">
                              {new Date(
                                parseInt(event.startTime) * 1000
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                              ,{" "}
                              {new Date(
                                parseInt(event.startTime) * 1000
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          </div>

                          <div className="flex items-start">
                            <Clock className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-400 w-24 flex-shrink-0">
                              End Date
                            </span>
                            <span className="text-white ml-2 break-words">
                              {new Date(
                                parseInt(event.endTime) * 1000
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                              ,{" "}
                              {new Date(
                                parseInt(event.endTime) * 1000
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Tag className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-400 w-24 flex-shrink-0">
                              Event Type
                            </span>
                            <span className="text-white ml-2">
                              {determineCategory(event.name)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center mb-3 text-gray-300">
                          <h4 className="font-semibold text-base text-white">
                            Description
                          </h4>
                        </div>
                        <p className="text-gray-300 mb-4 text-sm">
                          {event.description || "No description provided."}
                        </p>
                        <div className="flex items-center mb-3 text-gray-300">
                          <h4 className="font-semibold text-base text-white">
                            Results
                          </h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Trophy className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-400 w-24 flex-shrink-0">
                              Winner
                            </span>
                            <span className="text-green-400 font-semibold ml-2">
                              {event.winningOption || "N/A"}
                            </span>
                          </div>

                          <div className="flex items-center">
                            <Coins className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-400 w-24 flex-shrink-0">
                              Prize Pool
                            </span>
                            <span className="text-green-400 ml-2">
                              {event.prizePool
                                ? `${Web3.utils.fromWei(
                                    event.prizePool,
                                    "ether"
                                  )} ETH`
                                : "0 ETH"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-1">
            <button
              className="rounded px-3 py-1 text-white bg-[#2a2e3e] hover:bg-[#3a3e4e]"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Logic to show a window of page numbers around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  className={`rounded w-8 h-8 flex items-center justify-center ${
                    currentPage === pageNum
                      ? "bg-[#f97316] text-white"
                      : "bg-[#2a2e3e] text-gray-400 hover:bg-[#3a3e4e]"
                  }`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className="rounded px-3 py-1 text-white bg-[#2a2e3e] hover:bg-[#3a3e4e]"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
