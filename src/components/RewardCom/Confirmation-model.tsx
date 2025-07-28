//components/RewardCom/Confirmation-model.tsx
import { CheckCircleIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Raffle } from "@/services/raffleBlockchainService"

interface ConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  raffle: Raffle | null
  ticketQuantity?: number
}

export function ConfirmationModal({ open, onOpenChange, raffle, ticketQuantity = 1 }: ConfirmationModalProps) {
  const navigate = useNavigate()
  
  if (!raffle) return null
  
  // Format time left for display
  const formatTimeLeft = (endTime: number) => {
    const now = Math.floor(Date.now() / 1000)
    const timeLeft = endTime - now
    
    if (timeLeft <= 0) {
      return "Draw Ended"
    }
    
    const days = Math.floor(timeLeft / (3600 * 24))
    const hours = Math.floor((timeLeft % (3600 * 24)) / 3600)
    const minutes = Math.floor((timeLeft % 3600) / 60)
    
    if (days > 0) {
      return `${days}d ${hours}h left`
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m left`
    }
    return `${minutes}m left`
  }
  
  // Navigate to Dashboard to view user's tickets
  const handleViewMyTickets = () => {
    onOpenChange(false)
    navigate("/dashboard", { state: { activeTab: "tickets" } })
  }

  const handleContinueRaffles = () => {
    onOpenChange(false)
  }

  const totalCost = (Number(raffle.ticketPrice) * ticketQuantity).toFixed(4)
  const updatedTotalTickets = (Number(raffle.totalTicketsSold) || 0) + ticketQuantity

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-[#1C1C27] to-[#252538] border border-gray-700 text-white overflow-hidden">
        {/* Success Animation Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5"></div>
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-center space-y-3">
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-full">
                <CheckCircleIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                🎉 Entry Successful!
              </h2>
              <p className="text-gray-400 text-sm">Entered in raffle for</p>
              <p className="text-lg font-bold text-[#E27625]">{raffle.name}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 relative z-10">
          {/* Compact Stats Grid */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-gray-600/50">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="text-gray-400 text-xs mb-1">Your Tickets</p>
                <p className="text-lg font-bold text-white">{ticketQuantity}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Total Paid</p>
                <p className="text-lg font-bold text-green-400">{totalCost} ETH</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Prize Pool</p>
                <p className="text-sm font-semibold text-[#E27625]">{raffle.prizeAmount} ETH</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Draw In</p>
                <p className="text-sm font-semibold text-white">{formatTimeLeft(Number(raffle.endTime))}</p>
              </div>
            </div>
          </div>

          {/* Simple Message */}
          <div className="text-center p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 text-sm font-medium">🍀 Good luck! Winners announced when draw ends.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-gray-600 hover:bg-gray-700 text-gray-300"
              onClick={handleContinueRaffles}
            >
              Continue
            </Button>
            {/* <Button
              className="flex-1 bg-gradient-to-r from-[#E27625] to-orange-600 hover:from-orange-600 hover:to-[#E27625] text-white font-semibold"
              onClick={handleViewMyTickets}
            >
              View Tickets
            </Button> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}