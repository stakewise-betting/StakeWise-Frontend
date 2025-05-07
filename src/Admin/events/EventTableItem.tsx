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
      "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap";

    if (isCompleted) {
      return (
        <Badge
          variant="default"
          className={`${baseClasses} bg-admin-success/10 text-admin-success border-admin-success/30`}
        >
          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
          <span>Completed</span>
        </Badge>
      );
    } else if (isAwaitingResult) {
      return (
        <Badge
          variant="default"
          className={`${baseClasses} bg-admin-warning/10 text-admin-warning border-admin-warning/30 animate-pulse`}
        >
          <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
          <span>Awaiting Result</span>
        </Badge>
      );
    } else if (isOngoing) {
      // Using admin.accent (teal) for Ongoing
      return (
        <Badge
          variant="default"
          className={`${baseClasses} bg-admin-accent/10 text-admin-accent border-admin-accent/30`}
        >
          <Clock className="h-3.5 w-3.5 flex-shrink-0" />
          <span>Ongoing</span>
        </Badge>
      );
    } else {
      // Scheduled - Neutral look
      return (
        <Badge
          variant="outline"
          className={`${baseClasses} bg-gray-500/5 text-dark-secondary border-gray-500/30`}
        >
          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
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
        className={`border-b border-gray-700/60 transition-colors duration-200 block md:table-row ${
          showDetails ? "bg-primary/30" : "hover:bg-card/50"
        } ${isDeclaringWinner ? "border-l-4 border-l-secondary" : ""} relative`} // Add left border when declaring
      >
        {/* Status Cell */}
        <TableCell className="p-3 md:px-4 md:py-3 align-middle block md:table-cell md:w-[130px] whitespace-nowrap">
          <DataLabel label="Status" />
          {getStatusBadge()}
        </TableCell>

        {/* Event ID Cell */}
        <TableCell className="p-3 md:px-4 md:py-3 align-middle block md:table-cell md:w-[110px]">
          <DataLabel label="ID" />
          <span className="font-mono text-xs text-dark-secondary">
            #{eventId}
          </span>
        </TableCell>

        {/* Event Name & Desc Cell */}
        <TableCell className="p-3 md:px-4 md:py-3 align-middle block md:table-cell md:min-w-[200px] md:max-w-[300px]">
          <DataLabel label="Event" />
          <div className="flex flex-col">
            <span
              className="font-medium text-dark-primary truncate"
              title={name}
            >
              {name}
            </span>
            {description && (
              <span
                className="text-xs text-dark-secondary truncate"
                title={description}
              >
                {description.length > 50
                  ? `${description.substring(0, 50)}...`
                  : description}
              </span>
            )}
          </div>
        </TableCell>

        {/* Category Cell */}
        <TableCell className="p-3 md:px-4 md:py-3 align-middle block md:table-cell md:w-[150px]">
          <DataLabel label="Category" />
          <Badge
            variant="outline"
            className="bg-secondary/10 text-secondary border-secondary/30 flex items-center gap-1 w-fit" // w-fit for mobile
          >
            <Tag className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{category}</span>
          </Badge>
        </TableCell>

        {/* Start Time Cell */}
        <TableCell className="p-3 md:px-4 md:py-3 align-middle block md:table-cell md:w-[160px]">
          <DataLabel label="Start Date" />
          <div className="flex items-center gap-1.5 text-xs text-dark-secondary whitespace-nowrap">
            <Calendar className="w-3.5 h-3.5 text-dark-secondary/70 flex-shrink-0" />
            <span>{formatDate(startTime)}</span>
          </div>
        </TableCell>

        {/* Prize Pool Cell */}
        <TableCell className="p-3 md:px-4 md:py-3 align-middle block md:table-cell md:w-[130px]">
          <DataLabel label="Volume" />
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <TrendingUp className="w-3.5 h-3.5 text-admin-success flex-shrink-0" />
            <span className="font-medium text-dark-primary">
              {formatPrizePool(prizePool, web3)}
            </span>
          </div>
        </TableCell>

        {/* Listed By Cell */}
        <TableCell className="p-3 md:px-4 md:py-3 align-middle block md:table-cell md:w-[160px]">
          <DataLabel label="Listed By" />
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Users className="w-3.5 h-3.5 text-dark-secondary/70 flex-shrink-0" />
            <span className="text-dark-secondary truncate">{listedBy}</span>
          </div>
        </TableCell>

        {/* Actions Cell */}
        <TableCell className="p-3 md:px-4 md:py-3 align-middle block md:table-cell md:w-[180px] text-left md:text-right">
          {/* <DataLabel label="Actions" /> */} {/* Label not needed here */}
          <div className="flex items-center md:justify-end gap-2 flex-wrap">
            {" "}
            {/* flex-wrap for mobile */}
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon" // Use icon size for consistency
                    onClick={toggleDetails}
                    className="text-dark-secondary hover:text-dark-primary hover:bg-primary/50 h-8 w-8"
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
            {/* "View" button can link to a dedicated event page if needed */}
            <Button
              variant="ghost"
              size="sm"
              className="text-dark-secondary hover:text-dark-primary hover:bg-primary/50"
              // onClick={() => navigate(`/event/${eventId}`)} // Example navigation
            >
              <Eye className="w-4 h-4 mr-1.5" />
              View
            </Button>
            {!isCompleted && isAwaitingResult && !isDeclaringWinner && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeclareWinnerClick}
                className="bg-admin-warning/10 border-admin-warning/40 text-admin-warning hover:bg-admin-warning/20 hover:border-admin-warning/60"
              >
                <Award className="h-4 w-4 mr-1.5" /> Declare
              </Button>
            )}
          </div>
          {isCompleted && winningOption && (
            <div className="mt-2 text-left md:text-right">
              {" "}
              {/* Align winner text */}
              <p
                className="text-xs text-admin-success font-semibold truncate inline-flex items-center gap-1"
                title={`Winner: ${winningOption}`}
              >
                <CheckCircle2 className="h-3 w-3" /> Winner: {winningOption}
              </p>
            </div>
          )}
        </TableCell>
      </TableRow>

      {/* Details Row / Section (conditional) */}
      {showDetails && (
        <TableRow className="bg-primary/20 block md:table-row">
          {/* On mobile, this cell spans the full width. On desktop, it spans all columns */}
          <TableCell colSpan={8} className="p-0 block md:table-cell">
            <div className="p-4 m-2 md:m-0 md:p-5 space-y-4 border-t border-gray-700/60 md:border-t-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Event Details */}
                <div className="space-y-3 p-3 bg-primary/30 rounded-lg border border-gray-700/40">
                  <h4 className="flex items-center gap-2 text-sm font-semibold uppercase text-dark-secondary tracking-wide">
                    <Info className="w-4 h-4" /> Event Details
                  </h4>
                  <p className="text-sm text-dark-primary leading-relaxed">
                    {description || "No description provided."}
                  </p>
                  <div className="flex items-center gap-2 text-sm pt-1">
                    <span className="text-dark-secondary">ID:</span>
                    <span className="font-mono text-xs text-dark-primary bg-primary/50 px-1.5 py-0.5 rounded">
                      #{eventId}
                    </span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-3 p-3 bg-primary/30 rounded-lg border border-gray-700/40">
                  <h4 className="flex items-center gap-2 text-sm font-semibold uppercase text-dark-secondary tracking-wide">
                    <Calendar className="w-4 h-4" /> Timeline
                  </h4>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-dark-secondary">Start:</span>
                      <span className="text-dark-primary text-right">
                        {formatDate(startTime)} @ {formatTime(startTime)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-dark-secondary">End:</span>
                      <span className="text-dark-primary text-right">
                        {formatDate(endTime)} @ {formatTime(endTime)}
                      </span>
                    </div>
                    {isOngoing && timeUntilEnd > 0 && (
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-dark-secondary">Time Left:</span>
                        <span className="text-admin-accent font-medium">
                          {daysUntilEnd > 0 ? `${daysUntilEnd}d ` : ""}
                          {hoursUntilEnd > 0 || daysUntilEnd === 0
                            ? `${hoursUntilEnd}h `
                            : ""}
                          remaining
                        </span>
                      </div>
                    )}
                    {isCompleted && (
                      <div className="flex justify-between items-center pt-1 text-admin-success">
                        <span className="font-medium">Event Completed</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    {isAwaitingResult && (
                      <div className="flex justify-between items-center pt-1 text-admin-warning">
                        <span className="font-medium">Awaiting Result</span>
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3 p-3 bg-primary/30 rounded-lg border border-gray-700/40">
                  <h4 className="flex items-center gap-2 text-sm font-semibold uppercase text-dark-secondary tracking-wide">
                    <Tag className="w-4 h-4" /> Options
                  </h4>
                  <div className="space-y-1.5">
                    {options.length > 0 ? (
                      options.map((option: string, idx: number) => (
                        <div
                          key={idx}
                          className={`flex items-center text-sm p-1.5 rounded transition-colors ${
                            winningOption === option
                              ? "bg-admin-success/20 text-admin-success font-medium"
                              : "text-dark-primary"
                          }`}
                        >
                          {winningOption === option && (
                            <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" />
                          )}
                          <span className="truncate">{option}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-dark-secondary italic">
                        No options listed.
                      </p>
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
        <TableRow className="bg-primary/10 block md:table-row">
          {/* On mobile, this cell spans the full width. On desktop, it spans all columns */}
          <TableCell colSpan={8} className="p-0 block md:table-cell">
            <div className="bg-card p-4 rounded-lg m-2 border border-secondary/50 shadow-md">
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
