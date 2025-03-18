import { useState, useEffect } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Search, ChevronUp } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Results.css";
import Web3 from "web3";
import { contractABI, contractAddress } from "@/config/contractConfig";

const ResultsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const eventsPerPage = 8;

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

  // Apply filters
  const applyFilters = () => {
    let filtered = [...events];
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply date filter
    if (selectedDate) {
      const dateFilter = new Date(selectedDate);
      filtered = filtered.filter(event => {
        const eventDate = new Date(parseInt(event.endTime) * 1000);
        return eventDate.toDateString() === dateFilter.toDateString();
      });
    }
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }
    
    setFilteredEvents(filtered);
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDate(null);
    setSelectedCategory("");
    setFilteredEvents(events);
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
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src="/src/assets/images/ResultsBanner.png"
          alt="Sports background"
          className="absolute inset-0 w-full h-full object-cover brightness-100"
        />
      </div>

      {/* Search and Filters */}
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-5 w-4 -translate-y-1/2 text-sub" />
            <input
              type="text"
              placeholder="Search event"
              className="w-full rounded-lg bg-transparent border border-sub px-4 py-2 pl-10 text-sub placeholder-sub focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            customInput={
              <button className="rounded-lg bg-transparent border border-sub p-2 text-sub hover:bg-card">
                <Calendar className="h-6 w-6" />
              </button>
            }
            popperClassName="react-datepicker-popper"
            calendarClassName="bg-gray-900 text-white border border-gray-800 rounded-md"
            dayClassName={() => "hover:bg-gray-800"}
          />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg bg-primary border border-sub px-4 py-1 text-sub hover:bg-primary focus:outline-none"
          >
            <option value="">Category</option>
            <option value="tennis">Tennis</option>
            <option value="football">Football</option>
            <option value="basketball">Basketball</option>
          </select>
          <button 
            className="rounded-lg bg-transparent border border-sub px-4 py-1 text-sub hover:bg-card"
            onClick={applyFilters}
          >
            Apply
          </button>
          <button
            className="rounded-lg bg-orange500 px-4 py-1 text-white hover:bg-orange600"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>

        {/* Results List */}
        <div className="mt-6 space-y-3">
          {loading ? (
            <div className="text-center p-4 text-white">Loading results...</div>
          ) : currentEvents.length === 0 ? (
            <div className="text-center p-4 text-white">No results found.</div>
          ) : (
            currentEvents.map((event, index) => (
              <div
                key={index}
                className="rounded-lg bg-card p-4 hover:bg-[#2E4156] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src={event.imageURL || "/src/assets/images/resultsLabel-icon.png"} 
                      alt="Event Logo" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{event.name}</h3>
                    <p className="text-sm text-sub">{event.description}</p>
                  </div>
                  <button 
                    className="p-2 text-white"
                    onClick={() => toggleEventExpansion(index)}
                  >
                    {expandedEvent === index ? (
                      <ChevronUp className="h-5 w-5" strokeWidth={3} />
                    ) : (
                      <ChevronDown className="h-5 w-5" strokeWidth={3} />
                    )}
                  </button>
                </div>
                
                {/* Expanded Result Details */}
                {expandedEvent === index && (
                  <div className="mt-4 pl-14 pr-4 pb-2 border-t border-gray-700 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Event Date:</span>
                      <span className="text-white">{new Date(parseInt(event.endTime) * 1000).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Prize Pool:</span>
                      <span className="text-white">{Web3.utils.fromWei(event.prizePool, 'ether')} ETH</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Winner:</span>
                      <span className="text-green-500 font-semibold">{event.winningOption}</span>
                    </div>
                    <div className="mt-4 text-orange500">
                      {event.notificationMessage || "Event completed. Winner has been declared."}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-end gap-2">
            <button
              className="rounded-md bg-card p-2 text-sub hover:bg-gray-800 disabled:opacity-50"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`rounded-md px-3 py-1 ${
                  currentPage === page
                    ? "bg-orange500 text-white hover:bg-orange600"
                    : "bg-card text-sub hover:bg-gray-800"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="rounded-md bg-card p-2 text-sub hover:bg-gray-800 disabled:opacity-50"
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