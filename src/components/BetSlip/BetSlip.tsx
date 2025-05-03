import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  disableBet?: boolean; // Add this prop to handle deposit limit restrictions
  limitExceededMessage?: string; // Optional message explaining why bet is disabled
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
  const isValidAmount = Number(amount) >= 5.0;
  const isBetDisabled = !isValidAmount || disableBet;

  return (
    <div className="bg-[#1C1C27] rounded-lg p-6 h-fit border border-[#8488AC]">
      <h2 className="text-xl font-semibold mb-6">Bet Slip</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Options</label>
          <Select value={selectedOption} onValueChange={setSelectedOption}>
            <SelectTrigger>
              <SelectValue>{selectedOption || "Select an option"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {eventData.options.map((option, index) => (
                <SelectItem key={index} value={option}>
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
          <Input
            type="number"
            placeholder="ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-[#1C1C27]"
          />
        </div>

        {disableBet && amount && Number(amount) > 0 && (
          <div className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-800/50 rounded-md">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-300">
              {limitExceededMessage || "This bet would exceed your deposit limits."}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Button
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-[#333447]"
            disabled={isBetDisabled}
            onClick={onBet}
          >
            Bet Now
          </Button>
          <button
            onClick={onCancel}
            className="w-full rounded-md bg-[#f66645] px-4 py-2 text-white hover:bg-[#473333]"
          >
            Cancel
          </button>
        </div>
        <p className="text-xs text-center text-slate-400">
          By Betting, you agree to the{" "}
          <a href="#" className="underline">
            Terms of Use
          </a>
        </p>
      </div>
    </div>
  );
}