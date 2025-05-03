// context/WalletContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import Web3 from 'web3';
import setupWeb3AndContract from '@/services/blockchainService';

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  web3: Web3 | null;
  contract: any | null;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const connectionAttemptRef = useRef<boolean>(false);

  const connectWallet = async (): Promise<void> => {
    // Prevent multiple simultaneous connection attempts
    if (isConnecting || connectionAttemptRef.current) {
      console.log("Connection attempt already in progress");
      return;
    }

    try {
      setIsConnecting(true);
      connectionAttemptRef.current = true;

      // Add a small delay to ensure any previous pending requests have time to resolve
      await new Promise(resolve => setTimeout(resolve, 500));

      const { web3Instance, betContract } = await setupWeb3AndContract();
      
      if (web3Instance && betContract) {
        const accounts = await web3Instance.eth.getAccounts();
        setWalletAddress(accounts[0]);
        setWeb3(web3Instance);
        setContract(betContract);
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error; // Re-throw so calling code can handle the error
    } finally {
      setIsConnecting(false);
      // Reset the connection attempt flag after a short delay
      setTimeout(() => {
        connectionAttemptRef.current = false;
      }, 1000);
    }
  };

  useEffect(() => {
    // Try to connect automatically if MetaMask is already unlocked
    const checkConnection = async (): Promise<void> => {
      if ((window as any).ethereum && (window as any).ethereum.selectedAddress) {
        try {
          await connectWallet();
        } catch (error) {
          console.error("Auto-connection failed:", error);
        }
      }
    };
    
    // Small delay before checking to avoid race conditions
    const timer = setTimeout(() => {
      checkConnection();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Setup listeners for MetaMask events
  useEffect(() => {
    if (!(window as any).ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsConnected(true);
      } else {
        setWalletAddress(null);
        setIsConnected(false);
      }
    };

    const handleChainChanged = () => {
      // Reload the page when the chain changes
      window.location.reload();
    };

    const handleDisconnect = () => {
      setWalletAddress(null);
      setIsConnected(false);
    };

    const ethereum = (window as any).ethereum;
    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('chainChanged', handleChainChanged);
    ethereum.on('disconnect', handleDisconnect);

    return () => {
      ethereum.removeListener('accountsChanged', handleAccountsChanged);
      ethereum.removeListener('chainChanged', handleChainChanged);
      ethereum.removeListener('disconnect', handleDisconnect);
    };
  }, []);

  return (
    <WalletContext.Provider value={{ 
      isConnected, 
      walletAddress, 
      connectWallet,
      web3,
      contract,
      isConnecting
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};