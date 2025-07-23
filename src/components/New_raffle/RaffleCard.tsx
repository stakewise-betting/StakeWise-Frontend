import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Ticket, Users } from 'lucide-react';

interface RaffleCardProps {
  id: string;
  title: string;
  image: string;
  prizePool: string;
  endTime: string;
  ticketPrice: string;
  totalTickets: number;
  soldTickets: number;
  isHotDeal?: boolean;
  onBuyTicket: (raffleId: string) => void;
  onViewDetails: (raffleId: string) => void;
}

const RaffleCard: React.FC<RaffleCardProps> = ({
  id,
  title,
  image,
  prizePool,
  endTime,
  ticketPrice,
  totalTickets,
  soldTickets,
  isHotDeal = false,
  onBuyTicket,
  onViewDetails
}) => {
  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 group overflow-hidden">
      <div className="relative">
        {/* Image */}
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isHotDeal && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
              Hot Deal
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Prize Pool */}
          <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Prize Pool</p>
            <p className="text-2xl font-bold text-accent">{prizePool}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Ends in {endTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{soldTickets} tickets</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{ticketPrice}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(id)}
                className="border-primary/30 hover:border-primary hover:bg-primary/10"
              >
                Details
              </Button>
              <Button
                size="sm"
                onClick={() => onBuyTicket(id)}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                Buy Ticket
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default RaffleCard;