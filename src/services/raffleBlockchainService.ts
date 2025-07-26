//service/raffleBlockchainService.ts
import Web3 from "web3";
import { ethers } from "ethers";
import { toast } from "react-toastify";

import { raffleContractAddress, raffleContractABI } from "@/config/raffleContractConfig";

// Define raffle type
export interface RaffleData {
  raffleId: number;
  name: string;
  description: string;
  imageURL: string;
  startTime: number;
  endTime: number;
  ticketPrice: string;
  prizeAmount: string;
  isCompleted: boolean;
  winner: string;
  totalTicketsSold: number;
  notificationImageURL: string;
  notificationMessage: string;
  participants?: number; // For UI display
}

// Service class
class RaffleBlockchainService {
  private web3: Web3 | null = null;
  private contract: any = null;
  private provider: any = null;
  private ethersContract: any = null;

  // Initialize Web3 and contract
  async init() {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        // Use MetaMask provider
        // Fix for ethers.js version compatibility
        this.provider = new ethers.BrowserProvider(window.ethereum);
        // or if using older ethers version:
        // this.provider = new ethers.providers.Web3Provider(window.ethereum);
        
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Initialize Web3 with MetaMask provider
        this.web3 = new Web3(window.ethereum);
        
        // Initialize contract
        this.contract = new this.web3.eth.Contract(
          raffleContractABI,
          raffleContractAddress
        );
        
        // Initialize ethers contract
        const signer = await this.provider.getSigner();
        this.ethersContract = new ethers.Contract(
          raffleContractAddress,
          raffleContractABI,
          signer
        );
        
        return true;
      } else {
        toast.error("MetaMask not installed. Please install MetaMask to use this feature.");
        return false;
      }
    } catch (error) {
      console.error("Error initializing blockchain service:", error);
      toast.error("Failed to connect to blockchain. Please check your network connection.");
      return false;
    }
  }

  // Get current account
  async getCurrentAccount() {
    try {
      if (!this.web3) {
        await this.init();
      }
      
      const accounts = await this.web3!.eth.getAccounts();
      return accounts[0];
    } catch (error) {
      console.error("Error getting current account:", error);
      return null;
    }
  }

  // Format blockchain data to frontend format
  private formatRaffleData(blockchainRaffle: any): RaffleData {
    return {
      raffleId: Number(blockchainRaffle.raffleId),
      name: blockchainRaffle.name,
      description: blockchainRaffle.description,
      imageURL: blockchainRaffle.imageURL,
      startTime: Number(blockchainRaffle.startTime),
      endTime: Number(blockchainRaffle.endTime),
      ticketPrice: this.web3!.utils.fromWei(blockchainRaffle.ticketPrice, 'ether'),
      prizeAmount: this.web3!.utils.fromWei(blockchainRaffle.prizeAmount, 'ether'),
      isCompleted: blockchainRaffle.isCompleted,
      winner: blockchainRaffle.winner,
      totalTicketsSold: Number(blockchainRaffle.totalTicketsSold),
      notificationImageURL: blockchainRaffle.notificationImageURL,
      notificationMessage: blockchainRaffle.notificationMessage,
      participants: Number(blockchainRaffle.totalTicketsSold) // Assuming one ticket per participant for UI
    };
  }

  // Get all active raffles
  async getActiveRaffles(): Promise<RaffleData[]> {
    try {
      if (!this.contract) {
        await this.init();
      }
      
      // Get active raffle IDs
      const activeRaffleIds = await this.contract.methods.getActiveRaffles().call();
      
      // Fetch data for each raffle
      const rafflePromises = activeRaffleIds.map(async (id: string) => {
        const raffleData = await this.contract.methods.getRaffle(id).call();
        return this.formatRaffleData(raffleData);
      });
      
      return await Promise.all(rafflePromises);
    } catch (error) {
      console.error("Error fetching active raffles:", error);
      toast.error("Failed to fetch active raffles");
      return [];
    }
  }

  // Get raffle by ID
  async getRaffleById(raffleId: number): Promise<RaffleData | null> {
    try {
      if (!this.contract) {
        await this.init();
      }
      
      const raffleData = await this.contract.methods.getRaffle(raffleId).call();
      return this.formatRaffleData(raffleData);
    } catch (error) {
      console.error(`Error fetching raffle ${raffleId}:`, error);
      toast.error(`Failed to fetch raffle details`);
      return null;
    }
  }

  // Buy raffle tickets
  async buyTickets(raffleId: number, quantity: number, ticketPrice: string): Promise<boolean> {
    try {
      if (!this.contract) {
        await this.init();
      }
      
      const account = await this.getCurrentAccount();
      if (!account) {
        toast.error("Please connect your wallet to purchase tickets");
        return false;
      }
      
      // Calculate total price in wei
      const totalPriceWei = this.web3!.utils.toWei(
        (parseFloat(ticketPrice) * quantity).toString(),
        'ether'
      );
      
      // Buy tickets
      const tx = await this.contract.methods.buyTicket(raffleId, quantity).send({
        from: account,
        value: totalPriceWei
      });
      
      toast.success(`Successfully purchased ${quantity} ticket${quantity > 1 ? 's' : ''}`);
      return true;
    } catch (error: any) {
      console.error(`Error buying tickets for raffle ${raffleId}:`, error);
      
      // Check for user rejected transaction
      if (error.code === 4001) {
        toast.error("Transaction cancelled by user");
      } else {
        toast.error(`Failed to purchase tickets: ${error.message}`);
      }
      
      return false;
    }
  }

  // Get user's tickets for a raffle
  async getUserTickets(raffleId: number): Promise<number[]> {
    try {
      if (!this.contract) {
        await this.init();
      }
      
      const account = await this.getCurrentAccount();
      if (!account) {
        return [];
      }
      
      const ticketIds = await this.contract.methods.getUserTickets(raffleId, account).call();
      return ticketIds.map((id: string) => Number(id));
    } catch (error) {
      console.error(`Error fetching user tickets for raffle ${raffleId}:`, error);
      return [];
    }
  }

  // Check if user has won a raffle
  async hasUserWon(raffleId: number): Promise<boolean> {
    try {
      if (!this.contract) {
        await this.init();
      }
      
      const account = await this.getCurrentAccount();
      if (!account) {
        return false;
      }
      
      return await this.contract.methods.hasUserWon(raffleId, account).call();
    } catch (error) {
      console.error(`Error checking if user won raffle ${raffleId}:`, error);
      return false;
    }
  }
  
  // Format countdown time
  formatTimeLeft(endTime: number): string {
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = endTime - now;
    
    if (timeLeft <= 0) {
      return "Ended";
    }
    
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    
    if (hours > 72) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

export default new RaffleBlockchainService();


// // services/raffleBlockchainService.ts

// import Web3 from "web3";
// import { ethers } from "ethers";
// import { toast } from "react-toastify";
// import { raffleContractAddress, raffleContractABI } from "@/config/raffleContractConfig";

// // Define raffle type (still useful for type safety)
// export interface RaffleData {
//   raffleId: number;
//   name: string;
//   description: string;
//   imageURL: string;
//   startTime: number;
//   endTime: number;
//   ticketPrice: string;
//   prizeAmount: string;
//   isCompleted: boolean;
//   winner: string;
//   totalTicketsSold: number;
//   notificationImageURL: string;
//   notificationMessage: string;
//   participants?: number; // For UI display
// }

// // Service class
// class RaffleBlockchainService {
//   private web3: Web3 | null = null;
//   private contract: any = null;
//   private provider: any = null;
//   private ethersContract: any = null;

//   // Initialize Web3 and contract
//   async init() {
//     // No need to re-initialize if it's already done
//     if (this.ethersContract) return true;

//     try {
//       if (typeof window.ethereum !== 'undefined') {
//         this.provider = new ethers.BrowserProvider(window.ethereum);
//         await window.ethereum.request({ method: 'eth_requestAccounts' });
//         this.web3 = new Web3(window.ethereum);
//         const signer = await this.provider.getSigner();
//         this.ethersContract = new ethers.Contract(raffleContractAddress, raffleContractABI, signer);
//         // Keep the web3.js contract instance if you use it for read-only calls
//         this.contract = new this.web3.eth.Contract(raffleContractABI, raffleContractAddress);
//         return true;
//       } else {
//         toast.error("MetaMask not installed. Please install MetaMask.");
//         return false;
//       }
//     } catch (error) {
//       console.error("Error initializing blockchain service:", error);
//       toast.error("Failed to connect to blockchain.");
//       return false;
//     }
//   }

//   // Get current account
//   async getCurrentAccount() {
//     if (!this.web3) await this.init();
//     const accounts = await this.web3!.eth.getAccounts();
//     return accounts[0];
//   }

//   // Buy raffle tickets - This is a direct user action
//   // async buyTickets(raffleId: number, quantity: number, ticketPrice: string): Promise<boolean> {
//   //   if (!this.ethersContract) await this.init();
    
//   //   try {
//   //     const totalPriceWei = ethers.parseEther((parseFloat(ticketPrice) * quantity).toString());
      
//   //     // Use the ethersContract with the signer to send a transaction
//   //     const tx = await this.ethersContract.buyTickets(raffleId, {
//   //       value: totalPriceWei
//   //     });
      
//   //     toast.info("Processing your purchase...");
//   //     await tx.wait(); // Wait for transaction confirmation
      
//   //     toast.success(`Successfully purchased ${quantity} ticket${quantity > 1 ? 's' : ''}`);
//   //     return true;
//   //   } catch (error: any) {
//   //     console.error(`Error buying tickets for raffle ${raffleId}:`, error);
//   //     if (error.code === 4001) {
//   //       toast.error("Transaction cancelled by user");
//   //     } else {
//   //       toast.error(`Failed to purchase tickets: ${error.reason || error.message}`);
//   //     }
//   //     return false;
//   //   }
//   // }


//   // Buy raffle tickets - This is a direct user action
//   async buyTickets(raffleId: number, quantity: number, ticketPrice: string): Promise<boolean> {
//     if (!this.ethersContract) {
//         const initialized = await this.init();
//         if (!initialized) return false;
//     }
    
//     try {
//       // --- THIS IS THE FIX ---
//       // 1. Convert the single ticket price string to a BigInt in Wei.
//       const ticketPriceInWei = ethers.parseEther(ticketPrice);

//       // 2. Convert the quantity to a BigInt.
//       const quantityAsBigInt = BigInt(quantity);

//       // 3. Perform the multiplication using precise BigInt arithmetic.
//       const totalPriceInWei = ticketPriceInWei * quantityAsBigInt;
      
//       console.log(`Attempting to purchase ${quantity} tickets for a total of ${totalPriceInWei.toString()} Wei.`);

//       // 4. Use the ethersContract with the signer to send the transaction.
//       // The `buyTickets` function in the contract only needs the raffleId.
//       // The quantity is derived on-chain from the `value` sent.
//       const tx = await this.ethersContract.buyTickets(raffleId, {
//         value: totalPriceInWei, // Send the precisely calculated total price.
//         gasLimit: 200000 + (50000 * quantity) // Dynamic gas limit
//       });
      
//       toast.info("Processing your purchase... Please wait for confirmation.");
      
//       // Wait for transaction to be mined
//       await tx.wait(); 
      
//       toast.success(`Successfully purchased ${quantity} ticket${quantity > 1 ? 's' : ''}!`);
//       return true;

//     } catch (error: any) {
//       console.error(`Error buying tickets for raffle ${raffleId}:`, error);
      
//       // Provide a more helpful error to the user
//       if (error.code === 4001) { // User rejected transaction in MetaMask
//         toast.error("Transaction cancelled by user.");
//       } else if (error.reason) { // Ethers often provides a reason
//         toast.error(`Transaction failed: ${error.reason}`);
//       } else {
//         toast.error(`Failed to purchase tickets. Please check the console for details.`);
//       }
//       return false;
//     }
//   }

//   // Get user's tickets for a raffle - This is a user-specific read action
//   async getUserTickets(raffleId: number): Promise<string[]> {
//     if (!this.contract) await this.init();
    
//     try {
//       const account = await this.getCurrentAccount();
//       if (!account) return [];
      
//       const ticketIds = await this.contract.methods.getUserTickets(raffleId, account).call();
//       return ticketIds.map((id: BigInt) => id.toString());
//     } catch (error) {
//       console.error(`Error fetching user tickets for raffle ${raffleId}:`, error);
//       return [];
//     }
//   }

//   // Format countdown time (utility function)
//   formatTimeLeft(endTime: number): string {
//     const now = Math.floor(Date.now() / 1000);
//     const timeLeft = endTime - now;
//     if (timeLeft <= 0) return "Ended";
//     const hours = Math.floor(timeLeft / 3600);
//     const minutes = Math.floor((timeLeft % 3600) / 60);
//     const seconds = timeLeft % 60;
//     if (hours > 72) {
//       const days = Math.floor(hours / 24);
//       return `${days}d ${hours % 24}h`;
//     }
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//   }
// }

// export default new RaffleBlockchainService();