// Raffle Draw Platform
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RaffleCard from '@/components/New_raffle/RaffleCard';
import RaffleSpinner from '@/components/New_raffle/RaffleSpinner';
import { Trophy, Sparkles } from 'lucide-react';

const Raffle = () => {
  const [selectedRaffle, setSelectedRaffle] = useState<string | null>(null);

  // Mock data for active raffles
  const activeRaffles = [
    {
      id: '1',
      title: 'Summer Bonus',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=250&fit=crop',
      prizePool: '2 ETH',
      endTime: '23:40:21',
      ticketPrice: '0.01 ETH',
      totalTickets: 200,
      soldTickets: 45,
      isHotDeal: true
    },
    {
      id: '2',
      title: '200$ Giveaway',
      image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=250&fit=crop',
      prizePool: '2 ETH',
      endTime: '47:59:21',
      ticketPrice: '0.01 ETH',
      totalTickets: 200,
      soldTickets: 67,
      isHotDeal: true
    },
    {
      id: '3',
      title: 'Crypto Jackpot',
      image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=250&fit=crop',
      prizePool: '5 ETH',
      endTime: '12:15:43',
      ticketPrice: '0.05 ETH',
      totalTickets: 100,
      soldTickets: 23,
      isHotDeal: false
    }
  ];

  // Mock raffle data for spinner (2 minutes from now for testing)
  const spinnerRaffleData = {
    id: '1',
    title: 'Summer Bonus Raffle',
    prizePool: '2 ETH',
    tickets: [
      { id: '1', ticketNumber: '001', owner: '0x1234...5678', purchaseTime: new Date() },
      { id: '2', ticketNumber: '002', owner: '0x8765...4321', purchaseTime: new Date() },
      { id: '3', ticketNumber: '003', owner: '0xabcd...efgh', purchaseTime: new Date() },
      { id: '4', ticketNumber: '004', owner: '0x9876...1234', purchaseTime: new Date() },
      { id: '5', ticketNumber: '005', owner: '0x5555...9999', purchaseTime: new Date() },
      { id: '6', ticketNumber: '006', owner: '0x1111...2222', purchaseTime: new Date() },
      { id: '7', ticketNumber: '007', owner: '0x3333...4444', purchaseTime: new Date() },
      { id: '8', ticketNumber: '008', owner: '0x7777...8888', purchaseTime: new Date() }
    ],
    endTime: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes from now for testing
    status: 'active' as const
  };

  const handleBuyTicket = (raffleId: string) => {
    console.log('Buy ticket for raffle:', raffleId);
    // Implement ticket purchase logic
  };

  const handleViewDetails = (raffleId: string) => {
    console.log('View details for raffle:', raffleId);
    setSelectedRaffle(raffleId);
  };

  const handleDrawComplete = (winner: any) => {
    console.log('Draw complete, winner:', winner);
    // Implement winner logic (update blockchain, notify users, etc.)
  };

  return (
    <div className="min-h-screen bg-background">

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Section 1: Active Raffles */}
        <div>
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-foreground">Active Raffles</h2>
              <Button variant="outline" className="border-primary/30 hover:border-primary">
                View All
              </Button>
            </div>
            <p className="text-muted-foreground mt-2">Join active raffles and win amazing prizes!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeRaffles.map((raffle) => (
              <RaffleCard
                key={raffle.id}
                {...raffle}
                onBuyTicket={handleBuyTicket}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>

        {/* Section 2: Raffle Draw Machine */}
        <div>
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">Raffle Draw Machine</h2>
            <p className="text-muted-foreground">Watch the live draw and see if you're the lucky winner!</p>
          </div>

          <RaffleSpinner 
            raffleData={spinnerRaffleData}
            onDrawComplete={handleDrawComplete}
          />

          {/* Instructions */}
          <Card className="mt-8 bg-[#333447] border-[#ca7830]">
            <CardHeader>
              <CardTitle className="text-center text-[#8488AC]">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#8488AC] flex items-center justify-center mx-auto">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h3 className="font-semibold">Buy Tickets</h3>
                  <p className="text-sm text-muted-foreground text-[#8488AC]">Purchase tickets for your favorite raffles</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#8488AC] flex items-center justify-center mx-auto">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h3 className="font-semibold">Wait for Draw</h3>
                  <p className="text-sm text-muted-foreground text-[#8488AC]">When the timer ends, the draw begins automatically</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#8488AC] flex items-center justify-center mx-auto">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h3 className="font-semibold">Win Prizes</h3>
                  <p className="text-sm text-muted-foreground text-[#8488AC]">Winners are selected randomly and prizes distributed instantly</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Raffle;
