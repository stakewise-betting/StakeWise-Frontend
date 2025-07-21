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
  const listedDate = new Date(
    Number(event.createdAt) * 1000
  ).toLocaleDateString();
  const startTime = new Date(Number(event.startTime) * 1000);
  // const endTime = new Date(Number(event.endTime) * 1000);
  const eventDate = startTime.toLocaleDateString();
  const eventStartTime = startTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const currentTime = Date.now();
  const startTimeMs = Number(event.startTime) * 1000;
  const timeRemaining = startTimeMs - currentTime;

  const formatTimeRemaining = () => {
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );

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
      navigator
        .share({
          title: title,
          text: description,
          url: window.location.href + "/bet/" + event.eventId,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard
        .writeText(window.location.href + "/bet/" + event.eventId)
        .then(() => alert("Link copied to clipboard!"))
        .catch((err) => console.error("Could not copy text: ", err));
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#1C1C27] to-[#252538] hover:from-[#252538] hover:to-[#2A2A3E] transition-all duration-300 rounded-none border-none">
      <CardContent className="p-8">
        <div className="grid gap-8 md:grid-cols-[280px,1fr]">
          {/* Image Column */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#333447] to-[#252538] p-1">
              <img
                src={image}
                alt={title}
                width={280}
                height={280}
                className="rounded-lg object-cover w-full h-[280px] transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] text-white px-3 py-2 rounded-lg text-sm font-semibold shadow-lg">
                {formatTimeRemaining()}
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="space-y-6 flex flex-col justify-between">
            {/* Top Section: Title and Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-[#E5E5E5] bg-clip-text text-transparent">
                  {title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                  <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                  <span>Listed on: {listedDate}</span>
                </div>
              </div>

              {/* Event Details Grid */}
              <div className="bg-gradient-to-br from-[#333447] to-[#2A2A3E] rounded-xl p-4 space-y-3 border border-[#404153]">
                <div className="grid grid-cols-[120px,1fr] text-sm items-center">
                  <div className="text-[#A1A1AA] flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#E27625]" />
                    <span>Event Date</span>
                  </div>
                  <div className="text-white font-medium">{eventDate}</div>
                </div>
                <div className="grid grid-cols-[120px,1fr] text-sm items-center">
                  <div className="text-[#A1A1AA] flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#3B82F6]" />
                    <span>Event Time</span>
                  </div>
                  <div className="text-white font-medium">{eventStartTime}</div>
                </div>
                <div className="grid grid-cols-[120px,1fr] text-sm items-center">
                  <div className="text-[#A1A1AA] flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#F59E0B]" />
                    <span>Venue</span>
                  </div>
                  <div className="text-white font-medium">{venue}</div>
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-gradient-to-br from-[#2A2A3E] to-[#333447] rounded-xl p-4 border border-[#404153]">
                <div className="text-[#A1A1AA] text-sm mb-2 font-medium">
                  Description
                </div>
                <div className="text-white text-sm leading-relaxed h-20 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#404153] hover:scrollbar-thumb-[#525266]">
                  {description}
                </div>
              </div>
            </div>

            {/* Bottom Section: Category and Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#404153]">
              <div className="flex flex-wrap gap-2">
                <div className="bg-gradient-to-r from-[#E27625] to-[#F59E0B] text-white px-3 py-2 rounded-lg text-sm font-semibold shadow-lg">
                  {category}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  className={`gap-2 font-medium transition-all duration-300 ${
                    isInterested
                      ? "bg-gradient-to-r from-[#F59E0B] to-[#E27625] text-white hover:from-[#E27625] hover:to-[#D97919] shadow-lg shadow-[#F59E0B]/20"
                      : "bg-gradient-to-r from-[#333447] to-[#404153] text-white hover:from-[#404153] hover:to-[#525266] border border-[#525266]"
                  }`}
                  onClick={handleInterestedClick}
                >
                  <Star
                    className={`h-4 w-4 transition-all duration-300 ${
                      isInterested
                        ? "fill-white text-white"
                        : "fill-transparent text-[#F59E0B]"
                    }`}
                  />
                  Interested {interested}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] text-white hover:from-[#1D4ED8] hover:to-[#1E40AF] shadow-lg transition-all duration-300"
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
