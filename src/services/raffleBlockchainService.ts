// //StakeWise-Frontend/src/services/raffleBlockchainService.ts
// import Web3 from "web3";
// import { Contract } from "web3-eth-contract";
// import { raffleContractABI, raffleContractAddress } from "@/config/raffleContractConfig";

// // This interface defines the structure of raffle data returned from the blockchain
// export interface Raffle {
//   raffleId: string;
//   name: string;
//   imageURL: string;
//   category: string;
//   startTime: string;
//   endTime: string;
//   ticketPrice: string; // in ETH
//   prizeAmount: string; // in ETH
//   isCompleted: boolean;
//   winner: string; // address
//   totalTicketsSold: string;
// }

// class RaffleService {
//   private web3: Web3 | null = null;
//   private contract: Contract<typeof raffleContractABI> | null = null;

//   private async _getWeb3AndContract(): Promise<{ web3: Web3; contract: Contract<typeof raffleContractABI> }> {
//     if (this.web3 && this.contract) {
//       return { web3: this.web3, contract: this.contract };
//     }

//     if (!(window as any).ethereum) {
//       throw new Error("MetaMask not detected. Please install MetaMask.");
//     }

//     const web3Instance = new Web3((window as any).ethereum);
//     await (window as any).ethereum.request({ method: "eth_requestAccounts" });
    
//     const contractInstance = new web3Instance.eth.Contract(
//       raffleContractABI,
//       raffleContractAddress
//     );

//     this.web3 = web3Instance;
//     this.contract = contractInstance;

//     return { web3: this.web3, contract: this.contract };
//   }

//   private _formatRaffle(data: any): Raffle {
//       const { web3 } = this;
//       if (!web3) throw new Error("Web3 not initialized");

//       return {
//         raffleId: data.raffleId.toString(),
//         name: data.name,
//         imageURL: data.imageURL,
//         category: data.category,
//         startTime: data.startTime.toString(),
//         endTime: data.endTime.toString(),
//         ticketPrice: web3.utils.fromWei(data.ticketPrice.toString(), "ether"),
//         prizeAmount: web3.utils.fromWei(data.prizeAmount.toString(), "ether"),
//         isCompleted: data.isCompleted,
//         winner: data.winner,
//         totalTicketsSold: data.totalTicketsSold.toString(),
//       };
//   }

//   public async getAllRaffles(): Promise<Raffle[]> {
//       const { contract } = await this._getWeb3AndContract();
      
//       // CORRECTION: Explicitly type the result and provide a fallback empty array.
//       const allRaffleIds: string[] = (await contract.methods.getAllRaffleIds().call()) || [];

//       // If no IDs are returned, we can exit early.
//       if (!allRaffleIds || allRaffleIds.length === 0) {
//           return [];
//       }

//       const rafflePromises = allRaffleIds.map((id: string) => 
//           contract.methods.getRaffle(id).call()
//       );

//       const rafflesData = await Promise.all(rafflePromises);
//       return rafflesData.map(data => this._formatRaffle(data));
//   }
  
//   public async getRaffleById(raffleId: string): Promise<Raffle> {
//       const { contract } = await this._getWeb3AndContract();
//       const data = await contract.methods.getRaffle(raffleId).call();
//       return this._formatRaffle(data);
//   }

//   public async createRaffle(
//     name: string,
//     imageURL: string,
//     category: string,
//     startTime: number, // unix timestamp
//     endTime: number,   // unix timestamp
//     ticketPrice: string, // in ETH
//     prizeAmount: string // in ETH
//   ): Promise<string> { // returns transaction hash
//     const { web3, contract } = await this._getWeb3AndContract();
//     const accounts = await web3.eth.getAccounts();
//     const adminAddress = accounts[0];

//     const ticketPriceInWei = web3.utils.toWei(ticketPrice, "ether");
//     const prizeAmountInWei = web3.utils.toWei(prizeAmount, "ether");

//     const tx = await contract.methods.createRaffle(
//         name, imageURL, category, startTime, endTime, ticketPriceInWei, prizeAmountInWei
//     ).send({ from: adminAddress, value: prizeAmountInWei });
    
//     return tx.transactionHash;
//   }

//   public async buyTickets(raffleId: string, quantity: number): Promise<string> {
//     const { web3, contract } = await this._getWeb3AndContract();
//     const accounts = await web3.eth.getAccounts();
//     const userAddress = accounts[0];

//     const raffle = await this.getRaffleById(raffleId);
//     const ticketPriceInWei = web3.utils.toWei(raffle.ticketPrice, "ether");
//     const totalCostInWei = BigInt(ticketPriceInWei) * BigInt(quantity);

//     const tx = await contract.methods.buyTickets(raffleId, quantity).send({
//         from: userAddress,
//         value: totalCostInWei.toString(),
//     });
    
//     return tx.transactionHash;
//   }

//   public async drawWinner(raffleId: string): Promise<string> {
//       const { contract, web3 } = await this._getWeb3AndContract();
//       const accounts = await web3.eth.getAccounts();
//       const adminAddress = accounts[0];

