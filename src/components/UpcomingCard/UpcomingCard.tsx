import { FC } from "react";
import { Share2, Calendar, Clock, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

// Define the structure for the event data, including the click handler
interface BlockchainEvent {
  eventId: string;
  name: string;
  imageURL: string;
  description: string;
  createdAt: string | number;
  startTime: string | number;
  endTime: string | number;
  interestedCount: number;
  isUserInterested: boolean;
  tags: string[];
  category: string;
  onInterestedClick: (eventId: string) => void;
}

// Define the props for the UpcomingCard component
interface EventCardProps {
  event: BlockchainEvent;
  currentUserId?: string; // Optional: The ID of the currently logged-in user
}

// This is the functional component that renders the event card
export const UpcomingCard: FC<EventCardProps> = ({ event, currentUserId }) => {
  // --- Data Extraction and Formatting ---
  const title = event.name;
  const image = event.imageURL || "/placeholder.svg";
  //const listedDate = new Date(Number(event.createdAt) * 1000).toLocaleDateString();
  const startTime = new Date(Number(event.startTime) * 1000);
  //const endTime = new Date(Number(event.endTime) * 1000);
  const eventDate = startTime.toLocaleDateString();
  const eventStartTime = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const venue = "Venue not specified"; // Replace with event.venue when available
  const description = event.description;
  const category = event.category || "Event";
  const interested = event.interestedCount || 0;
  const isInterested = event.isUserInterested || false;
  
  // --- Time Remaining Calculation ---
  const formatTimeRemaining = () => {
    const currentTime = Date.now();
    const startTimeMs = Number(event.startTime) * 1000;
    const timeRemaining = startTimeMs - currentTime;

    if (timeRemaining <= 0) {
      return "Event started";
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h remaining`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    if (minutes > 0) {
      return `${minutes}m remaining`;
    }
    return "Starting soon";
  };

  // --- Share Handler ---
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: window.location.href + "/bet/" + event.eventId, // Adjust URL as needed
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href + "/bet/" + event.eventId)
        .then(() => alert("Event link copied to clipboard!"))
        .catch((err) => console.error("Could not copy event link: ", err));
    }
  };

  return (
    <div className="bg-[#1C1C27] rounded-none border-t border-[#8488AC]">
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-[240px,1fr]">
          {/* Image Column */}
          <div className="relative">
            <img
              src={image}
              alt={title}
              width={244}
              height={244}
              className="rounded-lg object-cover w-full h-[240px]"
            />
            <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
              {formatTimeRemaining()}
            </div>
          </div>

          {/* Details Column */}
          <div className="space-y-4 flex flex-col justify-between">
            {/* Top Section: Title, Dates, Venue */}
            <div className="space-y-2">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
                <div className="text-sm text-gray-400">Listed on: {eventDate}</div>
              </div>
              <div className="grid grid-cols-[100px,1fr] text-sm">
                <div className="text-gray-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Event Date</span>
                </div>
                <div className="text-white">{eventDate}</div>
              </div>
              <div className="grid grid-cols-[100px,1fr] text-sm">
                <div className="text-gray-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Event Time</span>
                </div>
                <div className="text-white">{eventStartTime}</div>
              </div>
              <div className="grid grid-cols-[100px,1fr] text-sm">
                <div className="text-gray-400 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>Venue</span>
                </div>
                <div className="text-white">{venue}</div>
              </div>
              <div className="grid grid-cols-[100px,1fr] text-sm">
                <div className="text-gray-400">Description</div>
                <div className="text-white h-16 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#333447] hover:scrollbar-thumb-[#4A4E68]">
                  {description}
                </div>
              </div>
            </div>

            {/* Bottom Section: Tags and Actions */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex flex-wrap gap-2">
                <Button className="bg-[#333447] text-white hover:bg-[#4A4E68]" variant="secondary" size="sm">
                  {category}
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="secondary"
                  className="text-white gap-2 bg-[#333447] hover:bg-[#4A4E68]"
                  onClick={() => event.onInterestedClick(event.eventId)}
                  disabled={!currentUserId} // Button is disabled if no user is logged in
                  title={!currentUserId ? "Login to show interest" : "Interested"}
                >
                  <Heart
                    className={`h-4 w-4 transition-colors duration-300 ${
                      isInterested ? "fill-red-500 text-red-500" : "fill-transparent text-red-500"
                    }`}
                  />
                  {/* Interested */}
                  Likes {interested}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-[#333447] text-white hover:bg-[#4A4E68]"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
};