import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Award,
  Eye,
  Calendar,
  Tag,
  TrendingUp,
  Users,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info, // Added for details section consistency
} from "lucide-react";
import { DeclareWinnerSection } from "../shared/DeclareWinnerSection";
import Web3 from "web3";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EventTableItemProps {
  event: any;
  contract: any;
  web3: Web3 | null;
  onWinnerDeclared: () => void;
}

export const EventTableItem: React.FC<EventTableItemProps> = ({
  event,
  contract,
  web3,
  onWinnerDeclared,
}) => {
  const [isDeclaringWinner, setIsDeclaringWinner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!event) {
      console.warn("Event data is undefined or null in TableItem");
    }
  }, [event]);

  // Safely access properties with default values
  const eventId = event?.eventId?.toString() || "N/A";
  const name = event?.name || "Unnamed Event";
  const category = event?.category || "N/A";
  const startTime = event?.startTime
    ? Number(event.startTime) * 1000
    : Date.now();
  const endTime = event?.endTime ? Number(event.endTime) * 1000 : Date.now();
  const isCompleted = Boolean(event?.isCompleted);
  const winningOption = event?.winningOption || "";
  const listedBy = event?.listedBy || "Admin";
  const prizePool = event?.prizePool || "0";
  const options = Array.isArray(event?.options) ? event.options : [];
  const description = event?.description || "No description available";

  // Compute derived state with safe defaults
  const isEventEnded = new Date(endTime) < new Date();
  const isOngoing = !isCompleted && !isEventEnded;
  const isAwaitingResult = !isCompleted && isEventEnded;
  const currentTime = Date.now();
  const timeUntilEnd = endTime - currentTime;
  const daysUntilEnd = Math.floor(timeUntilEnd / (1000 * 60 * 60 * 24));
  const hoursUntilEnd = Math.floor(
    (timeUntilEnd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  // --- Enhanced Status Badge Logic ---
  const getStatusBadge = () => {
    const baseClasses =
      "flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold border backdrop-blur-sm whitespace-nowrap transition-all duration-300 shadow-lg";

    if (isCompleted) {
      return (
        <Badge
          variant="default"
          className={`${baseClasses} bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10`}
        >
          <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
          <span>Complete</span>
        </Badge>
      );
    } else if (isAwaitingResult) {
      return (
        <Badge
          variant="default"
          className={`${baseClasses} bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border-amber-500/40 animate-pulse shadow-amber-500/10`}
        >
          <AlertTriangle className="h-3 w-3 flex-shrink-0" />
          <span>Pending</span>
        </Badge>
      );
    } else if (isOngoing) {
      return (
        <Badge
          variant="default"
          className={`${baseClasses} bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 text-indigo-300 border-indigo-500/40 shadow-indigo-500/10`}
        >
          <Clock className="h-3 w-3 flex-shrink-0 animate-pulse" />
          <span>Live</span>
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className={`${baseClasses} bg-gradient-to-r from-gray-600/10 to-gray-700/10 text-gray-300 border-gray-500/40 shadow-gray-500/5`}
        >
          <Calendar className="h-3 w-3 flex-shrink-0" />
          <span>Scheduled</span>
        </Badge>
      );
    }
  };
  // --- End Enhanced Status Badge Logic ---

  const handleDeclareWinnerClick = () => setIsDeclaringWinner(true);
  const handleCancelDeclareWinner = () => setIsDeclaringWinner(false);
  const toggleDetails = () => setShowDetails(!showDetails);

  const formatPrizePool = (
    prizePoolWei: string | undefined | null,
    web3Instance: Web3 | null
  ): string => {
    if (!web3Instance) return "0.00 ETH";
    if (!prizePoolWei || prizePoolWei === "0") return "0.00 ETH";
    try {
      const prizePoolString = String(prizePoolWei);
      const prizePoolInEther = web3Instance.utils.fromWei(
        prizePoolString,
        "ether"
      );
      return `${Number(prizePoolInEther).toFixed(2)} ETH`;
    } catch (error) {
      console.error(
        `Error formatting prize pool (value: ${prizePoolWei}):`,
        error
      );
      return "0.00 ETH";
    }
  };

  const formatDate = (timestamp: number): string => {
    try {
      if (isNaN(timestamp) || timestamp <= 0) return "Invalid Date";
      return new Date(timestamp).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatTime = (timestamp: number): string => {
    try {
      if (isNaN(timestamp) || timestamp <= 0) return "Invalid Time";
      return new Date(timestamp).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Invalid Time";
    }
  };

  // Helper for responsive cell labels
  const DataLabel: React.FC<{ label: string }> = ({ label }) => (
    <span className="md:hidden font-medium text-dark-secondary mr-2">
      {label}:
    </span>
  );

  return (
    <>
      {/* Main Data Row / Card */}
      <TableRow
        className={`border-b border-gray-700/30 transition-all duration-300 block md:table-row group ${
          showDetails
            ? "bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border-indigo-500/30 shadow-lg"
            : "hover:bg-gradient-to-r hover:from-gray-800/30 hover:to-gray-700/30 hover:border-gray-600/50"
        } ${
          isDeclaringWinner
            ? "border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-900/10 to-emerald-800/10 shadow-emerald-500/10"
            : ""
        } relative backdrop-blur-sm`}
      >
        {/* Status Cell */}
        <TableCell className="p-2 md:px-3 md:py-3 align-middle block md:table-cell md:w-[100px] whitespace-nowrap">
          <DataLabel label="Status" />
          {getStatusBadge()}
        </TableCell>

        {/* Event ID Cell */}
        <TableCell className="p-2 md:px-3 md:py-3 align-middle block md:table-cell md:w-[80px]">
          <DataLabel label="ID" />
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
            <span className="font-mono text-xs text-white bg-gradient-to-r from-gray-800/50 to-gray-700/50 px-1.5 py-0.5 rounded-lg border border-gray-600/30">
              #{eventId}
            </span>
          </div>
        </TableCell>

        {/* Event Name & Desc Cell */}
        <TableCell className="p-3 md:px-4 md:py-4 align-middle block md:table-cell md:min-w-[200px] md:max-w-[280px]">
          <DataLabel label="Event" />
          <div className="space-y-1">
            <h3
              className="font-semibold text-white text-base truncate group-hover:text-indigo-300 transition-colors duration-300"
              title={name}
            >
              {name}
            </h3>
            {description && (
              <p
                className="text-xs text-slate-300 line-clamp-1 leading-relaxed"
                title={description}
              >
                {description}
              </p>
            )}
          </div>
        </TableCell>

        {/* Category Cell */}
        <TableCell className="p-3 md:px-4 md:py-4 align-middle block md:table-cell md:w-[130px]">
          <DataLabel label="Category" />
          <Badge
            variant="outline"
            className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border-purple-500/40 flex items-center gap-1 w-fit px-2 py-1 rounded-lg font-medium shadow-purple-500/10 text-xs"
          >
            <Tag className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{category}</span>
          </Badge>
        </TableCell>

        {/* Start Time Cell */}
        <TableCell className="p-3 md:px-4 md:py-4 align-middle block md:table-cell md:w-[140px]">
          <DataLabel label="Start Date" />
          <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-900/20 to-indigo-800/20 border border-indigo-700/30 rounded-lg px-2 py-1.5">
            <div className="p-0.5 rounded-full bg-indigo-500/20">
              <Calendar className="w-3 h-3 text-indigo-400" />
            </div>
            <span className="text-white font-medium text-xs whitespace-nowrap">
              {formatDate(startTime)}
            </span>
          </div>
        </TableCell>

        {/* Prize Pool Cell */}
        <TableCell className="p-3 md:px-4 md:py-4 align-middle block md:table-cell md:w-[120px]">
          <DataLabel label="Volume" />
          <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-900/20 to-emerald-800/20 border border-emerald-700/30 rounded-lg px-2 py-1.5">
            <div className="p-0.5 rounded-full bg-emerald-500/20">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
            </div>
            <span className="font-mono font-semibold text-emerald-300 text-xs whitespace-nowrap">
              {formatPrizePool(prizePool, web3)}
            </span>
          </div>
        </TableCell>

        {/* Listed By Cell */}
        <TableCell className="p-3 md:px-4 md:py-4 align-middle block md:table-cell md:w-[140px]">
          <DataLabel label="Listed By" />
          <div className="flex items-center gap-2 bg-gradient-to-r from-gray-800/30 to-gray-700/30 border border-gray-600/30 rounded-lg px-2 py-1.5">
            <div className="p-0.5 rounded-full bg-gray-600/30">
              <Users className="w-3 h-3 text-gray-400" />
            </div>
            <span className="text-slate-300 truncate font-medium text-xs">
              {listedBy.length > 6 ? `${listedBy.slice(0, 6)}...` : listedBy}
            </span>
          </div>
        </TableCell>

        {/* Actions Cell */}
        <TableCell className="p-3 md:px-4 md:py-4 align-middle block md:table-cell md:w-[160px] text-left md:text-right">
          <div className="flex items-center md:justify-end gap-2 flex-wrap">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleDetails}
                    className={`transition-all duration-300 h-8 w-8 rounded-lg border ${
                      showDetails
                        ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/40 text-indigo-300"
                        : "bg-gray-800/50 border-gray-600/30 text-gray-400 hover:bg-indigo-500/10 hover:border-indigo-400/30 hover:text-indigo-400"
                    }`}
                  >
                    <span className="sr-only">
                      {showDetails ? "Hide" : "Show"} details
                    </span>
                    {showDetails ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showDetails ? "Hide" : "Show"} details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              variant="ghost"
              size="sm"
              className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 border border-gray-600/30 text-gray-300 hover:from-indigo-600/20 hover:to-indigo-500/20 hover:border-indigo-500/40 hover:text-indigo-300 transition-all duration-300 rounded-lg px-3 py-1.5 font-medium text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>

            {!isCompleted && isAwaitingResult && !isDeclaringWinner && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeclareWinnerClick}
                className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 border-amber-500/40 text-amber-300 hover:from-amber-600/30 hover:to-amber-500/30 hover:border-amber-400/60 transition-all duration-300 rounded-lg px-3 py-1.5 font-semibold shadow-amber-500/10 text-xs"
              >
                <Award className="h-3 w-3 mr-1" />
                Declare
              </Button>
            )}
          </div>
          {isCompleted && winningOption && (
            <div className="mt-3 text-left md:text-right">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 border border-emerald-700/40 rounded-lg px-2 py-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <span className="text-xs text-emerald-300 font-medium">
                  Winner: {winningOption}
                </span>
              </div>
            </div>
          )}
        </TableCell>
      </TableRow>

      {/* Details Row / Section (conditional) */}
      {showDetails && (
        <TableRow className="bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-indigo-900/10 backdrop-blur-sm border-t border-indigo-500/20 block md:table-row">
          <TableCell colSpan={8} className="p-0 block md:table-cell">
            <div className="p-6 m-3 md:m-0 md:p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Event Details */}
                <div className="space-y-4 p-6 bg-gradient-to-br from-[#1C1C27] to-[#262633] rounded-xl border border-gray-700/30 shadow-xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500/20 to-indigo-400/20 border border-indigo-500/30">
                      <Info className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h4 className="text-lg font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Event Details
                    </h4>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {description || "No description provided."}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700/30">
                    <span className="text-slate-400 font-medium">
                      Event ID:
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <span className="font-mono text-white bg-gradient-to-r from-gray-800/50 to-gray-700/50 px-3 py-1 rounded-lg border border-gray-600/30">
                        #{eventId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4 p-6 bg-gradient-to-br from-[#1C1C27] to-[#262633] rounded-xl border border-gray-700/30 shadow-xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-purple-400/20 border border-purple-500/30">
                      <Calendar className="w-5 h-5 text-purple-400" />
                    </div>
                    <h4 className="text-lg font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Timeline
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-800/40 to-gray-700/40 rounded-lg border border-gray-600/30">
                      <span className="text-slate-400 font-medium">Start:</span>
                      <div className="text-right">
                        <div className="text-white font-semibold">
                          {formatDate(startTime)}
                        </div>
                        <div className="text-slate-400 text-sm">
                          {formatTime(startTime)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-800/40 to-gray-700/40 rounded-lg border border-gray-600/30">
                      <span className="text-slate-400 font-medium">End:</span>
                      <div className="text-right">
                        <div className="text-white font-semibold">
                          {formatDate(endTime)}
                        </div>
                        <div className="text-slate-400 text-sm">
                          {formatTime(endTime)}
                        </div>
                      </div>
                    </div>
                    {isOngoing && timeUntilEnd > 0 && (
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-900/20 to-indigo-800/20 rounded-lg border border-indigo-700/30">
                        <span className="text-indigo-300 font-medium">
                          Time Left:
                        </span>
                        <span className="text-indigo-300 font-semibold">
                          {daysUntilEnd > 0 ? `${daysUntilEnd}d ` : ""}
                          {hoursUntilEnd > 0 || daysUntilEnd === 0
                            ? `${hoursUntilEnd}h `
                            : ""}
                          remaining
                        </span>
                      </div>
                    )}
                    {isCompleted && (
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-900/20 to-emerald-800/20 rounded-lg border border-emerald-700/30">
                        <span className="text-emerald-300 font-medium">
                          Status:
                        </span>
                        <div className="flex items-center gap-2 text-emerald-300">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="font-semibold">Completed</span>
                        </div>
                      </div>
                    )}
                    {isAwaitingResult && (
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-900/20 to-amber-800/20 rounded-lg border border-amber-700/30">
                        <span className="text-amber-300 font-medium">
                          Status:
                        </span>
                        <div className="flex items-center gap-2 text-amber-300">
                          <AlertTriangle className="w-4 h-4 animate-pulse" />
                          <span className="font-semibold">Awaiting Result</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-4 p-6 bg-gradient-to-br from-[#1C1C27] to-[#262633] rounded-xl border border-gray-700/30 shadow-xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 border border-emerald-500/30">
                      <Tag className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h4 className="text-lg font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Options
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {options.length > 0 ? (
                      options.map((option: string, idx: number) => (
                        <div
                          key={idx}
                          className={`flex items-center p-3 rounded-lg border transition-all duration-300 ${
                            winningOption === option
                              ? "bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 border-emerald-700/40 text-emerald-300 shadow-emerald-500/10"
                              : "bg-gradient-to-r from-gray-800/40 to-gray-700/40 border-gray-600/30 text-slate-300"
                          }`}
                        >
                          {winningOption === option ? (
                            <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0 text-emerald-400" />
                          ) : (
                            <div className="w-3 h-3 mr-3 rounded-full bg-gray-500 flex-shrink-0"></div>
                          )}
                          <span className="font-medium">{option}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-6 bg-gradient-to-r from-gray-800/40 to-gray-700/40 rounded-lg border border-gray-600/30">
                        <p className="text-slate-400 italic">
                          No options listed.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}

      {/* Declare Winner Row / Section (conditional) */}
      {isDeclaringWinner && (
        <TableRow className="bg-gradient-to-r from-emerald-900/10 via-emerald-800/10 to-emerald-900/10 backdrop-blur-sm border-t border-emerald-500/30 block md:table-row">
          <TableCell colSpan={8} className="p-0 block md:table-cell">
            <div className="bg-gradient-to-br from-[#1C1C27] to-[#262633] p-6 rounded-xl m-3 border border-emerald-500/30 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 border border-emerald-500/30">
                  <Award className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Declare Winner
                  </h3>
                  <p className="text-slate-400">
                    Select the winning option for this event
                  </p>
                </div>
              </div>
              <DeclareWinnerSection
                event={event}
                contract={contract}
                web3={web3}
                onWinnerDeclared={() => {
                  setIsDeclaringWinner(false);
                  onWinnerDeclared();
                }}
                onCancel={handleCancelDeclareWinner}
              />
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
