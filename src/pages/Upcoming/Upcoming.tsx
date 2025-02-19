import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UpcomingCard } from "@/components/UpcomingCard/UpcomingCard";
import FilterSidebar from "@/components/dropdownMenu/DropdownMenu";
import upcomingEvents from "@/data/upcomingEvent.json";

export default function Page() {
  // Initialize state with isInterested property
  const [events, setEvents] = useState(
    upcomingEvents.map((event) => ({
      ...event,
      isInterested: false, // Initially no interest shown
    }))
  );

  const filterItems = [
    { title: "Categories", items: [
      { name: "Politics", count: 21 },
      { name: "Sports", count: 32 },
      { name: "Games", count: 12 },
    ] },
    { title: "Locations", items: [
      { name: "USA", count: 12 },
      { name: "Sri Lanka", count: 34 },
      { name: "India", count: 8 },
      { name: "Australia", count: 15 },
    ] },
    { title: "Date Range", items: [
      { name: "Today", count: 9 },
      { name: "This Weekend", count: 14 },
      { name: "Next Week", count: 8 },
      { name: "Next 3 Months", count: 45 },
    ] },
  ];

  // Toggle interested state for an event
  const handleInterestedClick = (index: number) => {
    setEvents((prevEvents) =>
      prevEvents.map((event, i) =>
        i === index
          ? {
              ...event,
              isInterested: !event.isInterested, // Toggle interest
              interested: event.isInterested ? event.interested - 1 : event.interested + 1, // Increase or decrease count
            }
          : event
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#1C1C27] p-8">
      <h1 className="text-2xl font-bold text-white mb-8">Upcoming Events</h1>

      <div className="grid gap-6 md:grid-cols-[240px,1fr]">
        <div className="space-y-6">
          {filterItems.map((filter, index) => (
            <FilterSidebar key={index} title={filter.title} items={filter.items} />
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1 border-2 border-[#333447] rounded-lg">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8488AC]" />
              <Input className="pl-10 bg-[#1C1C27] placeholder-[#8488AC] text-white border-none focus:border-transparent outline-none focus:outline-none focus:ring-0" placeholder="Search by name" />
            </div>
            <Button variant="secondary" className="bg-[#333447] hover:bg-[#4A4E68]">Trending</Button>
            <Button variant="secondary" className="bg-[#333447] hover:bg-[#4A4E68]">New</Button>
          </div>

          <div className="space-y-6">
            {events.map((event, index) => (
              <UpcomingCard
                key={index}
                title={event.title}
                listedDate={event.listedDate}
                date={event.date}
                venue={event.venue}
                description={event.description}
                image={event.image}
                tags={event.tags}
                interested={event.interested}
                isInterested={event.isInterested}
                onInterestedClick={() => handleInterestedClick(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
