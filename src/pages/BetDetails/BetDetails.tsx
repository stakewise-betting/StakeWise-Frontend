import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import BetInterface from "@/components/BetInterface/BetInterface";
import BetSlip from "@/components/BetSlip/BetSlip";

const contractAddress = "0x904d11bEEbFc370D2fC0A7ba256A44c5d9e665A9"; // Replace with your actual contract address
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
      {
        indexed: false,
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
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
        internalType: "string",
        name: "winningOption",
        type: "string",
      },
    ],
    name: "WinnerDeclared",
    type: "event",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "events",
    outputs: [
      {
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "string",
        name: "imageURL",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "options",
        type: "string[]",
      },
      {
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isCompleted",
        type: "bool",
      },
      {
        internalType: "string",
        name: "winningOption",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "prizePool",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "notificationMessage",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "nextEventId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "string",
        name: "_imageURL",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "_options",
        type: "string[]",
      },
      {
        internalType: "uint256",
        name: "_startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_endTime",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_notificationMessage",
        type: "string",
      },
    ],
    name: "createEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_eventId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_option",
        type: "string",
      },
    ],
    name: "placeBet",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_eventId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_winningOption",
        type: "string",
      },
    ],
    name: "declareWinner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_eventId",
        type: "uint256",
      },
    ],
    name: "getEvent",
    outputs: [
      {
        internalType: "uint256",
        name: "eventId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "string",
        name: "imageURL",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "options",
        type: "string[]",
      },
      {
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isCompleted",
        type: "bool",
      },
      {
        internalType: "string",
        name: "winningOption",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "prizePool",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "notificationMessage",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_eventId",
        type: "uint256",
      },
    ],
    name: "getEventOptions",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
];

interface EventData {
  eventId: number;
  name: string;
  description: string;
  imageURL: string;
  options: string[];
  startTime: number;
  endTime: number;
  isCompleted: boolean;
  winningOption: string;
  prizePool: string;
  notificationMessage: string;
}

interface BetDetailsProps {
  onCancel: () => void;
}

export default function BetDetails({ onCancel }: BetDetailsProps) {
  const { eventId: eventIdParam } = useParams<{ eventId: string }>(); // **[CORRECTED - Use 'eventId' here]**
  const navigate = useNavigate();
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State for error message

  useEffect(() => {
    console.log("BetDetails.tsx useEffect - eventIdParam:", eventIdParam);

    const init = async () => {
      console.log("BetDetails.tsx init - eventIdParam:", eventIdParam);
      if ((window as any).ethereum) {
        try {
          const web3Instance = new Web3((window as any).ethereum);
          const betContract = new web3Instance.eth.Contract(
            contractABI,
            contractAddress
          );
          setWeb3(web3Instance);
          setContract(betContract);
          await loadEventData(betContract, eventIdParam);
        } catch (initError: any) {
          console.error("Failed to initialize Web3:", initError);
          setError("Failed to initialize Web3. Please check console."); // Set error state
          setLoading(false);
        }
      }
    };
    init();
  }, [eventIdParam]);

  const loadEventData = async (
    betContract: any,
    eventIdParam: string | undefined
  ) => {
    console.log("BetDetails.tsx loadEventData - eventIdParam:", eventIdParam);
    try {
      if (!eventIdParam) {
        console.error("Event ID is missing (inside loadEventData).");
        setError("Event ID is missing from the URL."); // Set error state
        setLoading(false);
        return;
      }
      const event = await betContract.methods.getEvent(eventIdParam).call();
      console.log("loadEventData - event fetched from contract:", event); // Log fetched event
      setEventData(event); // Directly set event data - assuming getEvent returns correctly structured data
      setLoading(false);
    } catch (error: any) {
      console.error("Failed to load event data:", error);
      setError(
        "Failed to load event details. Event may not exist or network error."
      ); // Set error state
      setLoading(false);
      navigate("/");
    }
  };

  const handleBet = async () => {
    if (!web3 || !contract || !eventData || !selectedOption || !amount) return;

    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.placeBet(eventData.eventId, selectedOption).send({
        from: accounts[0],
        value: web3.utils.toWei(amount, "ether"),
      });
      alert("Bet placed successfully!");
    } catch (betError: any) {
      console.error("Failed to place bet:", betError);
      setError("Bet placement failed. Please check console for details."); // Set error state
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1C1C27] text-white p-4 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1C1C27] text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">
            Error Loading Event Details
          </h2>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={onCancel}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-[#1C1C27] text-white p-4 flex items-center justify-center">
        Event data not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1C27] text-white p-4 lg:p-6">
      <button
        onClick={onCancel}
        className="mb-4 text-sm text-gray-400 hover:text-gray-300"
      >
        {`< Back to Events`}
      </button>
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
        <BetInterface
          eventData={eventData}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
        <BetSlip
          eventData={eventData}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          amount={amount}
          setAmount={setAmount}
          onBet={handleBet}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}
