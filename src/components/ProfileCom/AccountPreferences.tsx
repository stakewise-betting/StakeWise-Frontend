import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, DollarSign, Eye, Shield, Volume2, Wifi } from "lucide-react";
import SettingsCard from "./SettingsCard";
import PreferenceItem from "./PreferenceItem";

export default function AccountPreferences() {
  return (
    <SettingsCard
      title="Account Preferences"
      description="Customize your account settings and betting preferences"
      footer={
        <Button className="bg-gradient-to-r from-[#E27625] to-[#F4A261] hover:from-[#D16819] hover:to-[#E2955A] text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105">
          <Settings className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Betting Preferences Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-[#E27625] to-[#F4A261] rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-100">
              Betting Preferences
            </h3>
          </div>

          <div className="bg-gradient-to-br from-[#1C1C27] to-[#252538] p-4 rounded-xl border border-[#333447] hover:border-[#E27625]/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium text-zinc-100 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#E27625]" />
                  Odds Format
                </div>
                <div className="text-sm text-zinc-400">
                  Choose how odds are displayed across the platform
                </div>
              </div>
              <Select defaultValue="decimal">
                <SelectTrigger className="border border-[#333447] w-[180px] py-3 px-4 text-sm bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E27625] hover:border-[#E27625]/50 transition-all duration-200">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-lg shadow-2xl">
                  <SelectItem
                    value="decimal"
                    className="hover:bg-[#E27625]/10 focus:bg-[#E27625]/10"
                  >
                    Decimal (1.75)
                  </SelectItem>
                  <SelectItem
                    value="fractional"
                    className="hover:bg-[#E27625]/10 focus:bg-[#E27625]/10"
                  >
                    Fractional (3/4)
                  </SelectItem>
                  <SelectItem
                    value="american"
                    className="hover:bg-[#E27625]/10 focus:bg-[#E27625]/10"
                  >
                    American (-133)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1C1C27] to-[#252538] p-4 rounded-xl border border-[#333447] hover:border-[#E27625]/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium text-zinc-100 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#E27625]" />
                  Currency
                </div>
                <div className="text-sm text-zinc-400">
                  Set your preferred currency for all transactions
                </div>
              </div>
              <Select defaultValue="usd">
                <SelectTrigger className="border border-[#333447] w-[180px] py-3 px-4 text-sm bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E27625] hover:border-[#E27625]/50 transition-all duration-200">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-lg shadow-2xl">
                  <SelectItem
                    value="usd"
                    className="hover:bg-[#E27625]/10 focus:bg-[#E27625]/10"
                  >
                    USD ($)
                  </SelectItem>
                  <SelectItem
                    value="eur"
                    className="hover:bg-[#E27625]/10 focus:bg-[#E27625]/10"
                  >
                    EUR (€)
                  </SelectItem>
                  <SelectItem
                    value="gbp"
                    className="hover:bg-[#E27625]/10 focus:bg-[#E27625]/10"
                  >
                    GBP (£)
                  </SelectItem>
                  <SelectItem
                    value="cad"
                    className="hover:bg-[#E27625]/10 focus:bg-[#E27625]/10"
                  >
                    CAD (C$)
                  </SelectItem>
                  <SelectItem
                    value="aud"
                    className="hover:bg-[#E27625]/10 focus:bg-[#E27625]/10"
                  >
                    AUD (A$)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-[#333447] to-transparent" />

        {/* Experience Preferences Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] rounded-lg">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-100">
              Experience Preferences
            </h3>
          </div>

          <div className="space-y-3">
            <div className="bg-gradient-to-br from-[#1C1C27] to-[#252538] p-4 rounded-xl border border-[#333447] hover:border-[#8B5CF6]/30 transition-all duration-300">
              <PreferenceItem
                title="Dark Mode"
                description="Always use dark mode for optimal viewing experience"
                defaultChecked={true}
                icon={<Eye className="w-4 h-4 text-[#8B5CF6]" />}
              />
            </div>

            <div className="bg-gradient-to-br from-[#1C1C27] to-[#252538] p-4 rounded-xl border border-[#333447] hover:border-[#10B981]/30 transition-all duration-300">
              <PreferenceItem
                title="Bet Confirmation"
                description="Always confirm before placing bets for added security"
                defaultChecked={true}
                icon={<Shield className="w-4 h-4 text-[#10B981]" />}
              />
            </div>

            <div className="bg-gradient-to-br from-[#1C1C27] to-[#252538] p-4 rounded-xl border border-[#333447] hover:border-[#F59E0B]/30 transition-all duration-300">
              <PreferenceItem
                title="Sound Effects"
                description="Play sounds for bet placement and results notifications"
                defaultChecked={false}
                icon={<Volume2 className="w-4 h-4 text-[#F59E0B]" />}
              />
            </div>

            <div className="bg-gradient-to-br from-[#1C1C27] to-[#252538] p-4 rounded-xl border border-[#333447] hover:border-[#3B82F6]/30 transition-all duration-300">
              <PreferenceItem
                title="Live Updates"
                description="Show real-time updates for live events and odds changes"
                defaultChecked={true}
                icon={<Wifi className="w-4 h-4 text-[#3B82F6]" />}
              />
            </div>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}
