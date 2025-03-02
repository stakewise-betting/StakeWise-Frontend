import { useEffect, useState } from "react";
import Web3 from "web3";
import BettingCard from "@/components/BettingCard/BettingCard";
import Slider from "@/components/Slider/Slider";
import { contractABI, contractAddress } from "@/config/contractConfig";

const Home = () => {
  const [, setWeb3] = useState<Web3 | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      if ((window as any).ethereum) {
        const web3Instance = new Web3((window as any).ethereum);
        setWeb3(web3Instance);

        const betContract = new web3Instance.eth.Contract(
          contractABI,
          contractAddress
        );
        await loadEvents(betContract);
      }
    };
    init();
  }, []);

  const loadEvents = async (betContract: any) => {
    try {
      const eventCount = await betContract.methods.nextEventId().call();
      const eventList: any[] = [];
      // Loop through valid eventIds, starting from 1
      for (let eventId = 1; eventId < eventCount; eventId++) {
        // Start loop from 1
        try {
          const eventData = await betContract.methods.getEvent(eventId).call(); // Use eventId directly
          eventList.push(eventData);
        } catch (error) {
          console.error(`Error fetching event ${eventId}:`, error); // Log error with eventId
          // If getEvent(eventId) fails (e.g., eventId doesn't exist or was deleted), just continue to the next eventId
        }
      }
      setEvents(eventList);
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  return (
    <div>
      <Slider />
      <div className="mt-[20px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-20 sm:px-4 md:px-8 lg:px-20">
          {events.length === 0 ? (
            <p className="text-center">No events found.</p>
          ) : (
            events.map((event, index) => (
              <BettingCard key={index} event={event} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