//       const tx = await contract.methods.drawWinner(raffleId).send({ from: adminAddress });
//       return tx.transactionHash;
//   }
// }

// export const raffleService = new RaffleService();

import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { raffleContractABI, raffleContractAddress } from "@/config/raffleContractConfig";

export interface Raffle {
  raffleId: string;
  name: string;
  imageURL: string;
  category: string;
  startTime: string;
  endTime: string;
  ticketPrice: string;
  prizeAmount: string;
  isCompleted: boolean;
  winner: string;
  totalTicketsSold: string;
}

class RaffleService {
  private web3: Web3 | null = null;
  private contract: Contract<typeof raffleContractABI> | null = null;

  private async _getWeb3AndContract(): Promise<{ web3: Web3; contract: Contract<typeof raffleContractABI> }> {
    if (this.web3 && this.contract) {
      return { web3: this.web3, contract: this.contract };
    }

    if (!(window as any).ethereum) {
      throw new Error("MetaMask not detected. Please install MetaMask.");
    }

    const web3Instance = new Web3((window as any).ethereum);
    await (window as any).ethereum.request({ method: "eth_requestAccounts" });
    
    const contractInstance = new web3Instance.eth.Contract(
      raffleContractABI,
      raffleContractAddress
    );

    this.web3 = web3Instance;
    this.contract = contractInstance;

    return { web3: this.web3, contract: this.contract };
  }

  private _formatRaffle(data: any): Raffle {
      const { web3 } = this;
      if (!web3) throw new Error("Web3 not initialized");

      return {
        raffleId: data.raffleId.toString(),
        name: data.name,
        imageURL: data.imageURL,
        category: data.category,
        startTime: data.startTime.toString(),
        endTime: data.endTime.toString(),
        ticketPrice: web3.utils.fromWei(data.ticketPrice.toString(), "ether"),
        prizeAmount: web3.utils.fromWei(data.prizeAmount.toString(), "ether"),
        isCompleted: data.isCompleted,
        winner: data.winner,
        totalTicketsSold: data.totalTicketsSold.toString(),
      };
  }

  public async getAllRaffles(): Promise<Raffle[]> {
      const { contract } = await this._getWeb3AndContract();
      
      const allRaffleIds: string[] = (await contract.methods.getAllRaffleIds().call()) || [];

      if (!allRaffleIds || allRaffleIds.length === 0) {
          return [];
      }

      const rafflePromises = allRaffleIds.map((id: string) => 
          contract.methods.getRaffle(id).call()
      );

      const rafflesData = await Promise.all(rafflePromises);
      return rafflesData.map(data => this._formatRaffle(data));
  }
  
  public async getRaffleById(raffleId: string): Promise<Raffle> {
      const { contract } = await this._getWeb3AndContract();
      const data = await contract.methods.getRaffle(raffleId).call();
      return this._formatRaffle(data);
  }

  public async createRaffle(
    name: string,
    imageURL: string,
    category: string,
    startTime: number,
    endTime: number,
    ticketPrice: string,
    prizeAmount: string
  ): Promise<string> {
    const { web3, contract } = await this._getWeb3AndContract();
    const accounts = await web3.eth.getAccounts();
    const adminAddress = accounts[0];

    const ticketPriceInWei = web3.utils.toWei(ticketPrice, "ether");
    const prizeAmountInWei = web3.utils.toWei(prizeAmount, "ether");

    const tx = await contract.methods.createRaffle(
        name, imageURL, category, startTime, endTime, ticketPriceInWei, prizeAmountInWei
    ).send({ from: adminAddress, value: prizeAmountInWei });
    
    return tx.transactionHash;
  }

  public async buyTickets(raffleId: string, quantity: number): Promise<string> {
    const { web3, contract } = await this._getWeb3AndContract();
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];

    const raffle = await this.getRaffleById(raffleId);
    const ticketPriceInWei = web3.utils.toWei(raffle.ticketPrice, "ether");
    const totalCostInWei = BigInt(ticketPriceInWei) * BigInt(quantity);

    const tx = await contract.methods.buyTickets(raffleId, quantity).send({
        from: userAddress,
        value: totalCostInWei.toString(),
    });
    
    return tx.transactionHash;
  }

  public async drawWinner(raffleId: string): Promise<string> {
      const { contract, web3 } = await this._getWeb3AndContract();
      const accounts = await web3.eth.getAccounts();
      const adminAddress = accounts[0];

      const tx = await contract.methods.drawWinner(raffleId).send({ from: adminAddress });
      return tx.transactionHash;
  }

  // NEW METHOD: End raffle with no tickets sold
  public async endRaffle(raffleId: string): Promise<string> {
      const { contract, web3 } = await this._getWeb3AndContract();
      const accounts = await web3.eth.getAccounts();
      const adminAddress = accounts[0];

      const tx = await contract.methods.endRaffle(raffleId).send({ from: adminAddress });
      return tx.transactionHash;
  }
}

export const raffleService = new RaffleService();