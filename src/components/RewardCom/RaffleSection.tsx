//components/RewardCom/RaffleSection.tsx
import { useState, useEffect, useContext } from "react"
import { TicketIcon, ClockIcon, UsersIcon, CoinsIcon, CheckCircleIcon, Loader2Icon, WalletIcon } from "lucide-react"
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
import { AppContext } from "@/context/AppContext"
import { useWallet } from "@/context/WalletContext" // Import the wallet context
import raffleBlockchainService, { RaffleData } from "@/services/raffleBlockchainService"
import { toast } from "react-toastify"
import axios from "axios"

const RaffleSection = () => {
  const { isLoggedin, userData, backendUrl } = useContext(AppContext) || {};
  const { isConnected, walletAddress, connectWallet, isConnecting } = useWallet(); // Use the wallet context
  
  const [selectedRaffle, setSelectedRaffle] = useState<RaffleData | null>(null)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [enrolledRaffles, setEnrolledRaffles] = useState<number[]>([])
  const [raffles, setRaffles] = useState<RaffleData[]>([])
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Fetch active raffles and user's enrolled raffles
  useEffect(() => {
    const fetchRaffles = async () => {
      setLoading(true)
      try {
        // Initialize blockchain service
        await raffleBlockchainService.init()
        
        // Fetch active raffles from blockchain
        const activeRaffles = await raffleBlockchainService.getActiveRaffles()
        
        // Sort raffles by end time (closest to ending first)
        activeRaffles.sort((a, b) => a.endTime - b.endTime)
        
        setRaffles(activeRaffles)
        
        // If user is logged in and wallet is connected, check which raffles they've entered
        if (isLoggedin && isConnected && walletAddress) {
          const userEnrolledRaffles: number[] = []
          
          for (const raffle of activeRaffles) {
            const userTickets = await raffleBlockchainService.getUserTickets(raffle.raffleId)
            if (userTickets.length > 0) {
              userEnrolledRaffles.push(raffle.raffleId)
            }
          }
          
          setEnrolledRaffles(userEnrolledRaffles)
        }
      } catch (error) {
        console.error("Error fetching raffles:", error)
        toast.error("Failed to load raffles. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchRaffles()
  }, [isLoggedin, isConnected, walletAddress]) // Added wallet connection states to dependencies

  const handleBuyTicket = async (raffle: RaffleData) => {
    if (!isLoggedin) {
      toast.error("Please log in to purchase tickets")
      return
    }
    
    if (!isConnected || !walletAddress) {
      try {
        // Try to connect the wallet first
        toast.info("Please connect your wallet to continue")
        await connectWallet()
        // If we reach here, the wallet is connected
      } catch (error) {
        console.error("Failed to connect wallet:", error)
        toast.error("Failed to connect wallet. Please try again.")
        return
      }
    }
    
    // Once we're sure the wallet is connected, proceed with buying the ticket
    if (isConnected && walletAddress) {
      setSelectedRaffle(raffle)
      setIsPurchaseModalOpen(true)
    } else {
      toast.error("Please connect your wallet to purchase tickets")
    }
  }

  const handleConfirmPurchase = async () => {
    if (!selectedRaffle) return
    
    try {
      setIsProcessing(true)
      
      // Buy tickets from blockchain
      const success = await raffleBlockchainService.buyTickets(
        selectedRaffle.raffleId,
        ticketQuantity,
        selectedRaffle.ticketPrice
      )
      
      if (success) {
        setIsPurchaseModalOpen(false)
        setIsConfirmationModalOpen(true)
        setEnrolledRaffles([...enrolledRaffles, selectedRaffle.raffleId])
        
        // Update raffle data to reflect new ticket purchase
        const updatedRaffles = raffles.map(raffle => {
          if (raffle.raffleId === selectedRaffle.raffleId) {
            return {
              ...raffle,
              totalTicketsSold: raffle.totalTicketsSold + ticketQuantity,
              participants: (raffle.participants || 0) + 1
            }
          }
          return raffle
        })
        
        setRaffles(updatedRaffles)
      }
    } catch (error) {
      console.error("Error purchasing tickets:", error)
      toast.error("Failed to purchase tickets. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleCloseConfirmation = (open: boolean) => {
    setIsConfirmationModalOpen(open)
    setSelectedRaffle(null)
    setTicketQuantity(1)
  }
  
  const isEnrolled = (raffleId: number) => enrolledRaffles.includes(raffleId)
  
  // Format time left for display
  const formatTimeLeft = (endTime: number) => {
    return raffleBlockchainService.formatTimeLeft(endTime)
  }
  
  // Format currency
  const formatCurrency = (value: string, currency: string = "ETH") => {
    return `${value} ${currency}`
  }

  return (
    <section className="py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Active Raffles</h2>
        
        {/* Add wallet connect button */}
        {isLoggedin && !isConnected && (
          <Button 
            onClick={connectWallet} 
            disabled={isConnecting}
            className="mr-4 bg-[#E27625] hover:bg-[#d46222]"
          >
            {isConnecting ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <WalletIcon className="mr-2 h-4 w-4" />
                Connect Wallet
              </>
            )}
          </Button>
        )}
        
        <button className="px-4 py-2 text-sm bg-transparent border border-[#E27625] text-[#ffffff] hover:bg-[#E27625] rounded-lg transition">
          View All
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2Icon className="h-12 w-12 text-[#E27625] animate-spin" />
        </div>
      ) : raffles.length === 0 ? (
        <div className="text-center py-12 bg-[#333447] rounded-xl">
          <h3 className="text-xl mb-2">No Active Raffles</h3>
          <p className="text-gray-400">Check back soon for new opportunities!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {raffles.map((raffle) => (
            <div
              key={raffle.raffleId}
              className={`bg-[#333447] rounded-xl overflow-hidden border ${
                isEnrolled(raffle.raffleId)
                  ? "border-green-500 shadow-lg shadow-green-500/20"
                  : "border-gray-700 hover:border-blue-500"
              } transition group`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={raffle.imageURL || "/placeholder.svg"}
                  alt={raffle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                {isEnrolled(raffle.raffleId) ? (
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
                    <p className="text-xl font-bold text-[#00BD58]">{formatCurrency(raffle.prizeAmount, "ETH")}</p>
                  </div>
                </div>
                <div className="flex justify-between mb-4">
                  <div className="flex items-center">
                    <ClockIcon size={16} className="text-gray-400 mr-1" />
                    <span className="text-sm">Ends in {formatTimeLeft(raffle.endTime)}</span>
                  </div>
                  <div className="flex items-center">
                    <UsersIcon size={16} className="text-gray-400 mr-1" />
                    <span className="text-sm">{raffle.totalTicketsSold} tickets</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TicketIcon size={16} className="text-gray-400 mr-1" />
                    <span className="text-sm">{formatCurrency(raffle.ticketPrice, "ETH")}</span>
                  </div>
                  {isEnrolled(raffle.raffleId) ? (
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
      )}

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
                    src={selectedRaffle.imageURL || "/placeholder.svg"}
                    alt={selectedRaffle.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{selectedRaffle.name}</h4>
                  <p className="text-sm text-gray-400">Prize: {formatCurrency(selectedRaffle.prizeAmount, "ETH")}</p>
                </div>
              </div>

              <div className="bg-[#333447] p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Ticket Price:</span>
                  <span className="font-medium">{formatCurrency(selectedRaffle.ticketPrice, "ETH")}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-400">Ends in:</span>
                  <span className="font-medium">{formatTimeLeft(selectedRaffle.endTime)}</span>
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
                    {ticketQuantity} × {formatCurrency(selectedRaffle.ticketPrice, "ETH")}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-700">
                  <span>Total:</span>
                  <span className="text-[#00BD58]">
                    {formatCurrency((parseFloat(selectedRaffle.ticketPrice) * ticketQuantity).toString(), "ETH")}
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
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPurchase}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Purchase"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        open={isConfirmationModalOpen}
        onOpenChange={handleCloseConfirmation}
        raffle={selectedRaffle as any}
        ticketQuantity={ticketQuantity}
      />
    </section>
  )
}

export default RaffleSection