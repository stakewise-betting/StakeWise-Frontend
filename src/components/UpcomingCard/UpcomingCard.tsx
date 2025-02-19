import { Star, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EventCardProps {
  title: string;
  listedDate: string;
  date: string;
  venue: string;
  description: string;
  image: string;
  tags: string[];
  interested: number;
  isInterested: boolean;
  onInterestedClick: () => void;
}

export function UpcomingCard({
  title,
  image,
  listedDate,
  date,
  venue,
  description,
  tags,
  interested,
  isInterested,
  onInterestedClick,
}: EventCardProps) {
  return (
    <Card className="bg-[#23232D] border-transparent">
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-[240px,1fr]">
          <img
            src={image}
            alt={title}
            width={240}
            height={240}
            className="rounded-lg object-cover w-full h-[240px]"
          />
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
              <div className="text-sm text-gray-400">Listed on: {listedDate}</div>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-[80px,1fr] text-sm">
                <div className="text-gray-400">Event Date</div>
                <div className="text-white">{date}</div>
              </div>
              <div className="grid grid-cols-[80px,1fr] text-sm">
                <div className="text-gray-400">Venue</div>
                <div className="text-white">{venue}</div>
              </div>
              <div className="grid grid-cols-[80px,1fr] text-sm">
                <div className="text-gray-400">Description</div>
                <div className="text-white">{description}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Button key={tag} className="bg-[#333447] text-white hover:bg-[#4A4E68]" variant="secondary" size="sm">
                    {tag}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <Button variant="secondary" className="text-white gap-2" onClick={onInterestedClick}>
                  <Star
                  className={`h-4 w-4 transition-colors duration-300 ${
                    isInterested ? "fill-yellow-500 text-yellow-500" : "fill-transparent text-yellow-500" }`}/>
                  Interested {interested}
                </Button>
                <Button variant="ghost" size="icon" className="bg-[#333447] text-white hover:bg-[#4A4E68]">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
