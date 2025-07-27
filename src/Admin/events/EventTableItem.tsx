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
  Info,
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

  const getStatusBadge = () => {
    const baseClasses =
      "flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium";

    if (isCompleted) {
      return (
        <Badge
          variant="default"
          className={`${baseClasses} bg-emerald-500/20 text-emerald-300`}
        >
          <CheckCircle2 className="h-3 w-3" />
          <span>Complete</span>
        </Badge>
      );
    } else if (isAwaitingResult) {
      return (
        <Badge
          variant="default"
          className={`${baseClasses} bg-amber-500/20 text-amber-300`}
        >
          <AlertTriangle className="h-3 w-3" />
          <span>Pending</span>
        </Badge>
      );
    } else if (isOngoing) {
      return (
        <Badge
          variant="default"
          className={`${baseClasses} bg-indigo-500/20 text-indigo-300`}
        >
          <Clock className="h-3 w-3" />
          <span>Live</span>
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className={`${baseClasses} bg-gray-600/10 text-gray-300`}
        >
          <Calendar className="h-3 w-3" />
          <span>Scheduled</span>
        </Badge>
      );
    }
  };

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

  return (
    <>
      {/* Main Data Row */}
      <TableRow
        className={`border-b border-gray-700/30 transition-all duration-300 ${
          showDetails ? "bg-indigo-900/10" : "hover:bg-gray-800/10"
        } ${isDeclaringWinner ? "border-l-4 border-l-emerald-500" : ""}`}
      >
        {/* Status Cell */}
        <TableCell className="px-2 py-3 w-[100px]">
          {getStatusBadge()}
        </TableCell>

        {/* Event ID Cell */}
        <TableCell className="px-2 py-3 w-[60px]">
          <span className="font-mono text-xs text-white">#{eventId}</span>
        </TableCell>

        {/* Event Name Cell */}
        <TableCell className="px-2 py-3 min-w-[150px] max-w-[200px]">
          <div>
            <h3 className="font-medium text-white truncate" title={name}>
              {name}
            </h3>
          </div>
        </TableCell>

        {/* Category Cell */}
        <TableCell className="px-2 py-3 w-[100px]">
          <Badge
            variant="outline"
            className="bg-purple-500/20 text-purple-300 flex items-center gap-1 w-fit px-2 py-0.5 text-xs"
          >
            <Tag className="w-3 h-3" />
            <span className="truncate">{category}</span>
          </Badge>
        </TableCell>

        {/* Start Time Cell */}
        <TableCell className="px-2 py-3 w-[100px]">
          <div className="text-white text-sm">{formatDate(startTime)}</div>
        </TableCell>

        {/* Prize Pool Cell */}
        <TableCell className="px-2 py-3 w-[100px]">
          <span className="font-mono text-emerald-300 text-sm">
            {formatPrizePool(prizePool, web3)}
          </span>
        </TableCell>

        {/* Listed By Cell */}
        <TableCell className="px-2 py-3 w-[100px]">
          <span className="text-slate-300 truncate text-sm">
            {listedBy.length > 6 ? `${listedBy.slice(0, 6)}...` : listedBy}
          </span>
        </TableCell>

        {/* Actions Cell */}
        <TableCell className="px-2 py-3 w-[160px] text-right">
          <div className="flex justify-end gap-1">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleDetails}
                    className={`h-7 w-7 p-0 ${
                      showDetails
                        ? "bg-indigo-500/20 text-indigo-300"
                        : "text-gray-400"
                    }`}
                  >
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
              className="h-7 text-gray-300 hover:text-indigo-300"
            >
              <Eye className="w-4 h-4" />
            </Button>

            {!isCompleted && isAwaitingResult && !isDeclaringWinner && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeclareWinnerClick}
                className="h-7 text-amber-300 border-amber-500/40 bg-amber-500/20"
              >
                <Award className="h-4 w-4" />
              </Button>
            )}
          </div>
          {isCompleted && winningOption && (
            <div className="mt-1 text-right">
              <div className="inline-flex items-center gap-1 text-xs text-emerald-300">
                <CheckCircle2 className="h-3 w-3" />
                <span>Winner: {winningOption}</span>
              </div>
            </div>
          )}
        </TableCell>
      </TableRow>

      {/* Details Row */}
      {showDetails && (
        <TableRow className="bg-indigo-900/10">
          <TableCell colSpan={8} className="p-0">
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Event Details */}
                <div className="space-y-2 p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-sm font-bold text-white">Details</h4>
                  </div>
                  <p className="text-slate-300 text-sm">
                    {description || "No description provided."}
                  </p>
                </div>

                {/* Timeline */}
                <div className="space-y-2 p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-bold text-white">Timeline</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Start:</span>
                      <span className="text-white">
                        {formatDate(startTime)} {formatTime(startTime)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">End:</span>
                      <span className="text-white">
                        {formatDate(endTime)} {formatTime(endTime)}
                      </span>
                    </div>
                    {isOngoing && timeUntilEnd > 0 && (
                      <div className="flex justify-between text-sm text-indigo-300">
                        <span>Time Left:</span>
                        <span>
                          {daysUntilEnd > 0 ? `${daysUntilEnd}d ` : ""}
                          {hoursUntilEnd > 0 || daysUntilEnd === 0
                            ? `${hoursUntilEnd}h `
                            : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2 p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">Options</h4>
                  </div>
                  <div className="space-y-1">
                    {options.length > 0 ? (
                      options.map((option: string, idx: number) => (
                        <div
                          key={idx}
                          className={`flex items-center p-2 text-sm rounded ${
                            winningOption === option
                              ? "bg-emerald-900/30 text-emerald-300"
                              : "bg-gray-700/40 text-slate-300"
                          }`}
                        >
                          {winningOption === option ? (
                            <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-400" />
                          ) : (
                            <div className="w-2 h-2 mr-2 rounded-full bg-gray-500"></div>
                          )}
                          <span>{option}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-3 text-slate-400 italic text-sm">
                        No options listed.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}

      {/* Declare Winner Row */}
      {isDeclaringWinner && (
        <TableRow className="bg-emerald-900/10">
          <TableCell colSpan={8} className="p-0">
            <div className="bg-gray-800 p-4 m-2 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Declare Winner</h3>
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
