import { FC } from "react";
import { Star, Share2, Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

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
  onInterestedClick?: () => void;
  // Other potential blockchain properties
}

interface EventCardProps {
  event: BlockchainEvent;
}

export const UpcomingCard: FC<EventCardProps> = ({ event }) => {
  // ... (keep all the existing code for data extraction, formatting, handlers etc.)
  const title = event.name;
  const image = event.imageURL || "/placeholder.svg";
  const listedDate = new Date(Number(event.createdAt) * 1000).toLocaleDateString();
  const startTime = new Date(Number(event.startTime) * 1000);
  const endTime = new Date(Number(event.endTime) * 1000);
  const eventDate = startTime.toLocaleDateString();
  const eventStartTime = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const eventEndTime = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentTime = Date.now();
  const startTimeMs = Number(event.startTime) * 1000;
  const timeRemaining = startTimeMs - currentTime;

  const formatTimeRemaining = () => {
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

    if (timeRemaining <= 0) {
        return "Event started"; // Or handle as needed
    }
    if (days > 0) {
      return `${days}d ${hours}h remaining`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else if (minutes > 0) {
        return `${minutes}m remaining`;
    } else {
      return "Starting soon";
    }
  };
  const venue = "Venue not specified"; // Replace with event.venue when available
  const description = event.description;
  const category = event.category || "Event";
  const interested = event.interestedCount || 0;
  const isInterested = event.isUserInterested || false;

  const handleInterestedClick = () => {
    if (event.onInterestedClick) {
      event.onInterestedClick();
    }
  };

  const handleShare = () => {
    // ... (share handler code remains the same)
    if (navigator.share) {
        navigator.share({
          title: title,
          text: description,
          url: window.location.href + "/bet/" + event.eventId,
        }).catch((error) => console.log('Error sharing', error));
      } else {
        // Fallback for browsers that don't support navigator.share
        navigator.clipboard.writeText(window.location.href + "/bet/" + event.eventId)
          .then(() => alert("Link copied to clipboard!"))
          .catch((err) => console.error("Could not copy text: ", err));
      }
  };


  return (
    // Using border-t instead of style for consistency if possible
    <div className="bg-[#1C1C27] rounded-none border-t border-[#8488AC]">
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-[240px,1fr]">
          {/* Image Column */}
          <div className="relative">
            <img
              src={image}
              alt={title}
              width={240}
              height={240}
              className="rounded-lg object-cover w-full h-[240px]" // Ensure height is fixed
            />
            <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
              {formatTimeRemaining()}
            </div>
          </div>

          {/* Details Column */}
          <div className="space-y-4 flex flex-col justify-between"> {/* Added flex flex-col justify-between */}
            {/* Top Section: Title, Dates, Venue */}
            <div className="space-y-2"> {/* Grouped top info */}
                <div>
                    <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
                    <div className="text-sm text-gray-400">Listed on: {listedDate}</div>
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
                    <div className="text-white">{eventStartTime} - {eventEndTime}</div>
                </div>
                <div className="grid grid-cols-[100px,1fr] text-sm">
                    <div className="text-gray-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>Venue</span>
                    </div>
                    <div className="text-white">{venue}</div>
                </div>

                {/* --- Description Section --- */}
                <div className="grid grid-cols-[100px,1fr] text-sm">
                    <div className="text-gray-400">Description</div>
                    {/*
                      - h-16: Fixed height (adjust if needed)
                      - overflow-y-auto: Enable vertical scroll on overflow
                      - pr-2: Padding for scrollbar space
                      - scrollbar-thin: Makes scrollbar thinner
                      - scrollbar-track-transparent: Makes the track bg invisible
                      - scrollbar-thumb-[#333447]: Sets thumb color
                      - hover:scrollbar-thumb-[#4A4E68]: Sets thumb hover color (optional)
                    */}
                    <div className="text-white h-16 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#333447] hover:scrollbar-thumb-[#4A4E68]">
                        {description}
                    </div>
                </div>
                 {/* --- End of Description Section --- */}
            </div>


            {/* Bottom Section: Tags and Actions */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex flex-wrap gap-2">
                <Button className="bg-[#333447] text-white hover:bg-[#4A4E68]" variant="secondary" size="sm">
                  {category}
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="secondary" className="text-white gap-2 bg-[#333447] hover:bg-[#4A4E68]" onClick={handleInterestedClick}>
                  <Star
                  className={`h-4 w-4 transition-colors duration-300 ${
                    isInterested ? "fill-yellow-500 text-yellow-500" : "fill-transparent text-yellow-500" }`}/>
                  Interested {interested}
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