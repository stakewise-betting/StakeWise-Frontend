// components/admin/events/EventListTable.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table"; // Assuming this path is correct for Shadcn UI components
import { EventTableItem } from "./EventTableItem";

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
    // Wrapper: Provides background, padding, rounded corners, shadow, border, and overflow handling
    <div className="bg-card rounded-xl shadow-lg border border-gray-700/60 overflow-hidden">
      {/* Inner wrapper for horizontal scrolling on smaller screens */}
      <div className="overflow-x-auto bg-noise dark">
        {" "}
        {/* Added bg-noise and dark context */}
        <Table className="w-full min-w-[900px] border-collapse text-sm text-dark-primary">
          {/* Table Caption: Themed text, centered, padding */}
          <TableCaption className="py-4 text-center text-xs text-dark-secondary/80">
            A list of betting events. Hover over rows for details or actions.
          </TableCaption>

          {/* Table Header: Subtle background, bottom border */}
          <TableHeader className="[&_tr]:border-b [&_tr]:border-gray-700/60">
            {/* Header Row: Disable hover effect */}
            <TableRow className="hover:bg-transparent">
              {/* Header Cells: Themed text, padding, alignment, font style, prevent wrapping */}
              <TableHead className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-dark-secondary whitespace-nowrap">
                Status
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-dark-secondary whitespace-nowrap min-w-[100px]">
                Event ID
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-dark-secondary min-w-[250px]">
                {" "}
                {/* Increased min-width */}
                Event Name
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-dark-secondary whitespace-nowrap min-w-[120px]">
                Category
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-dark-secondary whitespace-nowrap min-w-[150px]">
                Listed Date
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-dark-secondary whitespace-nowrap min-w-[120px]">
                Volume (ETH) {/* Added unit for clarity */}
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-dark-secondary whitespace-nowrap min-w-[150px]">
                Listed By
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-dark-secondary whitespace-nowrap min-w-[100px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* Table Body: Row divider */}
          <TableBody className="divide-y divide-gray-700/60">
            {sortedEvents.length === 0 ? (
              // Empty State Row: Centered text, padding, themed colors
              <TableRow className="transition-colors hover:bg-card/50">
                {" "}
                {/* Consistent hover */}
                <TableCell
                  colSpan={8} // Match number of columns
                  className="px-4 py-10 text-center text-dark-secondary italic"
                >
                  No events found. Create one using the form!
                </TableCell>
              </TableRow>
            ) : (
              // Render Event Items: Each item is responsible for its own TableRow & TableCells
              // Assumes EventTableItem applies appropriate row hover styles and cell padding/alignment internally.
              sortedEvents.map((event, index) => (
                <EventTableItem
                  key={
                    event.eventId
                      ? `event-${Number(event.eventId)}`
                      : `event-index-${index}` // Use index as fallback key
                  }
                  event={event}
                  contract={contract}
                  web3={web3}
                  onWinnerDeclared={onWinnerDeclared}
                  // It's crucial that EventTableItem renders a <TableRow>
                  // with classes like: "transition-colors hover:bg-card/50"
                  // and <TableCell> with classes like: "px-4 py-3 align-middle"
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
