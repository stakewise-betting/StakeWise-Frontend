import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Bookmark, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BettingOption {
  id: number;
  text: string;
}

interface BettingCardProps {
  event: any; // Passing event object from blockchain
}

const BettingCard: FC<BettingCardProps> = ({ event }) => {
  const navigate = useNavigate();

  const options: BettingOption[] = event.options.map((option: string, index: number) => ({
    id: index,
    text: option,
  }));

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
            <h3 className="font-medium text-sm leading-tight">{event.name}</h3>
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
              <div key={option.id} className="flex items-center justify-between h-[28px]">
                <span className="text-sm text-gray-200">{option.text}</span>
                <Button
                  variant="secondary"
                  className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] px-1 py-1 h-4"
                  onClick={() => navigate(`/bet/${event.id}`)} // Navigate to bet page
                >
                  Place Bet
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex items-center gap-2 text-sm text-[#8488AC]">
          <Clock className="h-4 w-4" />
          <span>{new Date(Number(event.endTime) * 1000).toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BettingCard;