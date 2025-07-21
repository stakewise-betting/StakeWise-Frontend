import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import BetInterface from "@/components/BetInterface/BetInterface";
import BetSlip from "@/components/BetSlip/BetSlip";
import CountdownTimer from "@/components/CountdownTimer/CountdownTimer";
import DepositLimitTracker from "@/components/DepositLimitTracker/DepositLimitTracker"; // Import our new component
import { contractABI, contractAddress } from "@/config/contractConfig";
import CommentSection from "@/components/CommentSection/CommentSection";
import { AppContext } from "@/context/AppContext";
import responsibleGamblingService from "@/services/responsibleGamblingApiService";

interface OptionOdds {
  optionName: string;
  oddsPercentage: number;
}

interface EventData {
  eventId: number;
  name: string;
  description: string;
  rules: string;
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
  const [eventOdds, setEventOdds] = useState<OptionOdds[] | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { eventId } = useParams<{ eventId: string }>();
  const [limitExceeded, setLimitExceeded] = useState<boolean>(false);
  const [limitExceededMessage, setLimitExceededMessage] = useState<string>("");

  // Access AppContext and get currentUserId
  const appContext = useContext(AppContext);
  const currentUserId = appContext?.userData?.id || undefined;

  useEffect(() => {
    const init = async () => {
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
      } else {
        setError("Ethereum wallet not detected. Please install MetaMask.");
        setLoading(false);
      }
    };
    init();
  }, [eventIdParam]);

  const loadEventData = async (
    betContract: any,
    eventIdParam: string | undefined
  ) => {
    try {
      if (!eventIdParam) {
        console.error("Event ID is missing (inside loadEventData).");
        setError("Event ID is missing from the URL.");
        setLoading(false);
        return;
      }
      const event = await betContract.methods.getEvent(eventIdParam).call();
      const odds = await betContract.methods.getEventOdds(eventIdParam).call();
      setEventData(event);
      setEventOdds(odds);
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

  const handleLimitExceeded = (isExceeded: boolean, message?: string) => {
    setLimitExceeded(isExceeded);
    setLimitExceededMessage(message || "");
  };

  const handleBet = async () => {
    if (!web3 || !contract || !eventData || !selectedOption || !amount) return;

    // Don't proceed if limit is exceeded
    if (limitExceeded) {
      alert("Cannot place bet - would exceed your deposit limits.");
      return;
    }

    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.placeBet(eventData.eventId, selectedOption).send({
        from: accounts[0],
        value: web3.utils.toWei(amount, "ether"),
      });
      // Record the bet in your database for deposit limit tracking
      await responsibleGamblingService.recordBet(parseFloat(amount));
      alert("Bet placed successfully!");
      await loadEventData(contract, eventIdParam);
      // Reset amount after successful bet
      setAmount("");
    } catch (betError: any) {
      console.error("Failed to place bet:", betError);
      setError("Bet placement failed. Please check console for details.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F15] via-[#1C1C27] to-[#0F0F15] text-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin mx-auto"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">
              Loading Event Details
            </h3>
            <p className="text-slate-400">
              Fetching the latest betting information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F15] via-[#1C1C27] to-[#0F0F15] text-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-6 p-8 bg-gradient-to-br from-red-900/20 to-red-800/20 rounded-xl border border-red-700/50 backdrop-blur-sm">
          <div className="w-16 h-16 mx-auto bg-red-900/50 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white">
              Unable to Load Event
            </h2>
            <p className="text-red-200 leading-relaxed">{error}</p>
          </div>
          <button
            onClick={onCancel}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 active:scale-95"
          >
            Return to Events
          </button>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F15] via-[#1C1C27] to-[#0F0F15] text-white flex items-center justify-center">
        <div className="text-center space-y-6 p-8 bg-gradient-to-br from-gray-900/20 to-gray-800/20 rounded-xl border border-gray-700/50 backdrop-blur-sm">
          <div className="w-16 h-16 mx-auto bg-gray-700/50 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Event Not Found</h2>
            <p className="text-gray-400">
              The requested event data could not be loaded.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F15] via-[#1C1C27] to-[#0F0F15] text-white">
      {/* Countdown Timer Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 via-purple-600/5 to-indigo-600/5"></div>
        <div className="relative max-w-7xl mx-auto p-4 lg:p-6 mb-8">
          <CountdownTimer endTime={Number(eventData.endTime)} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Betting Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Event Interface */}
          <div className="lg:col-span-2">
            <BetInterface
              eventData={eventData}
              eventOdds={eventOdds}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              web3={web3}
            />
          </div>

          {/* Bet Controls */}
          <div className="space-y-6">
            <BetSlip
              eventData={eventData}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              amount={amount}
              setAmount={setAmount}
              onBet={handleBet}
              onCancel={onCancel}
              disableBet={limitExceeded}
              limitExceededMessage={limitExceededMessage}
            />
            <DepositLimitTracker
              amount={amount}
              onLimitExceeded={handleLimitExceeded}
            />
          </div>
        </div>

        {/* Community Section */}
        <div className="bg-gradient-to-br from-[#1C1C27] to-[#262633] rounded-xl border border-gray-700/30 shadow-2xl backdrop-blur-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 p-6 border-b border-gray-700/30">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>
              <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Community Discussion
              </h2>
            </div>
          </div>
          <div className="p-6">
            <CommentSection
              betId={eventId || ""}
              currentUserId={currentUserId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
