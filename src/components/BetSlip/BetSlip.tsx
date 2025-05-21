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
  const isValidAmount = Number(amount) >= 5.0;
  const isBetDisabled = !selectedOption || !isValidAmount || disableBet;

  return (
    <div className="bg-[#1C1C27] rounded-lg p-6 h-fit border border-[#8488AC] shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-white">Bet Slip</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Options</label>
          <Select value={selectedOption} onValueChange={setSelectedOption}>
            <SelectTrigger className="bg-[#282836] border-[#3F3F5C] focus:ring-2 focus:ring-[#8488AC] focus:ring-opacity-50 transition-all duration-200 hover:border-[#6F6F99]">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent
              className="bg-[#282836] border-[#3F3F5C] max-h-60 z-50"
              position="popper"
              sideOffset={5}
              align="start"
            >
              {eventData.options.map((option, index) => (
                <SelectItem
                  key={index}
                  value={option}
                  className="hover:bg-[#3A3A4B] focus:bg-[#3A3A4B] focus:text-white transition-colors duration-150 cursor-pointer"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Amount
            <span className="float-right">Min ETH 5.00</span>
          </label>
          <div
            className={`relative transition-all duration-300 ${
              isFocused ? "scale-[1.01]" : ""
            }`}
          >
            <Input
              type="number"
              placeholder="ETH"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`bg-[#282836] border-[#3F3F5C] focus:ring-2 focus:ring-[#8488AC] focus:border-transparent transition-all duration-200 ${
                Number(amount) > 0 && !isValidAmount
                  ? "border-red-500"
                  : "hover:border-[#6F6F99]"
              }`}
            />
            {Number(amount) > 0 && !isValidAmount && (
              <p className="text-xs text-red-500 mt-1 animate-pulse">
                Amount must be at least 5.0 ETH
              </p>
            )}
          </div>
        </div>

        {disableBet && amount && Number(amount) > 0 && (
          <div className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-800/50 rounded-md animate-fadeIn">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-300">
              {limitExceededMessage ||
                "This bet would exceed your deposit limits."}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Button
            className={`w-full py-3 font-medium transition-all duration-300 transform ${
              isBetDisabled
                ? "bg-[#333447] cursor-not-allowed opacity-60"
                : "bg-emerald-500 hover:bg-emerald-600 active:scale-95 hover:shadow-lg"
            }`}
            disabled={isBetDisabled}
            onClick={onBet}
          >
            {isBetDisabled ? "Complete Bet Details" : "Bet Now"}
          </Button>
          <button
            onClick={onCancel}
            className="w-full rounded-md bg-[#f66645] px-4 py-3 text-white font-medium transition-all duration-300 hover:bg-[#e55534] active:scale-95 hover:shadow-lg"
          >
            Cancel
          </button>
        </div>

        <p className="text-xs text-center text-slate-400 mt-4">
          By Betting, you agree to the s
          <a
            href="/terms-of-use"
            className="underline hover:text-white transition-colors duration-200"
          >
            Terms of Use
          </a>
        </p>
      </div>
    </div>
  );
}
