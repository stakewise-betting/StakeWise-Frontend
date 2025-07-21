import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Trophy, Star, Link2, FileText } from "lucide-react";
import Web3 from "web3";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { toast } from "react-toastify";
import { useWatchlist } from "@/context/WatchlistContext";
import { AppContext } from "@/context/AppContext";

// Define an array of different colors for the chart bars
const CHART_COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#f59e0b", // amber
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#10b981", // emerald
  "#6366f1", // indigo
  "#f97316", // orange
  "#14b8a6", // teal
  "#d946ef", // fuchsia
];

interface OptionOdds {
  optionName: string;
  oddsPercentage: number | bigint;
}

interface BetInterfaceProps {
  eventData: {
    eventId: number | bigint;
    name: string;
    description: string;
    rules: string;
    imageURL: string;
    options: string[];
    startTime: number | bigint;
    endTime: number | bigint;
    isCompleted: boolean;
    winningOption: string;
    prizePool: string | bigint;
    notificationMessage: string;
  };
  eventOdds: OptionOdds[] | null;
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  web3: Web3 | null;
}

export default function BetInterface({
  eventData,
  eventOdds,
  selectedOption,
  setSelectedOption,
  web3,
}: BetInterfaceProps) {
  const [showMore, setShowMore] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "rules">(
    "description"
  );
  const [isInWatchlist, setIsInWatchlist] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const { isLoggedin } = useContext(AppContext) || { isLoggedin: false };
  const { addToWatchlist, removeFromWatchlist, checkInWatchlist } =
    useWatchlist();

  // Ensure all options are strings
  const displayedOptions = showMore
    ? eventData.options
    : eventData.options.slice(0, 3);

  // Convert BigInt to Number for date
  const endDate = new Date(
    Number(eventData.endTime) * 1000
  ).toLocaleDateString();

  // Convert prizePool (may be BigInt) to string for web3
  const formattedPrizePool = () => {
    if (!web3) return "0 ETH";
    try {
      const prizePoolStr = eventData.prizePool.toString();
      const prizePoolInEther = web3.utils.fromWei(prizePoolStr, "ether");
      return `${Number(prizePoolInEther).toFixed(2)} ETH`;
    } catch (error) {
      console.error("Error formatting prize pool:", error);
      return "0 ETH";
    }
  };

  // Convert oddsPercentage (may be BigInt) to number for display
  const getOddsForOption = (optionName: string) => {
    if (!eventOdds) return "0%";
    const optionOdd = eventOdds.find((odd) => odd.optionName === optionName);
    if (!optionOdd) return "0%";
    return `${Number(optionOdd.oddsPercentage)}%`;
  };

  // Prepare chart data, converting oddsPercentage to number
  const chartData =
    eventOdds && eventOdds.length > 0
      ? eventOdds.map((odd) => ({
          name: String(odd.optionName),
          odds: Number(odd.oddsPercentage),
        }))
      : eventData.options.map((option) => ({
          name: String(option),
          odds: 0,
        }));

  // Check if event is in watchlist when component mounts
  useEffect(() => {
    const checkWatchlistStatus = async () => {
      if (isLoggedin && eventData.eventId) {
        try {
          const inWatchlist = await checkInWatchlist(Number(eventData.eventId));
          setIsInWatchlist(inWatchlist);
        } catch (error) {
          console.error("Error checking watchlist status:", error);
        }
      }
    };

    checkWatchlistStatus();
  }, [eventData.eventId, isLoggedin, checkInWatchlist]);

  // Handle watchlist toggle
  const handleWatchlistToggle = async () => {
    if (!isLoggedin) {
      toast.warn("Please log in to use the watchlist feature");
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const eventId = Number(eventData.eventId);

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

  // Handle copy link to clipboard
  const handleCopyLink = () => {
    try {
      // Create URL for the current event
      const eventUrl = `${window.location.origin}/bet/${eventData.eventId}`;
      navigator.clipboard.writeText(eventUrl);
      toast.success("Event URL copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy URL:", error);
      toast.error("Failed to copy URL to clipboard");
    }
  };

  // Handle report event
  const handleReportEvent = () => {
    // Here you could implement a modal for reporting the event
    // For now, just show a toast message
    toast.info("Report feature will be available soon");
  };

  return (
    <div className="lg:col-span-2">
      {/* Main Event Card */}
      <div className="rounded-xl overflow-hidden bg-gradient-to-br from-[#1C1C27] to-[#262633] border border-gray-700/30 shadow-2xl transition-all duration-300 hover:shadow-3xl hover:border-indigo-500/30 backdrop-blur-sm">
        <div className="p-8">
          {/* Event Header */}
          <div className="flex items-start gap-6 mb-8">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-indigo-500/30 shadow-xl">
              <img
                src={eventData.imageURL}
                alt={`${eventData.name} - Event ID ${eventData.eventId}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="flex-1 space-y-3">
              <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-white via-indigo-100 to-white bg-clip-text text-transparent">
                {eventData.name}
              </h1>
              <p className="text-slate-300 leading-relaxed line-clamp-3">
                {eventData.description}
              </p>
            </div>
          </div>

          {/* Event Meta */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-900/20 to-emerald-800/20 border border-emerald-700/30 rounded-lg px-4 py-2">
                <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400">
                  <Trophy className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs text-emerald-300 uppercase tracking-wide font-medium">
                    Prize Pool
                  </span>
                  <div className="text-white font-mono font-semibold">
                    {formattedPrizePool()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-900/20 to-indigo-800/20 border border-indigo-700/30 rounded-lg px-4 py-2">
                <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs text-indigo-300 uppercase tracking-wide font-medium">
                    Ends On
                  </span>
                  <div className="text-white font-semibold">{endDate}</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className={`group rounded-xl p-3 border transition-all duration-300 ${
                  isInWatchlist
                    ? "bg-yellow-500/20 border-yellow-400/30 text-yellow-400"
                    : "bg-gray-800/50 border-gray-600/30 text-gray-400 hover:bg-yellow-500/10 hover:border-yellow-400/30 hover:text-yellow-400"
                } ${isProcessing ? "opacity-50" : ""}`}
                onClick={handleWatchlistToggle}
                disabled={isProcessing}
              >
                <Star
                  className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                    isInWatchlist ? "fill-yellow-400" : "fill-none"
                  }`}
                  fill={isInWatchlist ? "currentColor" : "none"}
                />
              </button>
              <button
                className="group rounded-xl p-3 bg-gray-800/50 border border-gray-600/30 text-gray-400 hover:bg-indigo-500/10 hover:border-indigo-400/30 hover:text-indigo-400 transition-all duration-300"
                onClick={handleCopyLink}
              >
                <Link2 className="h-5 w-5 transition-transform group-hover:scale-110" />
              </button>
              <button
                className="group rounded-xl p-3 bg-gray-800/50 border border-gray-600/30 text-gray-400 hover:bg-red-500/10 hover:border-red-400/30 hover:text-red-400 transition-all duration-300"
                onClick={handleReportEvent}
              >
                <FileText className="h-5 w-5 transition-transform group-hover:scale-110" />
              </button>
            </div>
          </div>

          {/* Odds Bar Chart */}
          <div className="mb-8 bg-gradient-to-br from-gray-900/40 to-gray-800/40 border border-gray-700/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Market Overview
              </h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs text-emerald-400 font-medium uppercase tracking-wide">
                  Live
                </span>
              </div>
            </div>
            <div style={{ width: "100%", height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                  barSize={28}
                >
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickFormatter={(tick) => `${tick}%`}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={{ stroke: "#374151" }}
                    tickLine={{ stroke: "#374151" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fill: "#e2e8f0", fontSize: 13 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Probability"]}
                    contentStyle={{
                      backgroundColor: "rgba(30, 30, 40, 0.95)",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="odds" radius={[8, 8, 8, 8]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          selectedOption === entry.name
                            ? "#10b981"
                            : CHART_COLORS[index % CHART_COLORS.length]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Options Header */}
          <div className="flex justify-between px-6 py-2 text-sm font-semibold text-slate-300 mb-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg border border-gray-600/30">
            <span className="uppercase tracking-wide">Outcome</span>
            <span className="uppercase tracking-wide">Action</span>
            <span className="text-right uppercase tracking-wide">
              Probability
            </span>
          </div>

          {/* Options List */}
          <div className="space-y-4 mb-6">
            {displayedOptions.map((option, index) => (
              <div
                key={index}
                className={`group flex items-center justify-between p-6 bg-gradient-to-r from-gray-800/30 to-gray-700/30 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                  selectedOption === option
                    ? "border-emerald-500/50 bg-gradient-to-r from-emerald-900/20 to-emerald-800/20 shadow-emerald-500/10"
                    : "border-gray-600/30 hover:border-indigo-500/30 hover:from-gray-700/40 hover:to-gray-600/40"
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      selectedOption === option
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-gray-500 group-hover:bg-indigo-500"
                    }`}
                  ></div>
                  <span
                    className={`font-semibold text-lg transition-colors duration-300 ${
                      selectedOption === option
                        ? "text-emerald-300"
                        : "text-white group-hover:text-indigo-300"
                    }`}
                  >
                    {option}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <Button
                    onClick={() => setSelectedOption(option)}
                    className={`
                      font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105
                      ${
                        selectedOption === option
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                          : "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-indigo-500/25"
                      }
                    `}
                  >
                    {selectedOption === option ? "Selected" : "Select"}
                  </Button>
                </div>
                <div className="text-right w-20">
                  <div
                    className={`text-xl font-mono font-bold transition-colors duration-300 ${
                      selectedOption === option
                        ? "text-emerald-400"
                        : "text-slate-300"
                    }`}
                  >
                    {getOddsForOption(option)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {!showMore && eventData.options.length > 3 && (
            <div className="flex justify-center mt-6">
              <Button
                variant="ghost"
                className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-gradient-to-r hover:from-indigo-600/30 hover:to-purple-600/30 hover:text-white hover:border-indigo-400/50 transition-all duration-300 px-6 py-3 rounded-lg font-semibold"
                onClick={() => setShowMore(true)}
              >
                View All {eventData.options.length} Options
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Details/Rules Card */}
      <div className="mt-8 bg-gradient-to-br from-[#1C1C27] to-[#262633] rounded-xl border border-gray-700/30 shadow-2xl backdrop-blur-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-b border-gray-600/30">
          <button
            className={`flex-1 py-4 px-6 font-semibold text-center transition-all duration-300 ${
              activeTab === "rules"
                ? "bg-gradient-to-r from-emerald-600/20 to-emerald-500/20 text-emerald-300 border-b-2 border-emerald-500"
                : "text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-600/50"
            }`}
            onClick={() => setActiveTab("rules")}
          >
            Event Rules
          </button>
          <button
            className={`flex-1 py-4 px-6 font-semibold text-center transition-all duration-300 ${
              activeTab === "description"
                ? "bg-gradient-to-r from-emerald-600/20 to-emerald-500/20 text-emerald-300 border-b-2 border-emerald-500"
                : "text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-600/50"
            }`}
            onClick={() => setActiveTab("description")}
          >
            Full Details
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === "rules" && (
            <div className="animate-admin-fade-in space-y-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 border border-emerald-500/30">
                  <FileText className="h-6 w-6 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Event Rules & Guidelines
                </h2>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 leading-relaxed text-lg">
                  {eventData.rules}
                </p>
              </div>
            </div>
          )}

          {activeTab === "description" && (
            <div className="animate-admin-fade-in space-y-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500/20 to-indigo-400/20 border border-indigo-500/30">
                  <FileText className="h-6 w-6 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Event Description
                </h2>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 leading-relaxed text-lg">
                  {eventData.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
