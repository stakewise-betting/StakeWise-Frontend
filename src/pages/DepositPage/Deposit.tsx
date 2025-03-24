import MoonPayWidget from "../../components/Moonpay/MoonPayWidget";
import { Wallet, ArrowDownCircle, Info, Copy, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import Web3 from "web3";

const DepositPage = () => {
  const moonPayApiKey = "pk_test_DJvwdrDtU8GG2AWNFX4PRovc7AdY62"; // Replace with your actual MoonPay API key
  const [userWalletAddress, setUserWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("0.00");
  const [balanceUsd, setBalanceUsd] = useState("0.00");
  const [isConnected, setIsConnected] = useState(false);
  const [ethPrice, setEthPrice] = useState("0.00");
  const [ethPriceChange, setEthPriceChange] = useState("0.00%");
  const [gasPrice, setGasPrice] = useState("0");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch ETH price from CoinGecko API
  const fetchEthPrice = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true"
      );
      const data = await response.json();

      if (data && data.ethereum) {
        // Format price with commas
        const formattedPrice = data.ethereum.usd.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        setEthPrice(formattedPrice);

        // Format price change
        const priceChange = data.ethereum.usd_24h_change.toFixed(2);
        const priceChangeFormatted =
          priceChange > 0 ? `+${priceChange}%` : `${priceChange}%`;
        setEthPriceChange(priceChangeFormatted);

        // Update USD balance if wallet is connected
        if (walletBalance !== "0.00") {
          const usdValue = (
            parseFloat(walletBalance) * data.ethereum.usd
          ).toFixed(2);
          setBalanceUsd(usdValue);
        }
      }
    } catch (error) {
      console.error("Error fetching ETH price:", error);
    }
  };

  useEffect(() => {
    // Fetch ETH price when component mounts
    fetchEthPrice();

    // Set up interval to refresh price every minute
    const priceInterval = setInterval(fetchEthPrice, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(priceInterval);
  }, []);

  // Update USD balance when ETH price or wallet balance changes
  useEffect(() => {
    if (ethPrice !== "0.00" && walletBalance !== "0.00") {
      const rawPrice = parseFloat(ethPrice.replace(/,/g, ""));
      const usdValue = (parseFloat(walletBalance) * rawPrice).toFixed(2);
      setBalanceUsd(usdValue);
    }
  }, [ethPrice, walletBalance]);

  const checkIfWalletIsConnected = async () => {
    setIsLoading(true);
    try {
      // Check if window.ethereum is available (MetaMask installed)
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);

        // Get accounts
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          setUserWalletAddress(accounts[0]);
          setIsConnected(true);

          // Get balance
          const balanceWei = await web3.eth.getBalance(accounts[0]);
          const balanceEth = web3.utils.fromWei(balanceWei, "ether");
          const formattedBalance = parseFloat(balanceEth).toFixed(4);
          setWalletBalance(formattedBalance);

          // Calculate USD value with current ETH price
          if (ethPrice !== "0.00") {
            const rawPrice = parseFloat(ethPrice.replace(/,/g, ""));
            const usdValue = (parseFloat(formattedBalance) * rawPrice).toFixed(
              2
            );
            setBalanceUsd(usdValue);
          }

          // Get gas price
          const gasPriceWei = await web3.eth.getGasPrice();
          const gasPriceGwei = web3.utils.fromWei(gasPriceWei, "gwei");
          setGasPrice(parseFloat(gasPriceGwei).toFixed(0));
        }
      }
    } catch (error) {
      console.error("Error connecting to MetaMask", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        checkIfWalletIsConnected();
      } else {
        alert(
          "MetaMask is not installed. Please install MetaMask to use this feature."
        );
      }
    } catch (error) {
      console.error("Error connecting to MetaMask", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(userWalletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortenAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string) => {
        if (accounts.length > 0) {
          checkIfWalletIsConnected();
        } else {
          setIsConnected(false);
          setUserWalletAddress("");
          setWalletBalance("0.00");
          setBalanceUsd("0.00");
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          checkIfWalletIsConnected
        );
      }
    };
  }, []);

  if (!isConnected && !isLoading) {
    return (
      <div className="min-h-screen bg-primary p-6 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-bold text-DFprimary mb-2 flex items-center">
            <Wallet className="mr-2 text-secondary" />
            Deposit Funds
          </h1>
          <p className="text-sub mb-6">
            Connect your wallet to deposit ETH quickly and securely
          </p>

          <Card className="bg-card border-none shadow-lg text-center p-8">
            <AlertCircle className="mx-auto mb-4 text-secondary" size={48} />
            <CardTitle className="text-xl text-DFprimary mb-4">
              Wallet Not Connected
            </CardTitle>
            <CardDescription className="text-sub mb-6">
              Please connect your MetaMask wallet to continue
            </CardDescription>
            <Button
              onClick={connectWallet}
              className="bg-secondary text-white hover:bg-secondary/90"
            >
              Connect Wallet
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Determine text color for price change
  const priceChangeColor = ethPriceChange.startsWith("+")
    ? "text-green"
    : "text-red-500";

  return (
    <div className="min-h-screen bg-primary p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-DFprimary mb-2 flex items-center">
          <Wallet className="mr-2 text-secondary" />
          Deposit Funds
        </h1>
        <p className="text-sub mb-6">
          Add ETH to your wallet quickly and securely
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-card text-DFprimary border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{walletBalance} ETH</p>
              <p className="text-sub text-sm">≈ ${balanceUsd} USD</p>
            </CardContent>
          </Card>

          <Card className="bg-card text-DFprimary border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Gas Price</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{gasPrice} Gwei</p>
              <p className="text-green text-sm">Low fees right now</p>
            </CardContent>
          </Card>

          <Card className="bg-card text-DFprimary border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">ETH Price</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${ethPrice}</p>
              <p className={`${priceChangeColor} text-sm`}>
                {ethPriceChange} (24h)
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-none shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-DFprimary">
              Your Wallet
            </CardTitle>
            <CardDescription className="text-sub">
              This is where your purchased ETH will be deposited
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between bg-primary p-3 rounded-lg">
              <p className="text-DFprimary font-mono">
                {shortenAddress(userWalletAddress)}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="text-secondary hover:text-secondary hover:bg-primary/50"
              >
                {copied ? "Copied!" : <Copy size={16} />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Alert className="bg-card border-secondary border-l-4 mb-6">
          <Info className="h-4 w-4 text-secondary" />
          <AlertTitle className="text-DFprimary">Fast & Secure</AlertTitle>
          <AlertDescription className="text-sub">
            MoonPay allows you to buy ETH with credit card, debit card, or bank
            transfer. Funds are sent directly to your wallet.
          </AlertDescription>
        </Alert>

        <Card className="bg-card border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-DFprimary flex items-center">
              <ArrowDownCircle className="mr-2 text-secondary" size={20} />
              Buy ETH with MoonPay
            </CardTitle>
            <CardDescription className="text-sub">
              Purchase ETH using credit card, debit card, or bank transfer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-primary p-4 rounded-lg">
              <MoonPayWidget
                apiKey={moonPayApiKey}
                walletAddress={userWalletAddress}
              />
            </div>
          </CardContent>
          <CardFooter className="text-sub text-sm">
            Processing times may vary depending on payment method and network
            congestion.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DepositPage;
