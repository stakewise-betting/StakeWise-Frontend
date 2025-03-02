// services/blockchainService.ts
import Web3 from "web3";
import { contractABI, contractAddress } from "../config/contractConfig";

const setupWeb3AndContract = async () => {
  let web3Instance: Web3 | null = null;
  let betContract: any = null;

  if ((window as any).ethereum) {
    web3Instance = new Web3((window as any).ethereum);
    try {
      await (window as any).ethereum.enable();
      betContract = new web3Instance.eth.Contract(contractABI, contractAddress);
    } catch (error) {
      console.error("User denied account access or error connecting to MetaMask", error);
      alert("User denied account access or error connecting to MetaMask");
    }
  } else {
    alert("Please install MetaMask to continue.");
  }

  return { web3Instance, betContract };
};

export default setupWeb3AndContract;