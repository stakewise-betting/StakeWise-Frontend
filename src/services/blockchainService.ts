// services/blockchainService.ts
import Web3 from "web3";
import { ContractAbi } from "web3-types";
import { contractABI, contractAddress } from "../config/contractConfig";

interface SetupResult {
  web3Instance: Web3 | null;
  betContract: any | null;
}

interface EventOdds {
  optionName: string;
  oddsPercentage: string;
}

interface EventDetails {
  eventId: string;
  name: string;
  description: string;
  imageURL: string;
  options: string[];
  startTime: string;
  endTime: string;
  isCompleted: boolean;
  winningOption: string;
  prizePool: string;
  rules: string;
  notificationImageURL: string;
  notificationMessage: string;
}

interface UserBet {
  eventId: string;
  eventName: string;
  market: string;
  outcome: string;
  price: string;
  status: string;
}

// Keep a reference to avoid creating multiple instances
let web3Instance: Web3 | null = null;
let betContract: any = null;

const setupWeb3AndContract = async (): Promise<SetupResult> => {
  // Return existing instances if already set up
  if (web3Instance && betContract) {
    return { web3Instance, betContract };
  }

  if (!(window as any).ethereum) {
    console.error("MetaMask not detected");
    return { web3Instance: null, betContract: null };
  }

  // Create new Web3 instance
  web3Instance = new Web3((window as any).ethereum);

  try {
    // Use request method instead of enable
    await (window as any).ethereum.request({ 
      method: 'eth_requestAccounts',
      // Add timeout to prevent long-running requests
      params: [{ timeout: 10000 }] 
    });
    
    // Create contract instance
    betContract = new web3Instance.eth.Contract(
      contractABI as unknown as ContractAbi,
      contractAddress
    );
    
    return { web3Instance, betContract };
  } catch (error: any) {
    console.error("Error connecting to MetaMask:", error);
    
    // Clear instances on error
    web3Instance = null;
    betContract = null;
    
    // Handle different error types
    if (error.code === -32002) {
      throw new Error("MetaMask connection request already pending. Please check MetaMask and try again in a moment.");
    } else if (error.code === 4001) {
      throw new Error("MetaMask connection rejected by user.");
    } else {
      throw new Error(`MetaMask connection failed: ${error.message || "Unknown error"}`);
    }
  }
};

export const getUserBets = async (): Promise<UserBet[]> => {
  try {
    const { web3Instance, betContract } = await setupWeb3AndContract();
    
    if (!web3Instance || !betContract) {
      throw new Error("Web3 or contract not initialized");
    }
    
    // Get current account
    const accounts = await web3Instance.eth.getAccounts();
    const userAddress = accounts[0];
    
    // Get all event IDs
    const eventIds: string[] = await betContract.methods
      .getAllEventIds()
      .call();
    
    // Array to store user's bets
    const userBets: UserBet[] = [];
    
    // For each event, check if the user has placed a bet
    for (const eventId of eventIds) {
      const result = await betContract.methods
        .getUserBet(eventId, userAddress)
        .call();
      
      const option = result[0]; // or result.option if Web3 maps named returns
      const amount = result[1]; // or result.amount
      const exists = result[2]; // or result.exists
      
      if (exists) {
        // Get event details
        const eventDetails: EventDetails = await betContract.methods
          .getEvent(eventId)
          .call();
        
        // Format the bet amount from wei to ETH
        const formattedAmount = web3Instance.utils.fromWei(amount, "ether");
        
        // Get event odds
        const odds: EventOdds[] = await betContract.methods
          .getEventOdds(eventId)
          .call();
          
        const optionOdds = odds.find((odd) => odd.optionName === option);
        
        userBets.push({
          eventId: eventId,
          eventName: eventDetails.name,
          market: eventDetails.description,
          outcome: option,
          price: `${formattedAmount} ETH (${
            optionOdds ? optionOdds.oddsPercentage : 0
          }%)`,
          status: eventDetails.isCompleted
            ? eventDetails.winningOption === option
              ? "Won"
              : "Lost"
            : "In Progress",
        });
      }
    }
    
    return userBets;
  } catch (error) {
    console.error("Error fetching user bets:", error);
    throw error;
  }
};

export default setupWeb3AndContract;