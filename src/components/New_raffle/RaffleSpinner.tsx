import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Ticket, Clock, Sparkles } from 'lucide-react';

interface RaffleTicket {
  id: string;
  ticketNumber: string;
  owner: string;
  purchaseTime: Date;
}

interface RaffleData {
  id: string;
  title: string;
  prizePool: string;
  tickets: RaffleTicket[];
  endTime: Date;
  status: 'active' | 'drawing' | 'completed';
}

interface RaffleSpinnerProps {
  raffleData: RaffleData;
  onDrawComplete: (winner: RaffleTicket) => void;
}

const RaffleSpinner: React.FC<RaffleSpinnerProps> = ({ raffleData, onDrawComplete }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<string>('');
  const [winner, setWinner] = useState<RaffleTicket | null>(null);
  const [spinPhase, setSpinPhase] = useState<'idle' | 'loading' | 'spinning' | 'slowing' | 'complete'>('idle');
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [drawStarted, setDrawStarted] = useState(false);

  // Timer and automatic draw logic
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeDiff = raffleData.endTime.getTime() - now.getTime();
      
      if (timeDiff <= 0) {
        // Time's up, start the draw automatically
        if (!drawStarted && !isSpinning && raffleData.tickets.length > 0) {
          setDrawStarted(true);
          startDraw();
        }
        setTimeLeft('Draw Started!');
      } else {
        // Format time left
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [raffleData.endTime, drawStarted, isSpinning, raffleData.tickets.length]);

  const startDraw = async () => {
    if (raffleData.tickets.length === 0) return;
    
    setIsSpinning(true);
    setSpinPhase('loading');
    setWinner(null);

    // Loading phase
    setTimeout(() => {
      setSpinPhase('spinning');
      
      // Fast spinning phase
      const fastSpinInterval = setInterval(() => {
        const randomTicket = raffleData.tickets[Math.floor(Math.random() * raffleData.tickets.length)];
        setCurrentTicket(randomTicket.ticketNumber);
      }, 50);

      // Transition to slow spinning
      setTimeout(() => {
        clearInterval(fastSpinInterval);
        setSpinPhase('slowing');
        
        const slowSpinInterval = setInterval(() => {
          const randomTicket = raffleData.tickets[Math.floor(Math.random() * raffleData.tickets.length)];
          setCurrentTicket(randomTicket.ticketNumber);
        }, 200);

        // Final selection
        setTimeout(() => {
          clearInterval(slowSpinInterval);
          const winningTicket = raffleData.tickets[Math.floor(Math.random() * raffleData.tickets.length)];
          setCurrentTicket(winningTicket.ticketNumber);
          setWinner(winningTicket);
          setSpinPhase('complete');
          setIsSpinning(false);
          onDrawComplete(winningTicket);
        }, 2000);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="bg-gradient-to-br from-[#1C1C27] to-[#333447] border-border shadow-lg">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="h-8 w-8 text-[#ffffff]" />
              <h2 className="text-3xl font-bold bg-gradient-to-r text-[#ffffff] bg-clip-text">
                Raffle Draw
              </h2>
            </div>
            <p className="text-xl text-muted-foreground">{raffleData.title}</p>
            <p className="text-2xl font-bold text-[#2BE12B] mt-2">Prize Pool: {raffleData.prizePool}</p>
          </div>

          {/* Spinner Machine */}
          <div className="relative mx-auto mb-8" style={{ width: '400px', height: '400px' }}>
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-primary/30 bg-gradient-to-br from-[#333447] to-[#333447]">
              <div className="absolute inset-4 rounded-full border-2 border-primary/50 bg-background/50 backdrop-blur-sm">
                
                {/* Spinning Wheel */}
                <div className={`absolute inset-6 rounded-full bg-gradient-to-br from-primary/20 to-[#2BE12B]/20 border border-primary/30 flex items-center justify-center transition-all duration-1000 ${
                  isSpinning ? 'animate-wheel-spin' : ''
                } ${spinPhase === 'spinning' ? 'animate-spin-slow' : ''}`}>
                  
                  {/* Ticket Display */}
                  <div className="text-center">
                    <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/20 border border-primary/50 transition-all duration-300 ${
                      spinPhase === 'complete' ? 'animate-glow-pulse scale-110' : ''
                    } ${spinPhase === 'spinning' || spinPhase === 'slowing' ? 'animate-bounce-ticket' : ''}`}>
                      <Ticket className="h-6 w-6 text-primary" />
                      <span className="text-2xl font-bold text-foreground">
                        {currentTicket || '----'}
                      </span>
                    </div>
                    
                    {spinPhase === 'complete' && winner && (
                      <div className="mt-4 animate-fade-in-up">
                        <p className="text-sm text-muted-foreground">Winner</p>
                        <p className="text-lg font-semibold text-[#2BE12B] truncate">
                          {winner.owner}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pointer */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-primary"></div>
                </div>
              </div>
            </div>

            {/* Loading Sparkles */}
            {spinPhase === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-primary animate-spin" />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                <span>{raffleData.tickets.length} Total Tickets</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {raffleData.status === 'active' ? 'Ready to Draw' : 
                   raffleData.status === 'drawing' ? 'Drawing...' : 'Completed'}
                </span>
              </div>
            </div>

            {/* Timer/Status Display */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-2">
              {isSpinning ? (
                <div className="flex items-center justify-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-foreground font-semibold">
                    {spinPhase === 'loading' ? 'Loading Tickets...' :
                     spinPhase === 'spinning' ? 'Drawing Winner...' :
                     spinPhase === 'slowing' ? 'Finalizing...' : 'Drawing...'}
                  </span>
                </div>
              ) : winner && spinPhase === 'complete' ? (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-lg text-[#2BE12B] mb-2">
                    <Trophy className="h-5 w-5" />
                    <span className="font-semibold">Draw Completed!</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Next raffle coming soon...</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-lg text-[#2BE12B] mb-2">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold">Next Raffle Starting Soon!</span>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                    <p className="text-2xl font-bold text-primary mb-1">{timeLeft}</p>
                    <p className="text-sm text-muted-foreground">Time remaining until draw</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Winner Announcement */}
          {winner && spinPhase === 'complete' && (
            <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-[#2BE12B]/20 to-primary/20 border border-[#2BE12B]/30 animate-fade-in-up">
              <div className="text-center">
                <Trophy className="h-12 w-12 text-[#2BE12B] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">🎉 Congratulations! 🎉</h3>
                <p className="text-lg text-muted-foreground mb-2">Winning Ticket Number:</p>
                <p className="text-3xl font-bold text-[#2BE12B] mb-2">#{winner.ticketNumber}</p>
                <p className="text-lg text-muted-foreground">Winner: <span className="text-foreground font-semibold">{winner.owner}</span></p>
                <p className="text-sm text-muted-foreground mt-2">Prize Pool: <span className="text-[#2BE12B] font-bold">{raffleData.prizePool}</span></p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RaffleSpinner;