import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SettingsCard from "./SettingsCard"
import PreferenceItem from "./PreferenceItem"

export default function AccountPreferences() {
  return (
    <SettingsCard
      title="Account Preferences"
      description="Customize your account settings"
      footer={<Button className="bg-emerald-600 hover:bg-emerald-700">Save Preferences</Button>}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-medium text-zinc-100">Odds Format</div>
            <div className="text-sm text-zinc-400">Choose how odds are displayed</div>
          </div>
          <Select defaultValue="decimal">
            <SelectTrigger className="border-none w-[180px] py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent className="bg-[#333447] border-none rounded-lg">
              <SelectItem value="decimal">Decimal (1.75)</SelectItem>
              <SelectItem value="fractional">Fractional (3/4)</SelectItem>
              <SelectItem value="american">American (-133)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-medium text-zinc-100">Currency</div>
            <div className="text-sm text-zinc-400">Set your preferred currency</div>
          </div>
          <Select defaultValue="usd">
            <SelectTrigger className="border-none w-[180px] py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent className="bg-[#333447] border-none rounded-lg">
              <SelectItem value="usd">USD ($)</SelectItem>
              <SelectItem value="eur">EUR (€)</SelectItem>
              <SelectItem value="gbp">GBP (£)</SelectItem>
              <SelectItem value="cad">CAD (C$)</SelectItem>
              <SelectItem value="aud">AUD (A$)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="bg-zinc-800" />

        <PreferenceItem title="Dark Mode" description="Always use dark mode" defaultChecked={true} />

        <PreferenceItem
          title="Bet Confirmation"
          description="Always confirm before placing bets"
          defaultChecked={true}
        />

        <PreferenceItem
          title="Sound Effects"
          description="Play sounds for bet placement and results"
          defaultChecked={false}
        />

        <PreferenceItem
          title="Live Updates"
          description="Show real-time updates for live events"
          defaultChecked={true}
        />
      </div>
    </SettingsCard>
  )
}

