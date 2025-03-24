import { useState, useContext, useEffect } from "react";
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

    useEffect(() => {
        if (!window.ethereum) {
            toast.error("MetaMask is not installed!");
        }
    }, []);

    const loginWithMetaMask = async () => {
        if (!window.ethereum) {
            toast.error("MetaMask is not installed!");
            return;
        }

        if (!backendUrl) {
            toast.error("Backend URL is not set.");
            return;
        }

        setIsSubmitting(true);

        try {
            console.log("Requesting MetaMask access...");

            // Request account access
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

            if (!accounts || accounts.length === 0) {
                throw new Error("MetaMask access denied or no accounts found.");
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            console.log("Connected to MetaMask. Address:", address);

            // Request nonce from backend
            const { data } = await axios.get(`${backendUrl}/api/auth/metamask-nonce`, {
                params: { address },
            });

            const nonce = String(data.nonce);
            console.log("Nonce received:", nonce);

            // Sign the nonce
            console.log("Signing message...");
            const signature = await signer.signMessage(nonce);
            console.log("Signature received:", signature);

            // Send signature to backend
            const response = await axios.post(
                `${backendUrl}/api/auth/metamask-login`,
                { address, signature },
                { withCredentials: true }
            );

            if (response.data.success) {
                console.log("Login successful.");
                setIsLoggedin(true);
                getUserData();
                navigate("/");
            } else {
                toast.error(response.data.message || "MetaMask login failed");
            }
        } catch (error) {
          console.error("MetaMask login error:", error);
      
          if (axios.isAxiosError(error)) {
              toast.error(error.response?.data?.message || "MetaMask login failed");
          } else if (error instanceof Error) {
              toast.error(error.message || "An unknown error occurred");
          } else {
              toast.error("An unknown error occurred");
          }
      }
       finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="flex justify-center my-4">
                <button
                    onClick={loginWithMetaMask}
                    disabled={isSubmitting}
                    className={`flex items-center justify-center gap-5 w-3/4 py-2 px-4 bg-blue-500 text-white rounded-lg transition ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                    }`}
                >
                    <img src={MetamaskLogo} className="w-8 h-8" alt="MetaMask Logo" />
                    {isSubmitting ? "Connecting..." : "Connect with MetaMask"}
                </button>
            </div>
        </div>
    );
};

export default MetaMaskLogin;