import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaWallet } from "react-icons/fa";
import { toast } from "react-toastify";
import { ButtonOutline } from "../Buttons/Buttons";
import { useWallet } from "../../context/WalletContext";

interface WalletConnectProps {
  isLoggedin: boolean;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ isLoggedin }) => {
  const navigate = useNavigate();
  const { isConnected, walletAddress, connectWallet, web3, isConnecting } =
    useWallet();
  const [walletBalance, setWalletBalance] = useState<string>("0.00");
  const [ethPrice, setEthPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch wallet balance when connection state changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected && walletAddress && web3) {
        try {
          const balanceWei = await web3.eth.getBalance(walletAddress);
          const balanceEth = web3.utils.fromWei(balanceWei, "ether");
          setWalletBalance(parseFloat(balanceEth).toFixed(4));
        } catch (error) {
          console.error("Error fetching wallet balance:", error);
          setWalletBalance("0.00");
        }
      } else {
        setWalletBalance("0.00");
      }
    };

    if (isLoggedin) {
      fetchBalance();

      // Set up interval to update balance periodically
      const balanceInterval = setInterval(fetchBalance, 30000); // Every 30 seconds
      return () => clearInterval(balanceInterval);
    } else {
      setWalletBalance("0.00");
    }
  }, [isConnected, walletAddress, web3, isLoggedin]);

  // Fetch ETH Price
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data?.ethereum?.usd) {
          setEthPrice(data.ethereum.usd);
        } else {
          console.warn("Could not extract ETH price from API response:", data);
        }
      } catch (error) {
        console.error("Error fetching ETH price:", error);
      }
    };

    if (isLoggedin) {
      fetchEthPrice();
      const priceInterval = setInterval(fetchEthPrice, 60000);
      return () => clearInterval(priceInterval);
    } else {
      setEthPrice(0);
    }
  }, [isLoggedin]);

  // Calculate USD value
  const usdValue = (parseFloat(walletBalance) * ethPrice).toFixed(2);

  // Handle wallet connection with toast notifications
  const handleConnectWallet = async () => {
    if (isConnecting || isLoading) {
      toast.info(
        "Connection already in progress. Please check MetaMask popup."
      );
      return;
    }

    setIsLoading(true);

    try {
      await connectWallet();
      toast.success("Wallet connected successfully!");
    } catch (error: any) {
      console.error("Error connecting to wallet:", error);
      if (error.code === 4001) {
        toast.info("Wallet connection request rejected.");
      } else if (error.code === -32002) {
        toast.info(
          "Connection request already pending. Please check MetaMask."
        );
      } else {
        toast.error(
          error.message || "Failed to connect wallet. See console for details."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Render nothing if user is not logged in
  if (!isLoggedin) {
    return null;
  }

  // Render connect button or wallet info
  return isConnected ? (
    <div className="flex items-center space-x-3 bg-[#1C1C27] border border-gray-700/60 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl hover:border-secondary/40 transition-all duration-300">
      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
        <FaWallet className="text-green-400 text-sm" />
      </div>
      <div className="flex flex-col items-start leading-tight">
        <span className="text-xs text-dark-secondary font-medium">Balance</span>
        <span className="font-bold text-green-400 text-sm">${usdValue}</span>
      </div>
      <ButtonOutline
        onClick={() => navigate("/deposit")}
        small
        className="ml-2 text-sm px-4 py-1.5 bg-secondary/10 hover:bg-secondary/20 text-secondary border-secondary/30 hover:border-secondary/50 font-medium transition-all duration-300 hover:shadow-lg"
      >
        <span className="hidden sm:inline">Deposit</span>
        <span className="sm:hidden">+</span>
      </ButtonOutline>
    </div>
  ) : (
    <ButtonOutline
      onClick={handleConnectWallet}
      small
      disabled={isConnecting || isLoading}
      className="text-sm px-4 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary border-secondary/30 hover:border-secondary/50 font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="hidden sm:inline">
        {isConnecting || isLoading ? "Connecting..." : "Connect Wallet"}
      </span>
      <span className="sm:hidden">
        {isConnecting || isLoading ? "..." : "Connect"}
      </span>
    </ButtonOutline>
  );
};

export default WalletConnect;
