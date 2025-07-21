import { FC, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Pin, Star, TrendingUp, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Web3 from "web3";
import { useWatchlist } from "@/context/WatchlistContext";
import { AppContext } from "@/context/AppContext";
import { toast } from "react-toastify";
import { contractABI, contractAddress } from "@/config/contractConfig";

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
  web3: Web3 | null;
}

const BettingCard: FC<BettingCardProps> = ({ event, web3 }) => {
  const navigate = useNavigate();
  const { isLoggedin } = useContext(AppContext) || { isLoggedin: false };
  const { addToWatchlist, removeFromWatchlist, checkInWatchlist } =
    useWatchlist();

  const [isInWatchlist, setIsInWatchlist] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [eventOdds, setEventOdds] = useState<OptionOdds[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const endTime = new Date(Number(event.endTime) * 1000);
  const currentTime = Math.floor(Date.now() / 1000);

  const isEventActive =
    Number(event.startTime) <= currentTime &&
    Number(event.endTime) > currentTime;
  const isEventExpired = Number(event.endTime) <= currentTime;

  // Fetch odds when component mounts or when web3/event changes
  useEffect(() => {
    const fetchEventOdds = async () => {
      if (web3 && event.eventId) {
        try {
          setLoading(true);
          const contract = new web3.eth.Contract(contractABI, contractAddress);
          const oddsRaw = await contract.methods
            .getEventOdds(event.eventId)
            .call();
          // Transform oddsRaw to OptionOdds[]
          const odds: OptionOdds[] = Array.isArray(oddsRaw)
            ? oddsRaw.map((item: any) => ({
                optionName: item.optionName ?? "",
                oddsPercentage: Number(item.oddsPercentage ?? 0),
              }))
            : [];
          setEventOdds(odds);
        } catch (error) {
          console.error("Error fetching event odds:", error);
          setEventOdds(null);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEventOdds();
  }, [web3, event.eventId]);

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
  }, [event.eventId, isLoggedin, checkInWatchlist]);

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
    if (isEventExpired)
      return {
        label: "Expired",
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
        icon: <Clock className="h-3 w-3" />,
      };
    if (isEventActive)
      return {
        label: "Live",
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/30",
        icon: <Zap className="h-3 w-3 animate-pulse" />,
      };
    return {
      label: "Upcoming",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      icon: <Clock className="h-3 w-3" />,
    };
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
    <Card className="group w-full max-w-md bg-gradient-to-br from-[#1C1C27] to-[#252538] text-white shadow-xl border border-gray-700/60 transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-secondary/10 hover:border-secondary/50 hover:scale-[1.02] hover:-translate-y-2 backdrop-blur-sm">
      {/* Header Section */}
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          {/* Event Info */}
          <div className="flex items-center space-x-3 flex-1">
            <div className="relative">
              <img
                src={event.imageURL || "/placeholder.svg"}
                alt={event.name}
                className="w-16 h-16 rounded-xl object-cover border-2 border-gray-700/60 group-hover:border-secondary/30 transition-colors duration-300"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary/20 rounded-full border border-secondary/40 group-hover:animate-pulse"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm leading-tight text-white mb-1 line-clamp-2 group-hover:text-secondary transition-colors duration-300">
                {event.name}
              </h3>
              <Badge
                className={`text-xs font-medium ${statusInfo.color} ${statusInfo.bgColor} ${statusInfo.borderColor} border backdrop-blur-sm`}
              >
                <span className="mr-1.5">{statusInfo.icon}</span>
                {statusInfo.label}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-2">
            <button className="p-2 rounded-lg bg-gray-700/40 hover:bg-gray-600/60 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
              <Pin className="h-4 w-4" />
            </button>
            <button
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                isInWatchlist
                  ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                  : "bg-gray-700/40 hover:bg-yellow-500/20 text-gray-400 hover:text-yellow-400"
              } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleWatchlistToggle}
              disabled={isProcessing}
            >
              <Star
                className={`h-4 w-4 ${isInWatchlist ? "fill-current" : ""}`}
              />
            </button>
          </div>
        </div>
      </CardHeader>

      {/* Content Section */}
      <CardContent className="p-4 pt-2 space-y-4">
        {/* Options List */}
        <div className="bg-black/20 rounded-xl p-3 border border-gray-700/40">
          <div className="space-y-2 max-h-[120px] overflow-y-auto">
            {event.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-800/40 hover:bg-gray-700/60 transition-colors duration-300"
              >
                <span className="text-sm font-medium text-gray-200 flex-1 pr-2 truncate">
                  {option}
                </span>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-secondary" />
                    <span className="text-xs font-bold text-secondary min-w-[35px] text-right">
                      {loading ? "..." : getOddsForOption(option)}
                    </span>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className={`text-xs font-bold px-3 py-1 h-7 rounded-lg transition-all duration-300 ${
                      isEventExpired
                        ? "bg-gray-600/60 hover:bg-gray-600/80 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600/80 to-green-500/80 hover:from-green-500 hover:to-green-400 text-white shadow-md hover:shadow-lg hover:scale-105"
                    }`}
                    onClick={() => {
                      if (!isEventExpired) {
                        navigate(`/bet/${event.eventId}`);
                      }
                    }}
                    disabled={isEventExpired}
                  >
                    {isEventExpired ? "Closed" : "Bet"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs bg-gradient-to-r from-gray-800/40 to-gray-700/40 rounded-lg p-3 border border-gray-700/30">
          <div className="flex items-center space-x-2 text-gray-300">
            <Clock className="h-4 w-4 text-secondary" />
            <span className="font-medium">
              {endTime.toLocaleDateString()} at{" "}
              {endTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-secondary" />
            <span className="font-bold text-secondary">
              {formattedPrizePool()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BettingCard;
