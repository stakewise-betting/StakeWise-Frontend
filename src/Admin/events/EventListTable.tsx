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
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-end items-center px-4 py-3 md:px-6 md:py-4 border-b border-gray-700/60 bg-primary/20">
        {/* Search Input */}
        <div className="relative w-full md:w-auto md:max-w-xs flex-grow md:flex-grow-0">
          {" "}
          {/* Grow on mobile, fixed on md+ */}
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-secondary pointer-events-none" />
          <Input
            type="search"
            placeholder="Search by name, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full bg-primary/50 border-gray-600/80 text-dark-primary focus:border-secondary/60 focus:ring-1 focus:ring-secondary/30 rounded-md shadow-sm h-9" // Adjusted height
          />
        </div>
        {/* Filter Button */}
        <Button
          variant="outline"
          size="sm" // Consistent small size
          className="w-full md:w-auto bg-primary/40 border-gray-600/80 text-dark-secondary hover:text-dark-primary hover:bg-primary/60 rounded-md shadow-sm flex-shrink-0 h-9" // Added flex-shrink-0, adjusted height
          // onClick={() => {/* Open filter modal/popover */}}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
      {/* --- End Search/Filter Controls --- */}

      {/* Table Container - Added overflow-x-auto for horizontal scroll on smaller screens if table is too wide */}
      <div className="overflow-x-auto bg-noise">
        {/* The Table component itself */}
        <Table className="w-full border-collapse text-sm text-dark-primary">
          {/* No caption needed if info is elsewhere */}
          {/* <TableCaption>...</TableCaption> */}

          {/* Header hidden on small screens, displayed as table header group on medium+ */}
          <TableHeader className="hidden md:table-header-group [&_tr]:border-b [&_tr]:border-gray-700/60 bg-primary/10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-secondary whitespace-nowrap w-[130px]">
                Status
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-secondary whitespace-nowrap w-[110px]">
                Event ID
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-secondary min-w-[200px]">
                Event Name
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-secondary whitespace-nowrap w-[150px]">
                Category
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-secondary whitespace-nowrap w-[160px]">
                Start Date
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-secondary whitespace-nowrap w-[130px]">
                Volume
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-secondary whitespace-nowrap w-[160px]">
                Listed By
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-dark-secondary whitespace-nowrap w-[180px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="[&_tr:last-child]:border-0">
            {filteredEvents.length === 0 ? (
              <TableRow className="block md:table-row hover:bg-transparent">
                <TableCell
                  colSpan={8}
                  className="block md:table-cell px-4 py-10 md:text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                    <div className="p-3 rounded-full bg-primary/40 text-dark-secondary">
                      <AlertCircle className="h-8 w-8" />
                    </div>
                    <p className="text-dark-primary font-semibold mt-2">
                      {searchTerm || Object.keys(activeFilters).length > 0
                        ? "No events match filters"
                        : "No events found"}
                    </p>
                    <p className="text-dark-secondary/70 text-sm max-w-xs">
                      {searchTerm || Object.keys(activeFilters).length > 0
                        ? "Try adjusting your search or filters."
                        : "Check back later or create a new event."}
                    </p>
                    {(searchTerm || Object.keys(activeFilters).length > 0) && (
                      <Button
                        variant="link" // Use link variant for less emphasis
                        size="sm"
                        onClick={() => {
                          setSearchTerm(""); /* clear filters */
                        }}
                        className="mt-2 text-secondary hover:text-secondary/80 h-auto p-0" // Link styling
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
      {filteredEvents.length > 10 && ( // Example: show pagination if more than 10 items
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 md:px-6 md:py-4 border-t border-gray-700/60 text-xs md:text-sm text-dark-secondary gap-2">
          <div>
            Showing <span className="font-medium text-dark-primary">1</span>-
            <span className="font-medium text-dark-primary">
              {Math.min(filteredEvents.length, 10)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-dark-primary">
              {filteredEvents.length}
            </span>{" "}
            results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="bg-primary/30 border-gray-700/40 text-dark-secondary h-8"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled
              className="bg-primary/30 border-gray-700/40 text-dark-secondary h-8"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
