import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface BetSlipProps {
  eventData: {
    options: string[];
  };
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  onBet: () => Promise<void>;
  onCancel: () => void;
  disableBet?: boolean;
  limitExceededMessage?: string;
}

export default function BetSlip({
  eventData,
  selectedOption,
  setSelectedOption,
  amount,
  setAmount,
  onBet,
  onCancel,
  disableBet = false,
  limitExceededMessage,
}: BetSlipProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isValidAmount = Number(amount) >= 0.0005;
  const isBetDisabled = !selectedOption || !isValidAmount || disableBet;

  return (
    <div className="bg-gradient-to-br from-[#1C1C27] to-[#262633] rounded-xl p-6 h-fit border border-[#8488AC]/30 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Bet Slip
        </h2>
        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Select Outcome
          </label>
          <Select value={selectedOption} onValueChange={setSelectedOption}>
            <SelectTrigger className="bg-[#282836] border-[#3F3F5C] focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 hover:border-[#6F6F99] hover:shadow-lg rounded-lg h-12">
              <SelectValue placeholder="Choose your prediction..." />
            </SelectTrigger>
            <SelectContent
              className="bg-[#282836] border-[#3F3F5C] max-h-60 z-50 rounded-lg shadow-2xl"
              position="popper"
              sideOffset={5}
              align="start"
            >
              {eventData.options.map((option, index) => (
                <SelectItem
                  key={index}
                  value={option}
                  className="hover:bg-[#3A3A4B] focus:bg-[#3A3A4B] focus:text-white transition-all duration-200 cursor-pointer rounded-md my-1 py-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="font-medium">{option}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-300">
              Bet Amount (ETH)
            </label>
            <div className="flex items-center space-x-2 bg-[#282836] px-3 py-1 rounded-full">
              <span className="text-xs text-emerald-400 font-medium">MIN</span>
              <span className="text-xs text-white font-mono">0.0005</span>
            </div>
          </div>
          <div
            className={`relative transition-all duration-300 ${
              isFocused ? "scale-[1.01] shadow-lg" : ""
            }`}
          >
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span className="text-slate-400 font-mono text-sm">Ξ</span>
            </div>
            <Input
              type="number"
              step="0.0001"
              min="0.0005"
              placeholder="0.0000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`bg-[#282836] border-[#3F3F5C] focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 pl-10 pr-4 h-12 rounded-lg font-mono ${
                Number(amount) > 0 && !isValidAmount
                  ? "border-red-500 shadow-red-500/20"
                  : "hover:border-[#6F6F99] hover:shadow-lg"
              }`}
            />
            {Number(amount) > 0 && !isValidAmount && (
              <div className="flex items-center space-x-2 mt-2 p-2 bg-red-900/20 border border-red-800/30 rounded-md">
                <div className="w-1 h-1 rounded-full bg-red-500"></div>
                <p className="text-xs text-red-400 font-medium">
                  Minimum bet amount is 0.0005 ETH
                </p>
              </div>
            )}
          </div>
        </div>

        {selectedOption && amount && isValidAmount && (
          <div className="bg-gradient-to-r from-emerald-900/20 to-blue-900/20 border border-emerald-800/30 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Selected:</span>
              <span className="text-white font-medium">{selectedOption}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Stake:</span>
              <span className="text-emerald-400 font-mono">{amount} ETH</span>
            </div>
          </div>
        )}

        {disableBet && amount && Number(amount) > 0 && (
          <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-800/30 rounded-lg animate-fadeIn">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-red-300">Limit Exceeded</p>
              <p className="text-xs text-red-400">
                {limitExceededMessage ||
                  "This bet would exceed your deposit limits."}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <Button
            className={`w-full h-12 font-semibold transition-all duration-300 transform rounded-lg ${
              isBetDisabled
                ? "bg-gradient-to-r from-gray-700 to-gray-600 cursor-not-allowed opacity-60 text-gray-400"
                : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-95 hover:shadow-xl shadow-emerald-500/20 text-white"
            }`}
            disabled={isBetDisabled}
            onClick={onBet}
          >
            {!selectedOption
              ? "Select Outcome"
              : !isValidAmount
              ? "Enter Valid Amount"
              : isBetDisabled
              ? "Cannot Place Bet"
              : "Place Bet"}
          </Button>
          <button
            onClick={onCancel}
            className="w-full h-12 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold transition-all duration-300 hover:from-red-700 hover:to-red-800 active:scale-95 hover:shadow-xl shadow-red-500/20"
          >
            Cancel Bet
          </button>
        </div>

        <div className="pt-4 border-t border-gray-700/50">
          <p className="text-xs text-center text-slate-400 leading-relaxed">
            By placing a bet, you agree to our{" "}
            <a
              href="/terms-of-use"
              className="text-emerald-400 hover:text-emerald-300 underline transition-colors duration-200"
            >
              Terms of Service
            </a>{" "}
            and confirm you are of legal gambling age.
          </p>
        </div>
      </div>
    </div>
  );
}
