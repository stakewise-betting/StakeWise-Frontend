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
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum); // connect to user's MetaMask
    const signer = await provider.getSigner(); // to send transactions and to approve transactions
    const address = await signer.getAddress(); // get user's public wallet address

    // 1. Request Nonce from Backend 
    // to ensures every login request is unique
    // to prevent replay attacks
    const { data } = await axios.get(`${backendUrl}/api/auth/metamask-nonce`, {
      params: { address },
    });
    const nonce = data.nonce;

    // 2. Sign Nonce
    // metamask will prompt user to sign the nonce(pop-up)
    const signature = await signer.signMessage(nonce); // (long hex string)


    try {
        // Send Google token to backend for verification
        // 3. Send Signature to Backend
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
      }finally {
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
    <div>
        {/* MetaMask Login Button */}
        <div className="flex justify-center my-4">
          <button
            onClick={loginWithMetaMask}
            disabled={isSubmitting}
            className={`flex items-center justify-center gap-5 w-3/4 py-2 px-4 bg-blue-500 text-white rounded-lg transition ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
          >
            <img src={MetamaskLogo} className="w-8 h-8" alt="MetaMask Logo" />
            {isSubmitting ? "Connecting..." : "Connect with MetaMask"}
          </button>
        </div>
      {/* <button onClick={checkProtected} className="bg-red">Check Protected Route</button> */}
    </div>
  );
};

export default MetaMaskLogin;
