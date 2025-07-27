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

  // Enhanced card styling matching Dashboard design
  const cardClasses = `
    bg-card text-dark-primary rounded-xl shadow-lg
    border border-gray-700/60
    transition-all duration-300 ease-in-out
    hover:shadow-xl hover:border-secondary/40
    hover:-translate-y-1
    overflow-hidden relative
  `;

  // Enhanced IconWrapper component matching Dashboard style
  const IconWrapper = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={`p-2 rounded-full flex items-center justify-center ${className}`}
    >
      {children}
    </div>
  );

  // Determine text color for price change
  const priceChangeColor = ethPriceChange.startsWith("+")
    ? "text-green"
    : "text-red-500";

  if (!isConnected && !isLoading) {
    return (
      <div className="min-h-screen bg-primary p-3 sm:p-6 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          {/* Enhanced Header - Mobile Optimized */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-dark-primary mb-3 flex flex-col sm:flex-row items-center justify-center">
              <IconWrapper className="bg-secondary/20 mb-2 sm:mb-0 sm:mr-4">
                <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
              </IconWrapper>
              Deposit Funds
            </h1>
            <p className="text-dark-secondary text-base sm:text-lg px-4 sm:px-0">
              Connect your wallet to deposit ETH quickly and securely
            </p>
          </div>

          {/* Enhanced Connection Card - Mobile Optimized */}
          <Card className={`${cardClasses} text-center p-4 sm:p-8`}>
            <div className="p-4 sm:p-6 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 mx-auto mb-6 sm:mb-8 inline-block">
              <AlertCircle className="text-secondary h-12 w-12 sm:h-16 sm:w-16" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-dark-primary mb-4">
              Wallet Not Connected
            </CardTitle>
            <CardDescription className="text-dark-secondary mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed px-2 sm:px-0">
              Please connect your MetaMask wallet to continue with the deposit
              process. Your funds will be secure and transactions are protected.
            </CardDescription>
            <Button
              onClick={connectWallet}
              className="bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            >
              Connect Wallet
              <ChevronRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header Section - Mobile Optimized */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-2xl font-bold text-dark-primary mb-2 sm:mb-3 flex items-center">
                <IconWrapper className="bg-secondary/20 mr-4">
                  <Wallet className="h-4 w-4 sm:h-6 sm:w-6 text-secondary" />
                </IconWrapper>
                Deposit Funds
              </h1>
              <p className="text-dark-secondary text-sm sm:text-base">
                Add ETH to your wallet quickly and securely with
                industry-leading protection
              </p>
            </div>
            <Button
              onClick={refreshWalletData}
              disabled={isRefreshing}
              className="bg-secondary/10 border border-secondary/40 text-secondary hover:bg-secondary/20 hover:border-secondary/60 transition-all duration-300 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base w-full sm:w-auto"
            >
              <RefreshCw
                className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className={cardClasses}>
            <CardHeader className="pb-2 sm:pb-3 pt-4 sm:pt-6">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center text-dark-primary">
                <IconWrapper className="bg-secondary/20 mr-2 sm:mr-3 p-1.5 sm:p-2">
                  <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
                </IconWrapper>
                <span className="text-sm sm:text-base">Current Balance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4 sm:pb-6">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-primary">
                  {walletBalance} ETH
                </p>
                <p className="text-dark-secondary text-sm sm:text-base">
                  ≈ ${balanceUsd} USD
                </p>
                <div className="h-1 bg-secondary/20 rounded-full mt-2 sm:mt-3">
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-secondary/70 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cardClasses}>
            <CardHeader className="pb-2 sm:pb-3 pt-4 sm:pt-6">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center text-dark-primary">
                <IconWrapper className="bg-admin-info/20 mr-2 sm:mr-3 p-1.5 sm:p-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-admin-info" />
                </IconWrapper>
                <span className="text-sm sm:text-base">Gas Price</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4 sm:pb-6">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-primary">
                  {gasPrice} Gwei
                </p>
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                  <p className="text-green-500 text-xs sm:text-sm font-medium">
                    Optimal fees right now
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${cardClasses} sm:col-span-2 lg:col-span-1`}>
            <CardHeader className="pb-2 sm:pb-3 pt-4 sm:pt-6">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center text-dark-primary">
                <IconWrapper className="bg-admin-success/20 mr-2 sm:mr-3 p-1.5 sm:p-2">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-admin-success" />
                </IconWrapper>
                <span className="text-sm sm:text-base">ETH Price</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4 sm:pb-6">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-primary">
                  ${ethPrice}
                </p>
                <p
                  className={`${priceChangeColor} text-xs sm:text-sm font-medium flex items-center`}
                >
                  {ethPriceChange.startsWith("+") ? "↗" : "↘"} {ethPriceChange}{" "}
                  (24h)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Wallet Information Card - Mobile Optimized */}
        <Card className={`${cardClasses} mb-6 sm:mb-8`}>
          <CardHeader className="pb-3 sm:pb-4 pt-4 sm:pt-6 border-b border-gray-700/60 bg-gradient-to-r from-secondary/5 to-transparent">
            <CardTitle className="text-lg sm:text-xl font-bold text-dark-primary flex items-center">
              <IconWrapper className="bg-secondary/20 mr-2 sm:mr-3 p-1.5 sm:p-2">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
              </IconWrapper>
              <span className="text-base sm:text-xl">Your Wallet</span>
            </CardTitle>
            <CardDescription className="text-dark-secondary text-sm sm:text-base mt-2">
              This is where your purchased ETH will be securely deposited
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gradient-to-r from-primary/60 to-primary/40 p-4 sm:p-5 rounded-xl border border-gray-700/40 hover:border-secondary/30 transition-all duration-300 gap-4 sm:gap-0">
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                <div className="p-1.5 sm:p-2 rounded-lg bg-secondary/10 flex-shrink-0">
                  <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-dark-primary font-mono text-base sm:text-lg font-medium break-all sm:break-normal">
                    {shortenAddress(userWalletAddress)}
                  </p>
                  <p className="text-dark-secondary text-xs sm:text-sm">
                    Connected Wallet Address
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="text-secondary hover:text-secondary hover:bg-secondary/20 transition-all duration-300 px-3 sm:px-4 py-2 rounded-lg text-sm w-full sm:w-auto flex-shrink-0"
              >
                {copied ? (
                  <span className="flex items-center text-green-500">
                    <Copy size={16} className="mr-2" />
                    Copied!
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Copy size={16} className="mr-2" />
                    Copy
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Info Alert - Mobile Optimized */}
        <Alert className="bg-gradient-to-r from-card to-secondary/5 border-secondary/40 border-l-4 mb-6 sm:mb-8 rounded-xl shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-1">
            <IconWrapper className="bg-secondary/20 flex-shrink-0">
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
            </IconWrapper>
            <div className="flex-1 min-w-0">
              <AlertTitle className="text-dark-primary font-bold text-base sm:text-lg">
                Fast & Secure Transactions
              </AlertTitle>
              <AlertDescription className="text-dark-secondary text-sm sm:text-base mt-2 leading-relaxed">
                MoonPay enables you to purchase ETH using credit card, debit
                card, or bank transfer. All transactions are encrypted and funds
                are sent directly to your wallet with industry-leading security.
              </AlertDescription>
            </div>
          </div>
        </Alert>

        {/* Enhanced MoonPay Card - Mobile Optimized */}
        <Card className={`${cardClasses} mb-6 sm:mb-8`}>
          <CardHeader className="pb-3 sm:pb-4 pt-4 sm:pt-6 border-b border-gray-700/60 bg-gradient-to-r from-secondary/5 to-transparent">
            <CardTitle className="text-lg sm:text-xl font-bold text-dark-primary flex items-center">
              <IconWrapper className="bg-secondary/20 mr-2 sm:mr-3 p-1.5 sm:p-2">
                <ArrowDownCircle className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
              </IconWrapper>
              <span className="text-base sm:text-xl">Buy ETH with MoonPay</span>
            </CardTitle>
            <CardDescription className="text-dark-secondary text-sm sm:text-base mt-2">
              Purchase ETH instantly using multiple payment methods with
              competitive rates
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-8">
            <div className="bg-gradient-to-br from-primary/30 to-primary/20 rounded-xl p-3 sm:p-6 border border-gray-700/40">
              <MoonPayWidget
                apiKey={moonPayApiKey}
                walletAddress={userWalletAddress}
              />
            </div>
          </CardContent>
          <CardFooter className="text-dark-secondary text-xs sm:text-sm border-t border-gray-700/40 pt-4 sm:pt-6 bg-gradient-to-r from-primary/20 to-transparent">
            <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-3">
              <IconWrapper className="bg-admin-info/20 flex-shrink-0">
                <Info className="h-3 w-3 sm:h-4 sm:w-4 text-admin-info" />
              </IconWrapper>
              <div className="space-y-1 sm:space-y-2 flex-1">
                <p className="font-medium text-dark-primary text-sm sm:text-base">
                  Important Information
                </p>
                <p className="leading-relaxed text-xs sm:text-sm">
                  Processing times may vary depending on payment method and
                  network congestion. Your ETH will be automatically deposited
                  to your connected wallet once the transaction is confirmed.
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DepositPage;
