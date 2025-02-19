import { useEffect, useState } from "react";
import Web3 from "web3";
import BettingCard from "@/components/BettingCard/BettingCard";
import Slider from "@/components/Slider/Slider";

const contractAddress = "0x5bA5Bf00D1484aD1f5DBBEA9D252F7fBCEd9799b";
const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bettor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "option",
        type: "string",
      },
    ],
    name: "BetPlaced",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "id", type: "uint256" },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      {
        indexed: false,
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
    ],
    name: "EventCreated",
    type: "event",
  },
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
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "string", name: "imageURL", type: "string" },
      { internalType: "string[]", name: "options", type: "string[]" },
      { internalType: "uint256", name: "startTime", type: "uint256" },
      { internalType: "uint256", name: "endTime", type: "uint256" },
      { internalType: "bool", name: "isCompleted", type: "bool" },
      { internalType: "string", name: "winningOption", type: "string" },
      { internalType: "uint256", name: "prizePool", type: "uint256" },
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
      for (let i = 0; i < eventCount; i++) {
        const eventData = await betContract.methods.getEvent(i).call();
        eventList.push(eventData);
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
