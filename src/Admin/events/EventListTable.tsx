// components/admin/events/EventListTable.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { EventTableItem } from "./EventTableItem";
import { AlertCircle, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Web3 from "web3";

interface EventListTableProps {
  events: any[];
  contract: any;
  web3: Web3 | null;
  onWinnerDeclared: () => void;
}

export const EventListTable: React.FC<EventListTableProps> = ({
  events,
  contract,
  web3,
  onWinnerDeclared,
}) => {
  // --- Sorting logic (remains the same) ---
  const sortedEvents = [...(events || [])].sort((a, b) => {
    const aIsCompleted = Boolean(a?.isCompleted);
    const bIsCompleted = Boolean(b?.isCompleted);
    const aEndTime = Number(a?.endTime || 0) * 1000;
    const bEndTime = Number(b?.endTime || 0) * 1000;
    const now = Date.now();
    const aEnded = aEndTime < now;
    const bEnded = bEndTime < now;

    if (aIsCompleted !== bIsCompleted) return aIsCompleted ? 1 : -1;
    if (!aIsCompleted && !bIsCompleted) {
      if (aEnded !== bEnded) return aEnded ? -1 : 1;
    }
    return bEndTime - aEndTime;
  });

  // Placeholder state for search/filter
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeFilters] = React.useState({});

  // Example filtering logic (implement actual filtering as needed)
  const filteredEvents = sortedEvents.filter((event) => {
    if (!event) return false; // Handle null/undefined events
    const lowerSearchTerm = searchTerm.toLowerCase();
    const nameMatch = event.name?.toLowerCase().includes(lowerSearchTerm);
    const idMatch = event.eventId?.toString().includes(searchTerm);
    // Add more fields to search if needed (e.g., description, category)
    return nameMatch || idMatch; // Combine with actual filter logic later
  });

  return (
    // Removed outer space-y-4, padding/margins handled by parent or within this component
    <div className="w-full">
      {/* --- Search and Filter Controls - Revised Layout --- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center px-6 py-5 border-b border-gray-700/30 bg-[#1C1C27] backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <h2 className="text-lg font-semibold text-white">Event Overview</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            <Input
              type="search"
              placeholder="Search events by name, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 w-full bg-gray-800/20 border-gray-600/20 text-white placeholder:text-gray-300 focus:border-indigo-500/50 focus:ring-indigo-500/30 focus:bg-gray-800/30 rounded-xl font-medium shadow-lg backdrop-blur-sm hover:border-gray-500/30 hover:bg-gray-800/25 transition-all duration-300"
            />
          </div>

          {/* Filter Button */}
          <Button
            variant="outline"
            size="sm"
            className="h-12 bg-gradient-to-r from-secondary/20 to-secondary/10 border-secondary/40 text-secondary hover:from-secondary/30 hover:to-secondary/20 hover:border-secondary/60 transition-all duration-300 rounded-xl px-6 font-medium shadow-lg backdrop-blur-sm"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </Button>
        </div>
      </div>
      {/* --- End Search/Filter Controls --- */}

      {/* Table Container - Improved responsive design */}
      <div className="overflow-x-auto bg-[#1C1C27] rounded-xl border border-gray-700/30 backdrop-blur-sm">
        {/* The Table component itself */}
        <Table className="w-full border-collapse text-sm text-white">
          {/* Header hidden on small screens, displayed as table header group on medium+ */}
          <TableHeader className="hidden md:table-header-group [&_tr]:border-b [&_tr]:border-gray-700/30 bg-[#1C1C27] backdrop-blur-sm">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-300 whitespace-nowrap w-[100px]">
                Status
              </TableHead>
              <TableHead className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-300 whitespace-nowrap w-[80px]">
                ID
              </TableHead>
              <TableHead className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-300 min-w-[180px]">
                Event Details
              </TableHead>
              <TableHead className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-300 whitespace-nowrap w-[100px]">
                Category
              </TableHead>
              <TableHead className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-300 whitespace-nowrap w-[110px]">
                Start Date
              </TableHead>
              <TableHead className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-300 whitespace-nowrap w-[100px]">
                Volume
              </TableHead>
              <TableHead className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-300 whitespace-nowrap w-[110px]">
                Listed By
              </TableHead>
              <TableHead className="px-3 py-3 text-right text-xs font-bold uppercase tracking-wider text-indigo-300 whitespace-nowrap w-[120px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="[&_tr:last-child]:border-0">
            {filteredEvents.length === 0 ? (
              <TableRow className="block md:table-row hover:bg-transparent">
                <TableCell
                  colSpan={8}
                  className="block md:table-cell px-6 py-12 md:text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
                    <div className="relative">
                      <div className="p-6 rounded-2xl bg-[#1C1C27] border border-gray-600/30">
                        <AlertCircle className="h-12 w-12 text-slate-400 mx-auto" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-white">
                        {searchTerm || Object.keys(activeFilters).length > 0
                          ? "No events match your criteria"
                          : "No events found"}
                      </h3>
                      <p className="text-slate-400 max-w-md leading-relaxed">
                        {searchTerm || Object.keys(activeFilters).length > 0
                          ? "Try adjusting your search terms or filters to find what you're looking for."
                          : "Get started by creating your first betting event. It only takes a few minutes!"}
                      </p>
                    </div>
                    {(searchTerm || Object.keys(activeFilters).length > 0) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchTerm("");
                        }}
                        className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600/30 hover:to-purple-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg px-6 py-2 font-medium transition-all duration-300"
                      >
                        Clear Search & Filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event, index) => (
                <EventTableItem
                  key={
                    event?.eventId
                      ? `event-${event.eventId.toString()}`
                      : `event-index-${index}`
                  }
                  event={event}
                  contract={contract}
                  web3={web3}
                  onWinnerDeclared={onWinnerDeclared}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls (Optional - keep if needed) */}
      {filteredEvents.length > 10 && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-5 border-t border-gray-700/30 bg-[#1C1C27] text-sm gap-4 backdrop-blur-sm">
          <div className="text-slate-300">
            Showing{" "}
            <span className="font-semibold text-white bg-gray-700/30 px-2 py-1 rounded-lg">
              1
            </span>{" "}
            -{" "}
            <span className="font-semibold text-white bg-gray-700/30 px-2 py-1 rounded-lg">
              {Math.min(filteredEvents.length, 10)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-emerald-300">
              {filteredEvents.length}
            </span>{" "}
            events
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="h-10 bg-gray-700/30 border-gray-600/30 text-gray-400 cursor-not-allowed rounded-lg px-4"
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <span className="text-white font-medium">Page 1</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled
              className="h-10 bg-gray-700/30 border-gray-600/30 text-gray-400 cursor-not-allowed rounded-lg px-4"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
