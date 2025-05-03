import { useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Search, ChevronUp } from "lucide-react";
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
  const eventsPerPage = 5;

  // Hero section background image
  const heroBackgroundImage = "/src/assets/images/ResultsBanner.png"; // Update this path to your image

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
            eventList.push(eventData);
          }
        } catch (error) {
          console.error(`Error fetching event ${eventId}:`, error);
        }
      }
      setEvents(eventList);
      setFilteredEvents(eventList);
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
      filtered = filtered.filter(event => 
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

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  return (
    <div className="min-h-screen bg-[#1a1e2e]">
      {/* Hero Section with Background Image */}
      <div 
        className="relative h-[250px] w-full overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackgroundImage})` }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-bold text-white mb-2">Betting Results</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Explore all completed events and their outcomes. Check final prize pools, and all event details.
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
              className="w-full rounded-lg bg-[#2a2e3e] border border-[#3a3e4e] px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="ml-2 rounded-lg bg-[#2a2e3e] border border-[#3a3e4e] px-4 py-2 text-white flex items-center"
            onClick={applyFilters}
          >
            <span>Filter</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>
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
                className="rounded-lg bg-[#252836] overflow-hidden border border-[#353846]"
              >
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleEventExpansion(index)}
                >
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#1a1e2e] border border-[#353846] flex items-center justify-center">
                      <img 
                        src={event.imageURL || "/src/assets/images/resultsLabel-icon.png"} 
                        alt="Event Logo" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-white text-lg">{event.name}</h3>
                      <div className="flex items-center text-sm text-gray-400">
                        <span className="mr-2">
                          {new Date(parseInt(event.startTime) * 1000).toLocaleDateString()} - {new Date(parseInt(event.endTime) * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium 
                      ${event.name.toLowerCase().includes('crypto') ? 'bg-purple-600 text-white' : 
                       event.name.toLowerCase().includes('sports') ? 'bg-blue-600 text-white' : 
                       'bg-green-600 text-white'}`}>
                      {event.name.toLowerCase().includes('crypto') ? 'Crypto' : 
                       event.name.toLowerCase().includes('esports') ? 'Esports' : 
                       event.name.toLowerCase().includes('politics') ? 'Politics' : 'Sports'}
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
                  <div className="p-4 border-t border-[#353846] bg-[#1e2233]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-gray-400 mb-2">Description</h4>
                        <p className="text-white">{event.description}</p>
                        
                        <h4 className="text-gray-400 mt-4 mb-2">Event Details</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Start Date:</span>
                            <span className="text-white">{new Date(parseInt(event.startTime) * 1000).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">End Date:</span>
                            <span className="text-white">{new Date(parseInt(event.endTime) * 1000).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Event Type:</span>
                            <span className="text-white">
                              {event.name.toLowerCase().includes('crypto') ? 'Crypto' : 
                               event.name.toLowerCase().includes('esports') ? 'Esports' : 
                               event.name.toLowerCase().includes('politics') ? 'Politics' : 'Sports'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-gray-400 mb-2">Results</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Prize Pool:</span>
                            <span className="text-green-400">{Web3.utils.fromWei(event.prizePool, 'ether')} ETH</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Winner:</span>
                            <span className="text-green-400 font-semibold">{event.winningOption}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Participants:</span>
                            <span className="text-white">1,289</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-[#2e3446] rounded-lg">
                          <p className="text-white">
                            {event.notificationMessage || "Event completed. Winner has been declared."}
                          </p>
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
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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