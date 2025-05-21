//components/RewardCom/Confirmation-model.tsx
import { CheckCircleIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { RaffleData } from "@/services/raffleBlockchainService"

interface ConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  raffle: RaffleData | null
  ticketQuantity?: number
}

export function ConfirmationModal({ open, onOpenChange, raffle, ticketQuantity = 1 }: ConfirmationModalProps) {
  const navigate = useNavigate()
  
  if (!raffle) return null
  
  // Format currency
  const formatCurrency = (value: string, currency: string = "ETH") => {
    return `${value} ${currency}`
  }
  
  // Format time left for display
  const formatTimeLeft = (endTime: number) => {
    const now = Math.floor(Date.now() / 1000)
    const timeLeft = endTime - now
    
    if (timeLeft <= 0) {
      return "Ended"
    }
    
    const hours = Math.floor(timeLeft / 3600)
    const minutes = Math.floor((timeLeft % 3600) / 60)
    const seconds = timeLeft % 60
    
    if (hours > 72) {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h`
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  
  // Navigate to Dashboard to view user's tickets
  const handleViewMyTickets = () => {
    onOpenChange(false)
    navigate("/dashboard", { state: { activeTab: "tickets" } })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-800 border border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-500/20 p-3 rounded-full">
                <CheckCircleIcon className="h-12 w-12 text-green-500" />
              </div>
            </div>
            Tickets Purchased Successfully!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-center">
          <p>
            You have successfully entered the raffle draw for
            <span className="font-bold block mt-1">{raffle.name}</span>
          </p>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-gray-400 text-sm">Prize</p>
                <p className="font-medium text-green-400">{formatCurrency(raffle.prizeAmount, "ETH")}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Draw Date</p>
                <p className="font-medium">In {formatTimeLeft(raffle.endTime)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Your Tickets</p>
                <p className="font-medium">
                  {ticketQuantity} {ticketQuantity === 1 ? "Ticket" : "Tickets"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Participants</p>
                <p className="font-medium">{(raffle.totalTicketsSold || 0) + ticketQuantity}</p>
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Good luck! Winners will be announced after the draw ends.</p>
          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
            onClick={handleViewMyTickets}
          >
            View My Tickets
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}