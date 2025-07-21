import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import { ethers } from "ethers";
import axios from "axios";
import { toast } from "react-toastify";
import MetamaskLogo from "@/assets/images/MetaMask-icon-fox.svg";

const MetaMaskLogin = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("AppContext must be used within an AppContextProvider");
  }
  const { backendUrl, setIsLoggedin, getUserData } = appContext;

  const loginWithMetaMask = async () => {
    console.log("MetaMask login button clicked");
    setIsSubmitting(true);

    if (!window.ethereum) {
      toast.error(
        "MetaMask is not installed! Please install MetaMask extension."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Requesting MetaMask connection...");
      const provider = new ethers.BrowserProvider(window.ethereum); // connect to user's MetaMask
      const signer = await provider.getSigner(); // to send transactions and to approve transactions
      const address = await signer.getAddress(); // get user's public wallet address
      console.log("Connected to address:", address);

      // 1. Request Nonce from Backend
      console.log("Requesting nonce from backend...");
      const { data } = await axios.get(
        `${backendUrl}/api/auth/metamask-nonce`,
        {
          params: { address },
        }
      );
      const nonce = data.nonce;
      console.log("Received nonce:", nonce);

      // 2. Sign Nonce
      console.log("Requesting signature from user...");
      const signature = await signer.signMessage(nonce); // (long hex string)
      console.log("Signature received:", signature.substring(0, 20) + "...");

      // 3. Send Signature to Backend
      console.log("Sending signature to backend...");
      const response = await axios.post(
        `${backendUrl}/api/auth/metamask-login`,
        { address, signature },
        { withCredentials: true } // Send cookies
      );

      if (response.data.success) {
        setIsLoggedin(true);
        getUserData();
        navigate("/");
      } else {
        toast.error(response.data.message || "MetaMask login failed");
      }
    } catch (error: any) {
      console.error("MetaMask login error:", error.response);
      toast.error(error.response?.data?.message || "MetaMask login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  //   const checkProtected = async () => {
  //     try {
  //       const response = await axios.get(`${backendUrl}/api/auth/metamask-protected`, {
  //         withCredentials: true,
  //       });
  //       toast.success(response.data.message);
  //     } catch (err: any) {
  //       toast.error(err.response.data.message);
  //     }
  //   }; // for testing purposes

  return (
    <div className="w-full mb-2">
      <button
        onClick={loginWithMetaMask}
        disabled={isSubmitting}
        className={`w-full flex items-center justify-center gap-3 py-3 px-5 bg-gray-800/40 hover:bg-gray-700/50 border border-gray-600/50 hover:border-gray-500/60 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none text-sm ${
          isSubmitting ? "" : ""
        }`}
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/70 border-t-white rounded-full animate-spin"></div>
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <img src={MetamaskLogo} className="w-4 h-4" alt="MetaMask Logo" />
            <span>Continue with MetaMask</span>
          </>
        )}
      </button>
    </div>
  );
};

export default MetaMaskLogin;
