import { useState } from "react";
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

  return (
    <div className="lg:col-span-2">
      {/* Main Event Card */}
      <div className="rounded-xl overflow-hidden bg-card border border-gray-700/60 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-secondary/30 bg-noise dark">
        <div className="p-6">
          {/* Event Header */}
          <div className="flex items-start gap-6 mb-6">
            <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-700/50 shadow-md">
              <img
                src={eventData.imageURL}
                alt={`${eventData.name} - Event ID ${eventData.eventId}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-dark-primary">
                {eventData.name}
              </h1>
              <p className="mt-1 text-sm text-dark-secondary line-clamp-2">
                {eventData.description}
              </p>
            </div>
          </div>

          {/* Event Meta */}
          <div className="mt-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm text-dark-secondary">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-secondary/10 text-secondary">
                  <Trophy className="h-4 w-4" />
                </div>
                <span>{formattedPrizePool()} Vol.</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-secondary/10 text-secondary">
                  <Clock className="h-4 w-4" />
                </div>
                <span>{endDate}</span>
              </div>
            </div>
            <div className="flex gap-1">
              <button className="rounded-md p-2 text-dark-secondary hover:bg-primary/50 hover:text-dark-primary transition-colors">
                <Star className="h-5 w-5" />
              </button>
              <button className="rounded-md p-2 text-dark-secondary hover:bg-primary/50 hover:text-dark-primary transition-colors">
                <Link2 className="h-5 w-5" />
              </button>
              <button className="rounded-md p-2 text-dark-secondary hover:bg-primary/50 hover:text-dark-primary transition-colors">
                <FileText className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Odds Bar Chart */}
          <div className="mb-8">
            <h2 className="text-md font-semibold text-dark-primary mb-2">
              Odds Overview
            </h2>
            <div style={{ width: "100%", height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                  barSize={20}
                >
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickFormatter={(tick) => `${tick}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fill: "#a1a1aa", fontSize: 13 }}
                  />
                  <Tooltip formatter={(value: number) => `${value}%`} />
                  <Bar dataKey="odds" radius={[6, 6, 6, 6]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          selectedOption === entry.name
                            ? "#059669"
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
          <div className="flex justify-between px-4 text-sm text-dark-secondary mb-3 font-medium">
            <span>OUTCOME</span>
            <span>OPTION</span>
            <span className="text-right">ODDS</span>
          </div>

          {/* Options List */}
          <div className="space-y-3 mb-4">
            {displayedOptions.map((option, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-primary/30 rounded-lg border border-gray-700/40 transition-all duration-200 hover:border-secondary/30"
              >
                <div
                  className={`flex items-center gap-4 ${
                    selectedOption === option
                      ? "text-green"
                      : "text-dark-primary"
                  }`}
                >
                  <span className="font-medium">{option}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => setSelectedOption(option)}
                    className={`
                      bg-green/20 border border-green/60 text-green
                      hover:bg-green hover:text-white hover:border-green
                      transition-all duration-300 ease-in-out
                      hover:-translate-y-0.5 shadow-sm hover:shadow-md hover:shadow-green/30
                      px-4 py-2 rounded-md
                    `}
                  >
                    Buy Yes
                  </Button>
                </div>
                <div className="text-right w-16 font-mono text-dark-secondary">
                  {getOddsForOption(option)}
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {!showMore && eventData.options.length > 3 && (
            <div className="flex justify-center mt-4">
              <Button
                variant="ghost"
                className="bg-secondary/20 border border-secondary/60 text-secondary hover:bg-secondary hover:text-white hover:border-secondary transition-all duration-300 ease-in-out px-4 py-1.5 text-sm rounded-md"
                onClick={() => setShowMore(true)}
              >
                See more options
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Details/Rules Card */}
      <div className="mt-6 bg-card rounded-xl p-6 border border-gray-700/60 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-secondary/30 bg-noise dark">
        {/* Tabs */}
        <div className="flex border-b border-gray-700/60 mb-6">
          <button
            className={`py-2 px-4 font-medium transition-colors duration-200 ${
              activeTab === "rules"
                ? "text-green border-b-2 border-green"
                : "text-dark-secondary hover:text-dark-primary"
            }`}
            onClick={() => setActiveTab("rules")}
          >
            Rules
          </button>
          <button
            className={`py-2 px-4 font-medium transition-colors duration-200 ${
              activeTab === "description"
                ? "text-green border-b-2 border-green"
                : "text-dark-secondary hover:text-dark-primary"
            }`}
            onClick={() => setActiveTab("description")}
          >
            Details
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-4 text-dark-secondary">
          {activeTab === "rules" && (
            <div className="animate-admin-fade-in">
              <h2 className="text-xl font-semibold mb-4 text-dark-primary flex items-center">
                <div className="p-1.5 rounded-full bg-secondary/10 text-secondary mr-2">
                  <FileText className="h-4 w-4" />
                </div>
                Event Rules
              </h2>
              <p className="leading-relaxed">{eventData.rules}</p>
            </div>
          )}

          {activeTab === "description" && (
            <div className="animate-admin-fade-in">
              <h2 className="text-xl font-semibold mb-4 text-dark-primary flex items-center">
                <div className="p-1.5 rounded-full bg-secondary/10 text-secondary mr-2">
                  <FileText className="h-4 w-4" />
                </div>
                Full Description
              </h2>
              <p className="leading-relaxed">{eventData.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
