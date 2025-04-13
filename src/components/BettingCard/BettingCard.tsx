import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Bookmark, Star, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BettingOption {
  id: number;
  text: string;
}

interface EventData {
  eventId: string;
  name: string;
  imageURL: string;
  options: string[];
  endTime: string;
  startTime: string;
  createdAt?: string;
  description?: string;
}

interface BettingCardProps {
  event: EventData;
}

const BettingCard: FC<BettingCardProps> = ({ event }) => {
  const navigate = useNavigate();
  
  const options: BettingOption[] = event.options.map(
    (option: string, index: number) => ({
      id: index,
      text: option,
    })
  );
  
  // Format timestamps
  const startTime = new Date(Number(event.startTime) * 1000);
  const endTime = new Date(Number(event.endTime) * 1000);
  
  // Calculate if the event is active or expired
  const currentTime = Math.floor(Date.now() / 1000);
  const isEventActive = Number(event.startTime) <= currentTime && Number(event.endTime) > currentTime;
  const isEventExpired = Number(event.endTime) <= currentTime;
  
  // Get status label and color
  const getStatusInfo = () => {
    if (isEventExpired) {
      return { label: "Expired", color: "text-red-500" };
    }
    if (isEventActive) {
      return { label: "Active", color: "text-green-500" };
    }
    return { label: "Upcoming", color: "text-yellow-500" };
  };
  
  const statusInfo = getStatusInfo();

  return (
    <Card className="w-full max-w-md bg-[#333447] text-white shadow-lg border-0">
      <CardHeader className="p-2 space-y-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <img
              src={event.imageURL || "/placeholder.svg"}
              alt={event.name}
              className="w-12 h-12 rounded-md object-cover"
            />
            <div>
              <h3 className="font-medium text-sm leading-tight">{event.name}</h3>
              <span className={`text-xs ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>
          <div className="flex gap-2 text-[#8488AC]">
            <button className="hover:text-white transition-colors">
              <Bookmark className="h-4 w-4" />
            </button>
            <button className="hover:text-white transition-colors">
              <Star className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 pt-0 space-y-1">
        <ScrollArea className="h-[80px] pr-2 overflow-hidden">
          <div className="space-y-0">
            {options.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between h-[28px]"
              >
                <span className="text-sm text-gray-200">{option.text}</span>
                <Button
                  variant="secondary"
                  className={`text-white text-[10px] px-1 py-1 h-4
                    ${isEventExpired 
                      ? 'bg-gray-500 hover:bg-gray-600 cursor-not-allowed' 
                      : 'bg-orange-500 hover:bg-orange-600'}`}
                  onClick={() => {
                    if (!isEventExpired) {
                      navigate(`/bet/${event.eventId}`);
                    }
                  }}
                  disabled={isEventExpired}
                >
                  {isEventExpired ? 'Closed' : 'Place Bet'}
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex flex-col gap-1 text-xs text-[#8488AC]">
          
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>Started: {startTime.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>Ends: {endTime.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BettingCard;