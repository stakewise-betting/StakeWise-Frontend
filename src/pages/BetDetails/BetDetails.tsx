import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import BetInterface from "@/components/BetInterface/BetInterface";
import BetSlip from "@/components/BetSlip/BetSlip";
import { contractABI, contractAddress } from "@/config/contractConfig";

interface OptionOdds {
  optionName: string;
  oddsPercentage: number;
}

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
  const { eventId: eventIdParam } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [eventOdds, setEventOdds] = useState<OptionOdds[] | null>(null); // State for event odds - ADDED
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          setError("Failed to initialize Web3. Please check console.");
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
        setError("Event ID is missing from the URL.");
        setLoading(false);
        return;
      }
      const event = await betContract.methods.getEvent(eventIdParam).call();
      const odds = await betContract.methods.getEventOdds(eventIdParam).call(); // Fetch event odds - ADDED
      console.log("loadEventData - event fetched from contract:", event);
      console.log("loadEventData - odds fetched from contract:", odds); // Log fetched odds - ADDED
      setEventData(event);
      setEventOdds(odds); // Set event odds state - ADDED
      setLoading(false);
    } catch (error: any) {
      console.error("Failed to load event data:", error);
      setError(
        "Failed to load event details. Event may not exist or network error."
      );
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
      await loadEventData(contract, eventIdParam); // Refetch event data and odds after bet - ADDED odds refetch
    } catch (betError: any) {
      console.error("Failed to place bet:", betError);
      setError("Bet placement failed. Please check console for details.");
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
          eventOdds={eventOdds} // Pass eventOdds to BetInterface - ADDED
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          web3={web3}
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
