import { FC, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Pin, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Web3 from "web3";
import { useWatchlist } from "@/context/WatchlistContext";
import { AppContext } from "@/context/AppContext";
import { toast } from "react-toastify";

interface OptionOdds {
  optionName: string;
  oddsPercentage: number;
}

interface EventData {
  eventId: string;
  name: string;
  imageURL: string;
  options: string[];
  endTime: string;
  startTime: string;
  createdAt?: string;
  description?: string;
  prizePool: string;
}

interface BettingCardProps {
  event: EventData;
  eventOdds: OptionOdds[] | null;
  web3: Web3 | null;
}

const BettingCard: FC<BettingCardProps> = ({ event, eventOdds, web3 }) => {
  const navigate = useNavigate();
  const { isLoggedin } = useContext(AppContext) || { isLoggedin: false };
  const { addToWatchlist, removeFromWatchlist, checkInWatchlist } = useWatchlist();
  
  const [isInWatchlist, setIsInWatchlist] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const startTime = new Date(Number(event.startTime) * 1000);
  const endTime = new Date(Number(event.endTime) * 1000);
  const currentTime = Math.floor(Date.now() / 1000);

  const isEventActive = Number(event.startTime) <= currentTime && Number(event.endTime) > currentTime;
  const isEventExpired = Number(event.endTime) <= currentTime;

  // Check if event is in watchlist when component mounts
  useEffect(() => {
    const checkWatchlistStatus = async () => {
      if (isLoggedin && event.eventId) {
        try {
          const inWatchlist = await checkInWatchlist(Number(event.eventId));
          setIsInWatchlist(inWatchlist);
        } catch (error) {
          console.error("Error checking watchlist status:", error);
        }
      }
    };
    
    checkWatchlistStatus();
  }, [event.eventId, isLoggedin]);

  const handleWatchlistToggle = async () => {
    if (!isLoggedin) {
      toast.warn("Please log in to use the watchlist feature");
      return;
    }
    
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      const eventId = Number(event.eventId);
      
      if (isInWatchlist) {
        const success = await removeFromWatchlist(eventId);
        if (success) {
          setIsInWatchlist(false);
          toast.success("Removed from watchlist");
        }
      } else {
        const success = await addToWatchlist(eventId);
        if (success) {
          setIsInWatchlist(true);
          toast.success("Added to watchlist");
        }
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error);
      toast.error("Failed to update watchlist");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusInfo = () => {
    if (isEventExpired) return { label: "Expired", color: "text-red-500" };
    if (isEventActive) return { label: "Active", color: "text-[#00BD58]" };
    return { label: "Upcoming", color: "text-yellow-500" };
  };

  const formattedPrizePool = () => {
    if (!web3) return "0 ETH";
    try {
      const prizePoolInEther = web3.utils.fromWei(event.prizePool, "ether");
      return `${Number(prizePoolInEther).toFixed(2)} ETH`;
    } catch (error) {
      console.error("Error formatting prize pool:", error);
      return "0 ETH";
    }
  };

  const getOddsForOption = (optionName: string) => {
    if (!eventOdds) return "0%";
    const optionOdd = eventOdds.find((odd) => odd.optionName === optionName);
    return optionOdd ? `${optionOdd.oddsPercentage}%` : "0%";
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className="w-full max-w-md bg-[#333447] text-white shadow-lg border-0">
      <CardHeader className="p-2 space-y-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <img
              src={event.imageURL || "/placeholder.svg"}
              alt={event.name}
              className="w-12 h-12 rounded-md object-cover"
            />
            <div>
              <h3 className="font-semibold text-sm leading-tight">{event.name}</h3>
              <div className={`text-[10px] ${statusInfo.color}`}>{statusInfo.label}</div>
            </div>
          </div>
          <div className="flex gap-2 text-[#8488AC]">
            <button className="hover:text-white transition-colors">
              <Pin className="h-4 w-4" />
            </button>
            <button 
              className={`hover:text-white transition-colors ${isInWatchlist ? ' text-yellow-400 fill-yellow-400' : ''} ${isProcessing ? 'opacity-50' : ''}`} 
              onClick={handleWatchlistToggle}
              disabled={isProcessing}
            >
              <Star className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-2 pt-0 space-y-1">
        <ScrollArea className="h-[70px] pr-2 overflow-hidden">
          <div className="space-y-0">
            {event.options.map((option, index) => (
              <div key={index} className="flex items-center justify-between h-[22px]">
                <span className="text-sm text-gray-200">{option}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-8 text-right">
                    {getOddsForOption(option)}
                  </span>
                  <Button
                    variant="secondary"
                    className={`text-[#00BD58] hover:text-white text-[9px] px-1 py-0 h-[14px] rounded
                      ${isEventExpired
                        ? "bg-gray-500 hover:bg-gray-600 cursor-not-allowed"
                        : "bg-[#3b7846] hover:bg-[#00BD58]"}`}
                    onClick={() => {
                      if (!isEventExpired) {
                        navigate(`/bet/${event.eventId}`);
                      }
                    }}
                    disabled={isEventExpired}
                  >
                    {isEventExpired ? "Closed" : "Buy Yes"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex flex-col gap-1 text-xs text-[#8488AC]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>{endTime.toLocaleString()}</span>
            </div>
            <span className="text-xs text-right">{formattedPrizePool()} Vol.</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BettingCard;


