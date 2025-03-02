import MoonPayWidget from "../../components/Moonpay/MoonPayWidget";
import { Wallet, ArrowDownCircle, Info, Copy } from "lucide-react";
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
import { useState } from "react";

const DepositPage = () => {
  const moonPayApiKey = "pk_test_DJvwdrDtU8GG2AWNFX4PRovc7AdY62"; // Replace with your actual MoonPay API key
  const userWalletAddress = "0xb2273cb563789700Dd74590f6768c57111C8E005"; // Replace with a valid ETH address
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(userWalletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

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
              <p className="text-2xl font-bold">0.00 ETH</p>
              <p className="text-sub text-sm">≈ $0.00 USD</p>
            </CardContent>
          </Card>

          <Card className="bg-card text-DFprimary border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Gas Price</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">42 Gwei</p>
              <p className="text-green text-sm">Low fees right now</p>
            </CardContent>
          </Card>

          <Card className="bg-card text-DFprimary border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">ETH Price</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$3,876.21</p>
              <p className="text-green text-sm">+2.4% (24h)</p>
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
