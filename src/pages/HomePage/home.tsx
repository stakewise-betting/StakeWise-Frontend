import { useEffect, useState } from "react";
import Web3 from "web3";
import BettingCard from "@/components/BettingCard/BettingCard";
import Slider from "@/components/Slider/Slider";
import { contractABI, contractAddress } from "@/config/contractConfig";

// Define TypeScript interfaces
interface EventData {
  eventId: string;
  name: string;
  imageURL: string;
  options: string[];
  endTime: string;
  startTime: string;
  createdAt: string;
  description?: string;
  prizePool: string; // Added prizePool to match BettingCard's interface
}

interface OptionOdds {
  optionName: string;
  oddsPercentage: number;
}

// Map to store odds for each event
type EventOddsMap = {
  [eventId: string]: OptionOdds[] | null;
};

const Home = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [eventOdds, setEventOdds] = useState<EventOddsMap>({});
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
          await loadEvents(betContract, web3Instance);
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

  // Calculate betting odds for event options
  const calculateEventOdds = async (
    betContract: any,
    eventId: string,
    options: string[]
  ) => {
    try {
      // Initialize odds array
      const oddsArray: OptionOdds[] = [];
      
      // Get total bets for this event (implementation depends on your contract)
      const totalBets = await betContract.methods.getTotalBetsForEvent(eventId).call();
      
      // If no bets yet, return equal odds
      if (parseInt(totalBets) === 0) {
        return options.map(option => ({
          optionName: option,
          oddsPercentage: 100 / options.length
        }));
      }
      
      // Calculate odds for each option
      for (const option of options) {
        try {
          // Get bets for this option (implementation depends on your contract)
          const optionBets = await betContract.methods.getBetsForOption(eventId, option).call();
          
          // Calculate percentage
          const percentage = (parseInt(optionBets) / parseInt(totalBets)) * 100;
          
          oddsArray.push({
            optionName: option,
            oddsPercentage: percentage
          });
        } catch (error) {
          console.error(`Error calculating odds for ${option}:`, error);
          // Add default value if calculation fails
          oddsArray.push({
            optionName: option,
            oddsPercentage: 0
          });
        }
      }
      
      return oddsArray;
    } catch (error) {
      console.error(`Error calculating odds for event ${eventId}:`, error);
      return null;
    }
  };

  const loadEvents = async (betContract: any, web3Instance: Web3) => {
    try {
      const eventCount = await betContract.methods.nextEventId().call();
      const eventList: EventData[] = [];
      const oddsMap: EventOddsMap = {};
      const currentTime = Math.floor(Date.now() / 1000);

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
            startTime: eventData.startTime || "0",
            createdAt: eventData.createdAt || "0",
            prizePool: eventData.prizePool || "0" // Make sure prizePool is included
          };
          
          // Only show events where startTime is in the past or present
          const startTimeSeconds = Number(formattedEvent.startTime);
          if (startTimeSeconds <= currentTime) {
            eventList.push(formattedEvent);
            
            // Calculate odds for this event
            const eventOddsData = await calculateEventOdds(
              betContract,
              formattedEvent.eventId,
              formattedEvent.options
            );
            
            // Store odds in the map
            oddsMap[formattedEvent.eventId] = eventOddsData;
          }
        } catch (error) {
          console.error(`Error fetching event ${eventId}:`, error);
        }
      }
      
      // Sort events by start time (most recent first)
      eventList.sort((a, b) => Number(b.startTime) - Number(a.startTime));
      
      setEvents(eventList);
      setEventOdds(oddsMap);
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
                <BettingCard 
                  key={index} 
                  event={event} 
                  eventOdds={eventOdds[event.eventId] || null}
                  web3={web3}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;