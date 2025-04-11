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
} from "@/components/ui/table";
import { EventTableItem } from "./EventTableItem";

interface EventListTableProps {
  events: any[];
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
    // ...(your sorting logic)...
    const aEnded = new Date(Number(a.endTime) * 1000) < new Date();
    const bEnded = new Date(Number(b.endTime) * 1000) < new Date();

    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    if (!a.isCompleted && !b.isCompleted) {
      if (aEnded !== bEnded) {
        return aEnded ? -1 : 1;
      }
    }
    return Number(b.endTime) - Number(a.endTime);
  });

  return (
    <Table>
      <TableCaption>A list of betting events.</TableCaption>
      <TableHeader>
        {/* Ensure NO whitespace/newlines directly inside this TableRow tag */}
        {/* Before the first TableHead or after the last TableHead */}
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Event ID</TableHead>
          <TableHead>Event Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Listed Date</TableHead>
          <TableHead>Volume</TableHead>
          <TableHead>Listed By</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
        {/* No whitespace here either */}
      </TableHeader>
      <TableBody>
        {sortedEvents.length === 0 ? (
          // Check this TableRow too for whitespace
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              No events found.
            </TableCell>
          </TableRow>
        ) : (
          sortedEvents.map((event) => (
            <EventTableItem
              key={
                event.eventId
                  ? `event-${Number(event.eventId)}`
                  : `event-index-${Math.random()}`
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
  );
};
