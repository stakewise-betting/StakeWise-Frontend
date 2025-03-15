import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import SettingsCard from "./SettingsCard"
import PreferenceItem from "./PreferenceItem"

export default function PrivacySettings() {
  return (
    <SettingsCard
      title="Privacy Settings"
      description="Control your privacy and visibility"
      footer={<Button className="bg-emerald-600 hover:bg-emerald-700">Save Privacy Settings</Button>}
    >
      <div className="space-y-4">
        <PreferenceItem
          title="Profile Visibility"
          description="Allow other users to see your profile"
          defaultChecked={true}
        />

        <PreferenceItem
          title="Show Betting History"
          description="Allow others to see your betting activity"
          defaultChecked={false}
        />

        <PreferenceItem
          title="Show Online Status"
          description="Let others know when you're online"
          defaultChecked={true}
        />

        <Separator className="bg-zinc-800" />

        <div className="space-y-2">
          <div className="font-medium text-zinc-100">Data Usage</div>
          <div className="space-y-3">
            <div className="flex items-start">
              <Switch id="marketing" className="mt-0.5" />
              <Label htmlFor="marketing" className="ml-3 text-sm">
                <span className="font-medium text-zinc-100">Marketing Communications</span>
                <span className="block text-zinc-400 mt-0.5">
                  Receive emails about promotions, special offers, and new features
                </span>
              </Label>
            </div>

            <div className="flex items-start">
              <Switch id="analytics" className="mt-0.5" defaultChecked />
              <Label htmlFor="analytics" className="ml-3 text-sm">
                <span className="font-medium text-zinc-100">Analytics and Improvements</span>
                <span className="block text-zinc-400 mt-0.5">
                  Allow us to collect usage data to improve our services
                </span>
              </Label>
            </div>

            <div className="flex items-start">
              <Switch id="personalization" className="mt-0.5" defaultChecked />
              <Label htmlFor="personalization" className="ml-3 text-sm">
                <span className="font-medium text-zinc-100">Personalized Recommendations</span>
                <span className="block text-zinc-400 mt-0.5">
                  Allow us to suggest bets based on your betting history
                </span>
              </Label>
            </div>
          </div>
        </div>
      </div>
    </SettingsCard>
  )
}

