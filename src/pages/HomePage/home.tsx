import { useEffect, useState } from "react";
import Web3 from "web3";
import BettingCard from "@/components/BettingCard/BettingCard";
import Slider from "@/components/Slider/Slider";

const contractAddress = "0x904d11bEEbFc370D2fC0A7ba256A44c5d9e665A9"; // Replace with your actual contract address
const contractABI = [
  // ... (your contract ABI - keep it the same) ...
  {
    inputs: [],
    name: "nextEventId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_eventId", type: "uint256" }],
    name: "getEvent",
    outputs: [
      { internalType: "uint256", name: "eventId", type: "uint256" }, // IMPORTANT: Correct output name to eventId
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "string", name: "imageURL", type: "string" },
      { internalType: "string[]", name: "options", type: "string[]" },
      { internalType: "uint256", name: "startTime", type: "uint256" },
      { internalType: "uint256", name: "endTime", type: "uint256" },
      { internalType: "bool", name: "isCompleted", type: "bool" },
      { internalType: "string", name: "winningOption", type: "string" },
      { internalType: "uint256", name: "prizePool", type: "uint256" },
      { internalType: "string", name: "notificationMessage", type: "string" }, // Add notificationMessage to ABI
    ],
    stateMutability: "view",
    type: "function",
  },
];

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
