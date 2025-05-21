//StakeWise-Frontend/src/components/RewardCom/RaffleSection.tsx
import { useState } from "react"
import { TicketIcon, ClockIcon, UsersIcon, CoinsIcon, CheckCircleIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ConfirmationModal } from "@/components/RewardCom/Confirmation-model"

interface Raffle {
  id: number
  name: string
  prize: string
  endTime: string
  participants: number
  ticketPrice: string
  image: string
}

const RaffleSection = () => {
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [enrolledRaffles, setEnrolledRaffles] = useState<number[]>([])

  const raffles = [
    {
      id: 1,
      name: "Weekly Crypto Jackpot",
      prize: "5,000 USDT",
      endTime: "23:59:42",
      participants: 1243,
      ticketPrice: "50 BTC",
      image: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?q=80&w=2787&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Gaming Console Bundle",
      prize: "PS5 + Gaming Bundle",
      endTime: "11:45:30",
      participants: 2154,
      ticketPrice: "100 USDT",
      image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=2819&auto=format&fit=crop",
    },
    {
      id: 4,
      name: "Ultimate Tech Bundle",
      prize: "MacBook Pro + iPhone 15 Pro",
      endTime: "35:12:09",
      participants: 3102,
      ticketPrice: "200 USDT",
      image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2940&auto=format&fit=crop",
    },
    {
      id: 5,
      name: "Luxury Timepiece",
      prize: "Rolex Submariner",
      endTime: "72:00:00",
      participants: 5431,
      ticketPrice: "500 ETH",
      image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=2787&auto=format&fit=crop",
    },
  ]

  const handleBuyTicket = (raffle: Raffle) => {
    setSelectedRaffle(raffle)
    setIsPurchaseModalOpen(true)
  }

  const handleConfirmPurchase = () => {
    if (selectedRaffle) {
      setIsPurchaseModalOpen(false)
      setIsConfirmationModalOpen(true)
      setEnrolledRaffles([...enrolledRaffles, selectedRaffle.id])
      setTicketQuantity(1)
    }
  }

  const handleCloseConfirmation = (open: boolean) => {
    setIsConfirmationModalOpen(open)
    setSelectedRaffle(null)
  }

  const isEnrolled = (raffleId: number) => enrolledRaffles.includes(raffleId)

  return (
    <section className="py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Active Raffles</h2>
        <button className="px-4 py-2 text-sm bg-transparent border border-[#E27625] text-[#ffffff] hover:bg-[#E27625] rounded-lg transition">
          View All
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {raffles.map((raffle) => (
          <div
            key={raffle.id}
            className={`bg-[#333447] rounded-xl overflow-hidden border ${
              isEnrolled(raffle.id)
                ? "border-green-500 shadow-lg shadow-green-500/20"
                : "border-gray-700 hover:border-blue-500"
            } transition group`}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={raffle.image || "/placeholder.svg"}
                alt={raffle.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
              {isEnrolled(raffle.id) ? (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <CheckCircleIcon size={16} className="mr-1" />
                  Enrolled
                </div>
              ) : (
                <div className="absolute bottom-4 left-4 bg-[#E27625] text-white px-3 py-1 rounded-full text-sm font-medium">
                  Hot Deal
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2">{raffle.name}</h3>
              <div className="bg-[#505279] rounded-lg p-3 mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Prize Pool</p>
                  <p className="text-xl font-bold text-[#00BD58]">{raffle.prize}</p>
                </div>
              </div>
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <ClockIcon size={16} className="text-gray-400 mr-1" />
                  <span className="text-sm">Ends in {raffle.endTime}</span>
                </div>
                <div className="flex items-center">
                  <UsersIcon size={16} className="text-gray-400 mr-1" />
                  <span className="text-sm">{raffle.participants} players</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TicketIcon size={16} className="text-gray-400 mr-1" />
                  <span className="text-sm">{raffle.ticketPrice}</span>
                </div>
                {isEnrolled(raffle.id) ? (
                  <div className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white">
                    <TicketIcon size={16} className="mr-1" />
                    <span>Ticket Purchased</span>
                  </div>
                ) : (
                  <button
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:opacity-90 transition"
                    onClick={() => handleBuyTicket(raffle)}
                  >
                    <CoinsIcon size={16} className="mr-1" />
                    <span>Buy Ticket</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Purchase Modal */}
      <Dialog open={isPurchaseModalOpen} onOpenChange={setIsPurchaseModalOpen}>
        <DialogContent className="bg-[#252638] border border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Buy Raffle Tickets</DialogTitle>
            <DialogDescription className="text-gray-400">Purchase tickets for {selectedRaffle?.name}</DialogDescription>
          </DialogHeader>

          {selectedRaffle && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-lg overflow-hidden">
                  <img
                    src={selectedRaffle.image || "/placeholder.svg"}
                    alt={selectedRaffle.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{selectedRaffle.name}</h4>
                  <p className="text-sm text-gray-400">Prize: {selectedRaffle.prize}</p>
                </div>
              </div>

              <div className="bg-[#333447] p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Ticket Price:</span>
                  <span className="font-medium">{selectedRaffle.ticketPrice}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-400">Ends in:</span>
                  <span className="font-medium">{selectedRaffle.endTime}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-400">Number of Tickets</label>
                    <div className="flex items-center">
                      <button
                        className="h-8 w-8 flex items-center justify-center bg-[#505279] rounded-l-lg"
                        onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                      >
                        -
                      </button>
                      <div className="h-8 w-12 flex items-center justify-center bg-[#505279] text-white font-medium">
                        {ticketQuantity}
                      </div>
                      <button
                        className="h-8 w-8 flex items-center justify-center bg-[#505279] rounded-r-lg"
                        onClick={() => setTicketQuantity(ticketQuantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#333447] p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="font-medium">
                    {ticketQuantity} × {selectedRaffle.ticketPrice}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-700">
                  <span>Total:</span>
                  <span className="text-[#00BD58]">
                    {(() => {
                      // Extract numeric part from ticket price (e.g., "50" from "50 BTC")
                      const priceValue = Number.parseFloat(selectedRaffle.ticketPrice.split(" ")[0])
                      const currency = selectedRaffle.ticketPrice.split(" ")[1]
                      // Calculate total and format it
                      const total = priceValue * ticketQuantity
                      return `${total} ${currency}`
                    })()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsPurchaseModalOpen(false)}
              className="border-gray-700 text-white hover:bg-[#333447] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPurchase}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90"
            >
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={isConfirmationModalOpen}
        onOpenChange={handleCloseConfirmation}
        raffle={selectedRaffle}
        ticketQuantity={ticketQuantity}
      />
    </section>
  )
}

export default RaffleSection

