import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { EventTableItem } from "./EventTableItem";
import { AlertCircle, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EventListTableProps {
  events: any[]; // Consider defining a more specific Event type if possible
  contract: any;
  web3: any;
  onWinnerDeclared: () => void;
}

export const EventListTable: React.FC<EventListTableProps> = ({
  events,
  contract,
  web3,
  onWinnerDeclared,
}) => {
  // --- Sorting logic remains the same ---
  const sortedEvents = [...events].sort((a, b) => {
    const aEnded = new Date(Number(a.endTime) * 1000) < new Date();
    const bEnded = new Date(Number(b.endTime) * 1000) < new Date();

    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1; // Completed last
    }
    if (!a.isCompleted && !b.isCompleted) {
      if (aEnded !== bEnded) {
        return aEnded ? -1 : 1; // Ended events (-1 means comes first)
      }
    }
    return Number(b.endTime) - Number(a.endTime); // Within groups, sort by end time descending
  });

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-4">
        <div className="relative w-full sm:w-64 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-secondary" />
          <Input
            placeholder="Search events..."
            className="pl-10 bg-primary/30 border-gray-700/40 text-dark-primary focus:border-secondary/60 focus:ring-secondary/30"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-primary/30 border-gray-700/40 text-dark-secondary hover:text-dark-primary hover:bg-primary/50"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Table Container */}
      <div className="bg-card rounded-xl shadow-lg border border-gray-700/60 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-secondary/30">
        <div className="overflow-x-auto bg-noise dark">
          <Table className="w-full min-w-[900px] border-collapse text-sm text-dark-primary">
            <TableCaption className="py-4 text-center text-xs text-dark-secondary/80">
              A list of betting events. Hover over rows for details or actions.
            </TableCaption>

            <TableHeader className="[&_tr]:border-b [&_tr]:border-gray-700/60 bg-primary/20">
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-dark-secondary whitespace-nowrap">
                  Status
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-dark-secondary whitespace-nowrap min-w-[100px]">
                  Event ID
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-dark-secondary min-w-[250px]">
                  Event Name
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-dark-secondary whitespace-nowrap min-w-[120px]">
                  Category
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-dark-secondary whitespace-nowrap min-w-[150px]">
                  Listed Date
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-dark-secondary whitespace-nowrap min-w-[120px]">
                  Volume (ETH)
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-dark-secondary whitespace-nowrap min-w-[150px]">
                  Listed By
                </TableHead>
                <TableHead className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-dark-secondary whitespace-nowrap min-w-[100px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-700/60">
              {sortedEvents.length === 0 ? (
                <TableRow className="transition-colors hover:bg-card/50">
                  <TableCell colSpan={8} className="px-4 py-10 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 py-8">
                      <div className="p-3 rounded-full bg-primary/40 text-dark-secondary">
                        <AlertCircle className="h-6 w-6" />
                      </div>
                      <p className="text-dark-secondary font-medium">
                        No events found
                      </p>
                      <p className="text-dark-secondary/70 text-sm">
                        Create one using the form!
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sortedEvents.map((event, index) => (
                  <EventTableItem
                    key={
                      event.eventId
                        ? `event-${Number(event.eventId)}`
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
      </div>

      {/* Pagination Controls */}
      {sortedEvents.length > 0 && (
        <div className="flex justify-between items-center pt-4 text-sm text-dark-secondary">
          <div>
            Showing{" "}
            <span className="font-medium text-dark-primary">
              {sortedEvents.length}
            </span>{" "}
            events
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="bg-primary/30 border-gray-700/40 text-dark-secondary"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled
              className="bg-primary/30 border-gray-700/40 text-dark-secondary"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
