// src/components/navbar/WalletConnect.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaWallet } from "react-icons/fa";
import Web3 from "web3";
import { toast } from "react-toastify";
import { ButtonOutline } from "../Buttons/Buttons"; // Adjust path as needed

interface WalletConnectProps {
  isLoggedin: boolean;
  // Add userData prop if specific user info is needed for wallet actions later
  // userData: User | null;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ isLoggedin }) => {
  const navigate = useNavigate();
  const [walletBalance, setWalletBalance] = useState("0.00");
  const [walletConnected, setWalletConnected] = useState(false);
  const [ethPrice, setEthPrice] = useState(0);

  // --- Wallet Connection & Balance ---
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          const accounts = (await window.ethereum.request({
            method: "eth_accounts",
          })) as string[];

          if (accounts && accounts.length > 0) {
            setWalletConnected(true);
            const balanceWei = await web3.eth.getBalance(accounts[0]);
            const balanceEth = web3.utils.fromWei(balanceWei, "ether");
            setWalletBalance(parseFloat(balanceEth).toFixed(4));
          } else {
            setWalletConnected(false);
            setWalletBalance("0.00");
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
          setWalletConnected(false);
          setWalletBalance("0.00");
        }
      } else {
        setWalletConnected(false);
        setWalletBalance("0.00");
      }
    };

    // Only check/listen if user is logged in (or adjust logic if needed otherwise)
    if (isLoggedin) {
      checkWalletConnection();

      const handleAccountsChanged = (accounts: string[]) => {
        console.log("Wallet accounts changed:", accounts);
        checkWalletConnection(); // Re-check connection and balance
      };

      if (window.ethereum) {
        window.ethereum.on("accountsChanged", handleAccountsChanged);
      }

      // Cleanup listener
      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
        }
      };
    } else {
      // Reset state if user logs out
      setWalletConnected(false);
      setWalletBalance("0.00");
    }
  }, [isLoggedin]); // Rerun check if login status changes

  // --- Fetch ETH Price ---
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

    // Only fetch price if wallet might be connected (or always if needed)
    if (isLoggedin) {
      fetchEthPrice(); // Initial fetch
      const priceInterval = setInterval(fetchEthPrice, 60000); // Refresh every minute
      return () => clearInterval(priceInterval); // Cleanup interval
    } else {
      setEthPrice(0); // Reset price if logged out
    }
  }, [isLoggedin]); // Rerun if login status changes

  // Calculate USD value
  const usdValue = (parseFloat(walletBalance) * ethPrice).toFixed(2);

  // --- Connect Wallet Function ---
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        // Balance and connection state will update via the 'accountsChanged' listener effect
        toast.success("Wallet connected successfully!");
      } catch (error: any) {
        console.error("Error connecting to wallet:", error);
        if (error.code === 4001) {
          toast.info("Wallet connection request rejected.");
        } else {
          toast.error("Failed to connect wallet. See console for details.");
        }
      }
    } else {
      toast.error(
        "MetaMask is not installed. Please install it to connect your wallet."
      );
    }
  };

  // Render nothing if user is not logged in
  if (!isLoggedin) {
    return null;
  }

  // Render connect button or wallet info
  return walletConnected ? (
    <div className="flex items-center space-x-3 bg-black/20 px-3 py-1.5 rounded-lg">
      <FaWallet className="text-green-400 text-lg" />
      <div className="flex flex-col items-start leading-tight">
        <span className="text-xs text-gray-400">Cash</span>
        <span className="font-semibold text-green-400 text-sm">
          ${usdValue}
        </span>
      </div>
      <ButtonOutline
        onClick={() => navigate("/deposit")}
        small
        className="ml-2"
      >
        Deposit
      </ButtonOutline>
    </div>
  ) : (
    <ButtonOutline onClick={connectWallet} small>
      Connect Wallet
    </ButtonOutline>
  );
};

export default WalletConnect;
