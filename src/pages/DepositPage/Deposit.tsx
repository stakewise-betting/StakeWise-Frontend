import { useState, useEffect } from "react";
import Web3 from "web3";
import {
  Wallet,
  ArrowDownCircle,
  Info,
  Copy,
  AlertCircle,
  Clock,
  TrendingUp,
  ChevronRight,
  Shield,
  RefreshCw,
} from "lucide-react";
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
import MoonPayWidget from "../../components/Moonpay/MoonPayWidget";

const DepositPage = () => {
  const moonPayApiKey = "pk_test_DJvwdrDtU8GG2AWNFX4PRovc7AdY62";
  const [userWalletAddress, setUserWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("0.00");
  const [balanceUsd, setBalanceUsd] = useState("0.00");
  const [isConnected, setIsConnected] = useState(false);
  const [ethPrice, setEthPrice] = useState("0.00");
  const [ethPriceChange, setEthPriceChange] = useState("0.00%");
  const [gasPrice, setGasPrice] = useState("0");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const refreshWalletData = async () => {
    setIsRefreshing(true);
    await checkIfWalletIsConnected();
    await fetchEthPrice();
    setTimeout(() => setIsRefreshing(false), 1000); // Minimum 1s animation
  };

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

  // Card styling based on the admin dashboard examples
  const cardClasses = `
    bg-card text-dark-primary rounded-xl shadow-lg
    border border-gray-700/60
    transition-all duration-300 ease-in-out
    hover:shadow-xl hover:border-secondary/50
    hover:-translate-y-1
    overflow-hidden relative
    bg-noise
    dark
  `;

  // Determine text color for price change
  const priceChangeColor = ethPriceChange.startsWith("+")
    ? "text-green"
    : "text-red-500";

  if (!isConnected && !isLoading) {
    return (
      <div className="min-h-screen bg-primary p-6 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-bold text-dark-primary mb-2 flex items-center">
            <Wallet className="mr-3 text-secondary" />
            Deposit Funds
          </h1>
          <p className="text-dark-secondary mb-8">
            Connect your wallet to deposit ETH quickly and securely
          </p>

          <Card className={`${cardClasses} text-center p-8`}>
            <div className="p-4 rounded-full bg-secondary/10 mx-auto mb-6">
              <AlertCircle className="text-secondary" size={48} />
            </div>
            <CardTitle className="text-2xl text-dark-primary mb-4">
              Wallet Not Connected
            </CardTitle>
            <CardDescription className="text-dark-secondary mb-8 text-lg">
              Please connect your MetaMask wallet to continue with the deposit
              process
            </CardDescription>
            <Button
              onClick={connectWallet}
              className="bg-secondary/20 border border-secondary/60 text-secondary hover:bg-secondary hover:text-white hover:border-secondary transition-all duration-300 ease-in-out px-6 py-3 text-lg font-medium"
            >
              Connect Wallet <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-dark-primary mb-2 flex items-center">
              <Wallet className="mr-3 text-secondary" />
              Deposit Funds
            </h1>
            <p className="text-dark-secondary">
              Add ETH to your wallet quickly and securely
            </p>
          </div>

          <Button
            onClick={refreshWalletData}
            disabled={isRefreshing}
            className="bg-secondary/10 border border-secondary/40 text-secondary hover:bg-secondary/20 hover:border-secondary/60 transition-all duration-300"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className={cardClasses}>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-lg flex items-center">
                <div className="p-1.5 rounded-full bg-secondary/10 text-secondary mr-2">
                  <Wallet className="h-4 w-4" />
                </div>
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{walletBalance} ETH</p>
              <p className="text-dark-secondary text-sm">≈ ${balanceUsd} USD</p>
            </CardContent>
          </Card>

          <Card className={cardClasses}>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-lg flex items-center">
                <div className="p-1.5 rounded-full bg-admin-info/10 text-admin-info mr-2">
                  <Clock className="h-4 w-4" />
                </div>
                Gas Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{gasPrice} Gwei</p>
              <p className="text-green text-sm">Low fees right now</p>
            </CardContent>
          </Card>

          <Card className={cardClasses}>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-lg flex items-center">
                <div className="p-1.5 rounded-full bg-admin-success/10 text-admin-success mr-2">
                  <TrendingUp className="h-4 w-4" />
                </div>
                ETH Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${ethPrice}</p>
              <p className={`${priceChangeColor} text-sm`}>
                {ethPriceChange} (24h)
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className={cardClasses}>
          <CardHeader>
            <CardTitle className="text-xl text-dark-primary flex items-center">
              <div className="p-2 rounded-full bg-secondary/10 text-secondary mr-2">
                <Shield className="h-5 w-5" />
              </div>
              Your Wallet
            </CardTitle>
            <CardDescription className="text-dark-secondary">
              This is where your purchased ETH will be deposited
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between bg-primary/60 p-4 rounded-lg border border-gray-700/30">
              <p className="text-dark-primary font-mono">
                {shortenAddress(userWalletAddress)}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="text-secondary hover:text-secondary hover:bg-secondary/10 transition-all duration-300"
              >
                {copied ? "Copied!" : <Copy size={16} />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Alert className="bg-card border-secondary/60 border-l-4 my-8">
          <div className="p-1.5 rounded-full bg-secondary/10 text-secondary mr-2">
            <Info className="h-4 w-4" />
          </div>
          <AlertTitle className="text-dark-primary font-semibold">
            Fast & Secure
          </AlertTitle>
          <AlertDescription className="text-dark-secondary">
            MoonPay allows you to buy ETH with credit card, debit card, or bank
            transfer. Funds are sent directly to your wallet.
          </AlertDescription>
        </Alert>

        <Card className={cardClasses}>
          <CardHeader>
            <CardTitle className="text-xl text-dark-primary flex items-center">
              <div className="p-2 rounded-full bg-secondary/10 text-secondary mr-2">
                <ArrowDownCircle className="h-5 w-5" />
              </div>
              Buy ETH with MoonPay
            </CardTitle>
            <CardDescription className="text-dark-secondary">
              Purchase ETH using credit card, debit card, or bank transfer
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <MoonPayWidget
              apiKey={moonPayApiKey}
              walletAddress={userWalletAddress}
            />
          </CardContent>
          <CardFooter className="text-dark-secondary text-sm border-t border-gray-700/30 pt-4">
            <div className="flex items-start">
              <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                Processing times may vary depending on payment method and
                network congestion. Your ETH will be automatically deposited to
                your connected wallet.
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DepositPage;