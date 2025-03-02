// components/admin/EventList.tsx
import React from "react";
import { EventItem } from "./EventItem";

interface EventListProps {
  events: any[];
  contract: any;
  web3: any;
  onWinnerDeclared: () => void;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  contract,
  web3,
  onWinnerDeclared,
}) => {
  return (
    <section>
      <h2 className="text-xl font-semibold text-black mb-4">Events List</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        events.map((event) => (
          <EventItem
            key={Number(event.eventId)}
            event={event}
            contract={contract}
            web3={web3}
            onWinnerDeclared={onWinnerDeclared}
          />
        ))
      )}
    </section>
  );
};
