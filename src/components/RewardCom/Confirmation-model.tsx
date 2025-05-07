import { CheckCircleIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  raffle: {
    id: number
    name: string
    prize: string
    endTime: string
    participants: number
    ticketPrice: string
    image: string
  } | null
  ticketQuantity?: number
}

export function ConfirmationModal({ open, onOpenChange, raffle, ticketQuantity = 1 }: ConfirmationModalProps) {
  if (!raffle) return null

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
                <p className="font-medium text-green-400">{raffle.prize}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Draw Date</p>
                <p className="font-medium">In {raffle.endTime}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Your Tickets</p>
                <p className="font-medium">
                  {ticketQuantity} {ticketQuantity === 1 ? "Ticket" : "Tickets"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Participants</p>
                <p className="font-medium">{raffle.participants + 1}</p>
              </div>
            </div>
          </div>

          <p className="text-gray-400 text-sm">Good luck! Winners will be announced after the draw ends.</p>

          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
            onClick={() => onOpenChange(false)}
          > 
          {/*here i have to pass the ticket details to user profile page   "View My Tickets" */}
            View My Tickets  
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
