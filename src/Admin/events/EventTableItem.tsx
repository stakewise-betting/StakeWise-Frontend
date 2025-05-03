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

  // Add debugging to verify event data
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
  const options = event?.options || [];
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
    if (isCompleted) {
      return (
        <Badge
          variant="default"
          className="bg-admin-success/20 text-admin-success border border-admin-success/30 flex items-center gap-1.5 px-2 py-0.5 rounded-full"
        >
          <CheckCircle2 className="h-3 w-3" />
          <span>Completed</span>
        </Badge>
      );
    } else if (isAwaitingResult) {
      return (
        <Badge
          variant="default"
          className="bg-admin-warning/20 text-warning-DEFAULT border border-admin-warning/30 flex items-center gap-1.5 px-2 py-0.5 rounded-full"
        >
          <AlertTriangle className="h-3 w-3" />
          <span>Awaiting Result</span>
        </Badge>
      );
    } else if (isOngoing) {
      return (
        <Badge
          variant="secondary"
          className="bg-secondary/20 text-secondary border border-secondary/30 flex items-center gap-1.5 px-2 py-0.5 rounded-full"
        >
          <Clock className="h-3 w-3" />
          <span>Ongoing</span>
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-primary/20 text-dark-secondary border border-gray-700/30 flex items-center gap-1.5 px-2 py-0.5 rounded-full"
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
    if (!web3Instance) {
      return "0.00 ETH";
    }

    if (!prizePoolWei || prizePoolWei === "0" || prizePoolWei === undefined) {
      return "0.00 ETH";
    }

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

  // Format date for display
  const formatDate = (timestamp: number) => {
    try {
      return new Date(timestamp).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Format time for display
  const formatTime = (timestamp: number) => {
    try {
      return new Date(timestamp).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Time";
    }
  };

  return (
    <>
      {/* Main Data Row */}
      <TableRow
        key={eventId}
        className={`transition-all duration-300 ${
          showDetails ? "bg-primary/30" : "hover:bg-card/50"
        }`}
      >
        <TableCell className="px-4 py-3 align-middle">
          {getStatusBadge()}
        </TableCell>

        <TableCell className="px-4 py-3 align-middle font-mono text-xs text-dark-secondary">
          #{eventId}
        </TableCell>

        <TableCell className="px-4 py-3 align-middle">
          <div className="flex flex-col">
            <span
              className="font-medium text-dark-primary truncate max-w-[240px]"
              title={name}
            >
              {name}
            </span>
            {event?.description && (
              <span
                className="text-xs text-dark-secondary truncate max-w-[240px]"
                title={event.description}
              >
                {event.description.length > 50
                  ? `${event.description.substring(0, 50)}...`
                  : event.description}
              </span>
            )}
          </div>
        </TableCell>

        <TableCell className="px-4 py-3 align-middle">
          <Badge
            variant="outline"
            className="bg-secondary/10 text-secondary border-secondary/30 flex items-center gap-1"
          >
            <Tag className="w-3 h-3" />
            {category}
          </Badge>
        </TableCell>

        <TableCell className="px-4 py-3 align-middle text-xs text-dark-secondary">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-dark-secondary/70" />
            {formatDate(startTime)}
          </div>
        </TableCell>

        <TableCell className="px-4 py-3 align-middle">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-admin-success" />
            <span className="font-medium">
              {formatPrizePool(prizePool, web3)}
            </span>
          </div>
        </TableCell>

        <TableCell className="px-4 py-3 align-middle">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-dark-secondary/70" />
            <span className="text-dark-secondary">{listedBy}</span>
          </div>
        </TableCell>

        <TableCell className="px-4 py-3 align-middle text-right">
          <div className="flex items-center justify-end gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleDetails}
                    className="text-dark-secondary hover:text-dark-primary hover:bg-primary/50 p-1 h-8 w-8"
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
              className="text-dark-secondary hover:text-dark-primary hover:bg-primary/50"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>

            {!isCompleted && isAwaitingResult && !isDeclaringWinner && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeclareWinnerClick}
                className="bg-secondary/20 border-secondary/60 text-secondary hover:bg-secondary/30"
              >
                <Award className="h-4 w-4 mr-1" /> Declare
              </Button>
            )}
          </div>

          {isCompleted && winningOption && (
            <p
              className="text-xs text-admin-success font-semibold mt-1 truncate"
              title={`Winner: ${winningOption}`}
            >
              Winner: {winningOption}
            </p>
          )}
        </TableCell>
      </TableRow>

      {/* Details Row (conditional) */}
      {showDetails && (
        <TableRow className="bg-primary/30">
          <TableCell colSpan={8} className="p-0 border-t-0">
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-dark-secondary">
                    Event Details
                  </h4>
                  <p className="text-sm text-dark-primary">{description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-dark-secondary">ID:</span>
                    <span className="font-mono text-dark-primary">
                      #{eventId}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-dark-secondary">
                    Timeline
                  </h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-secondary">Start:</span>
                      <span className="text-dark-primary">
                        {formatDate(startTime)} {formatTime(startTime)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-secondary">End:</span>
                      <span className="text-dark-primary">
                        {formatDate(endTime)} {formatTime(endTime)}
                      </span>
                    </div>
                    {isOngoing && (
                      <div className="flex justify-between text-sm">
                        <span className="text-dark-secondary">Time Left:</span>
                        <span className="text-secondary font-medium">
                          {daysUntilEnd > 0 ? `${daysUntilEnd}d ` : ""}
                          {hoursUntilEnd}h remaining
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-dark-secondary">
                    Options
                  </h4>
                  <div className="space-y-1">
                    {options.map((option: string, idx: number) => (
                      <div
                        key={idx}
                        className={`flex items-center text-sm p-1 rounded ${
                          winningOption === option
                            ? "bg-admin-success/20 text-admin-success"
                            : ""
                        }`}
                      >
                        {winningOption === option && (
                          <CheckCircle2 className="h-3 w-3 mr-1.5" />
                        )}
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}

      {/* Declare Winner Row (conditional) */}
      {isDeclaringWinner && (
        <TableRow>
          <TableCell colSpan={8} className="p-0 border-t-0">
            <div className="bg-primary/30 p-4 rounded-lg m-2 border border-gray-700/40">
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
