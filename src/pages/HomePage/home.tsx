import { useEffect, useState } from "react";
import Web3 from "web3";
import BettingCard from "@/components/BettingCard/BettingCard";
import Slider from "@/components/Slider/Slider";
import { contractABI, contractAddress } from "@/config/contractConfig";

// Define TypeScript interface for event data
interface EventData {
  eventId: string;
  name: string;
  imageURL: string;
  options: string[];
  endTime: string;
  startTime: string; // Make sure your contract has this field
  createdAt: string;
  description?: string;
}

const Home = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        console.error("Ethereum provider not found. Please install MetaMask.");
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const loadEvents = async (betContract: any) => {
    try {
      const eventCount = await betContract.methods.nextEventId().call();
      const eventList: EventData[] = [];
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

      // Loop through valid eventIds, starting from 1
      for (let eventId = 1; eventId < eventCount; eventId++) {
        try {
          const eventData = await betContract.methods.getEvent(eventId).call();
          
          // Format event data with types
          const formattedEvent: EventData = {
            ...eventData,
            eventId: eventId.toString(),
            name: eventData.name || `Event ${eventId}`,
            imageURL: eventData.imageURL || "/placeholder.svg",
            options: eventData.options || [],
            endTime: eventData.endTime || "0",
            startTime: eventData.startTime || "0", // Make sure your contract has this field
            createdAt: eventData.createdAt || "0"
          };
          
          // Only show events where startTime is in the past or present (current events)
          const startTimeSeconds = Number(formattedEvent.startTime);
          if (startTimeSeconds <= currentTime) {
            eventList.push(formattedEvent);
          }
        } catch (error) {
          console.error(`Error fetching event ${eventId}:`, error);
        }
      }
      
      // Sort events by start time (most recent first)
      eventList.sort((a, b) => Number(b.startTime) - Number(a.startTime));
      
      setEvents(eventList);
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  return (
    <div>
      <Slider />
      <div className="mt-[20px]">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-center text-gray-400">Loading current events...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-20 sm:px-4 md:px-8 lg:px-20">
            {events.length === 0 ? (
              <p className="text-center col-span-full py-8">No active events found.</p>
            ) : (
              events.map((event, index) => (
                <BettingCard key={index} event={event} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;