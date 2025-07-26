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
  BarChart3,
} from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
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
  const [eventCategories, setEventCategories] = useState<{
    [key: number]: string;
  }>({});
  const eventsPerPage = 5;

  // Function to fetch category from API
  const fetchEventCategory = async (eventId: number): Promise<string> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/events/search`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const eventsData = await response.json();

      // Find the event with matching eventId
      const event = eventsData.find((e: any) => e.eventId === eventId);

      if (event && event.category) {
        return event.category;
      }

      // If no category found in API, fall back to the original logic
      return "Unknown";
    } catch (error) {
      console.error(`Error fetching category for event ${eventId}:`, error);
      // Return fallback category on error
      return "Unknown";
    }
  };

  // Function to determine category based on event name (fallback)
  const determineCategory = (eventName: string): string => {
    const name = eventName.toLowerCase();
    if (name.includes("crypto")) return "Crypto";
    if (name.includes("esports")) return "Esports";
    if (name.includes("politics")) return "Politics";
    if (name.includes("entertainment")) return "Entertainment";
    return "Sports";
  };

  // Function to get category (with caching)
  const getEventCategory = async (
    eventId: number,
    eventName: string
  ): Promise<string> => {
    // Check if category is already cached
    if (eventCategories[eventId]) {
      return eventCategories[eventId];
    }

    try {
      // Fetch category from API
      const category = await fetchEventCategory(eventId);

      // If API returns "Unknown", use fallback logic
      const finalCategory =
        category === "Unknown" ? determineCategory(eventName) : category;

      // Cache the category
      setEventCategories((prev) => ({
        ...prev,
        [eventId]: finalCategory,
      }));

      return finalCategory;
    } catch (error) {
      console.error(`Error getting category for event ${eventId}:`, error);
      // Use fallback logic on error
      const fallbackCategory = determineCategory(eventName);

      // Cache the fallback category
      setEventCategories((prev) => ({
        ...prev,
        [eventId]: fallbackCategory,
      }));

      return fallbackCategory;
    }
  };

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
            const eventWithId = {
              ...eventData,
              id: eventId, // Add the eventId to the data
            };

            eventList.push(eventWithId);
          }
        } catch (error) {
          console.error(`Error fetching event ${eventId}:`, error);
        }
      }

      setEvents(eventList);
      setFilteredEvents(eventList);

      // Fetch categories for all events and save to database
      for (const event of eventList) {
        const category = await getEventCategory(event.id, event.name);
        // Save result with fetched category
        saveResultToDatabase(event, category);
      }
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

  // Save result to database with category
  const saveResultToDatabase = async (event: any, category?: string) => {
    const eventId = parseInt(event.id);

    // Skip if already saved
    if (savedEvents[eventId]) {
      return;
    }

    try {
      // Get category if not provided
      const eventCategory =
        category || (await getEventCategory(eventId, event.name));

      // Prepare the data according to your schema
      const resultData = {
        eventId: eventId,
        name: event.name,
        category: eventCategory,
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
        console.log(
          `Result saved for event ID ${eventId} with category ${eventCategory}`
        );
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
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F15] via-[#1C1C27] to-[#0F0F15]">
      {/* Hero Section with Background Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center px-4 bg-card rounded-xl shadow-lg border border-gray-700/60 p-6 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-dark-primary mb-4 flex items-center justify-center gap-3">
            <BarChart3 className="h-8 w-8 text-secondary" />
            Betting Results
          </h1>
          <p className="text-dark-secondary text-lg max-w-2xl mx-auto">
            Explore all completed events and their outcomes. Check winners,
            final prize pools, and comprehensive event details.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full rounded-xl bg-gray-800/40 border border-gray-600/50 hover:border-gray-500/60 focus:border-secondary/50 focus:ring-2 focus:ring-secondary/20 px-4 py-3 pl-12 text-white placeholder:text-slate-400 focus:outline-none transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center px-6 py-3 rounded-xl bg-gray-800/40 border border-gray-600/50">
                <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin mr-3"></div>
                <span className="text-white font-medium">
                  Loading results...
                </span>
              </div>
            </div>
          ) : currentEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-4 p-4 rounded-full bg-gray-800/40 border border-gray-600/50 inline-flex">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Results Found
              </h3>
              <p className="text-slate-400">
                Try adjusting your search terms or check back later for new
                results.
              </p>
            </div>
          ) : (
            currentEvents.map((event, index) => (
              <div
                key={index}
                className="rounded-2xl bg-gradient-to-br from-[#1C1C27] to-[#252538] overflow-hidden border border-gray-700/60 shadow-xl hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-300 hover:border-gray-600/70"
              >
                <div
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-800/20 transition-colors duration-200"
                  onClick={() => toggleEventExpansion(index)}
                >
                  <div className="flex items-center">
                    <div className="h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600/50 flex items-center justify-center shadow-lg">
                      <img
                        src={
                          event.imageURL ||
                          "/src/assets/images/resultsLabel-icon.png"
                        }
                        alt="Event Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-6">
                      <h3 className="font-bold text-white text-xl mb-1 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {event.name}
                      </h3>
                      <div className="flex items-center text-sm text-slate-400">
                        <CalendarDays className="w-4 h-4 mr-2" />
                        <span className="mr-4">
                          {new Date(
                            parseInt(event.startTime) * 1000
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(
                            parseInt(event.endTime) * 1000
                          ).toLocaleDateString()}
                        </span>
                        <Coins className="w-4 h-4 mr-2 text-secondary" />
                        <span className="text-secondary font-medium">
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
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors duration-200 ${
                        (
                          eventCategories[event.id] ||
                          determineCategory(event.name)
                        )
                          .toLowerCase()
                          .includes("crypto")
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30"
                          : (
                              eventCategories[event.id] ||
                              determineCategory(event.name)
                            )
                              .toLowerCase()
                              .includes("sports")
                          ? "bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30"
                          : (
                              eventCategories[event.id] ||
                              determineCategory(event.name)
                            )
                              .toLowerCase()
                              .includes("esports")
                          ? "bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30"
                          : "bg-secondary/20 text-secondary border-secondary/30 hover:bg-secondary/30"
                      }`}
                    >
                      {eventCategories[event.id] ||
                        determineCategory(event.name)}
                    </span>
                    <button className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 text-slate-400 hover:text-white">
                      {expandedEvent === index ? (
                        <ChevronUp className="h-6 w-6" />
                      ) : (
                        <ChevronDown className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedEvent === index && (
                  <div className="px-6 pb-6 border-t border-gray-700/50 bg-gradient-to-br from-[#0F0F15] to-[#1C1C27]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center mb-4">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10 border border-secondary/20 mr-3">
                              <CalendarDays className="w-5 h-5 text-secondary" />
                            </div>
                            <h4 className="font-bold text-xl text-white">
                              Event Details
                            </h4>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-start p-4 rounded-xl bg-gray-800/40 border border-gray-600/50">
                              <CalendarDays className="w-5 h-5 mr-3 text-secondary mt-1 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <span className="text-slate-400 text-sm font-medium block mb-1">
                                  Start Date
                                </span>
                                <span className="text-white font-semibold text-base break-words">
                                  {new Date(
                                    parseInt(event.startTime) * 1000
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                  {" at "}
                                  {new Date(
                                    parseInt(event.startTime) * 1000
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-start p-4 rounded-xl bg-gray-800/40 border border-gray-600/50">
                              <Clock className="w-5 h-5 mr-3 text-secondary mt-1 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <span className="text-slate-400 text-sm font-medium block mb-1">
                                  End Date
                                </span>
                                <span className="text-white font-semibold text-base break-words">
                                  {new Date(
                                    parseInt(event.endTime) * 1000
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                  {" at "}
                                  {new Date(
                                    parseInt(event.endTime) * 1000
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center p-4 rounded-xl bg-gray-800/40 border border-gray-600/50">
                              <Tag className="w-5 h-5 mr-3 text-secondary flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <span className="text-slate-400 text-sm font-medium block mb-1">
                                  Category
                                </span>
                                <span className="text-white font-semibold text-base">
                                  {eventCategories[event.id] ||
                                    determineCategory(event.name)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center mb-4">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10 border border-secondary/20 mr-3">
                              <Trophy className="w-5 h-5 text-secondary" />
                            </div>
                            <h4 className="font-bold text-xl text-white">
                              Results
                            </h4>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30">
                              <Trophy className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <span className="text-slate-400 text-sm font-medium block mb-1">
                                  Winner
                                </span>
                                <span className="text-green-400 font-bold text-lg">
                                  {event.winningOption || "N/A"}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/30">
                              <Coins className="w-5 h-5 mr-3 text-secondary flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <span className="text-slate-400 text-sm font-medium block mb-1">
                                  Prize Pool
                                </span>
                                <span className="text-secondary font-bold text-lg">
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

                        <div>
                          <div className="flex items-center mb-4">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 mr-3">
                              <Tag className="w-5 h-5 text-blue-400" />
                            </div>
                            <h4 className="font-bold text-xl text-white">
                              Description
                            </h4>
                          </div>
                          <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-600/50">
                            <p className="text-slate-300 leading-relaxed">
                              {event.description ||
                                "No description provided for this event."}
                            </p>
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
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              className="rounded-xl px-4 py-2 text-white bg-gray-800/40 border border-gray-600/50 hover:bg-gray-700/50 hover:border-gray-500/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-1">
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
                    className={`rounded-xl w-10 h-10 flex items-center justify-center font-semibold transition-all duration-300 ${
                      currentPage === pageNum
                        ? "bg-gradient-to-r from-secondary to-secondary/80 text-white shadow-lg hover:shadow-xl hover:shadow-secondary/30 transform hover:scale-105"
                        : "bg-gray-800/40 border border-gray-600/50 text-slate-400 hover:bg-gray-700/50 hover:border-gray-500/60 hover:text-white"
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              className="rounded-xl px-4 py-2 text-white bg-gray-800/40 border border-gray-600/50 hover:bg-gray-700/50 hover:border-gray-500/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
