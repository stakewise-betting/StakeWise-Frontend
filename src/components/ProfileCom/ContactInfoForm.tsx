import type { FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone } from "lucide-react";
import SettingsCard from "./SettingsCard";

interface UserData {
  email: string;
  phone: string;
  [key: string]: string;
}

interface ContactInfoFormProps {
  userData: UserData;
  updateUserData: (field: string, value: string) => void;
}

export default function ContactInfoForm({
  userData,
  updateUserData,
}: ContactInfoFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Contact info updated:", {
      email: userData.email,
      phone: userData.phone,
    });
    // API call would go here
  };

  return (
    <SettingsCard
      title="Contact Information"
      description="Update your contact details"
      form
      onSubmit={handleSubmit}
      footer={
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
          Save Changes
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="email">Email Address</Label>
            <span className="text-xs bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded">
              Verified
            </span>
          </div>
          <div className="flex items-center bg-[#333447] rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
            <Mail className="h-4 w-4 text-zinc-400" />
            <input
              id="email"
              type="email"
              value={userData.email}
              onChange={(e) => updateUserData("email", e.target.value)}
              className="w-full bg-transparent text-sm px-2 py-1 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          <p className="text-sm text-zinc-400">
            We'll send a verification email if you change this
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="phone">Phone Number</Label>
            <span className="text-xs bg-amber-500/20 text-amber-500 px-2 py-1 rounded">
              Unverified
            </span>
          </div>
          <div className="flex items-center bg-[#333447] rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
            <Phone className="h-4 w-4 text-zinc-400" />
            <input
              id="phone"
              type="tel"
              value={userData.phone}
              onChange={(e) => updateUserData("phone", e.target.value)}
              className="w-full bg-transparent text-sm px-2 py-1 focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">
              Used for account recovery and notifications
            </p>
            <Button variant="link" className="text-emerald-500 p-0 h-auto">
              Verify now
            </Button>
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        <div className="space-y-2">
          <Label htmlFor="language">Preferred Language</Label>
          <Select defaultValue="en">
            <SelectTrigger className="border-none w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-[#333447] border-none rounded-lg">
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="it">Italian</SelectItem>
              <SelectItem value="pt">Portuguese</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select defaultValue="america-new_york">
            <SelectTrigger className="border-none w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent className="bg-[#333447] border-none rounded-lg max-h-[200px]">
              <SelectItem value="america-new_york">
                America/New York (UTC-05:00)
              </SelectItem>
              <SelectItem value="america-los_angeles">
                America/Los Angeles (UTC-08:00)
              </SelectItem>
              <SelectItem value="america-chicago">
                America/Chicago (UTC-06:00)
              </SelectItem>
              <SelectItem value="europe-london">
                Europe/London (UTC+00:00)
              </SelectItem>
              <SelectItem value="europe-paris">
                Europe/Paris (UTC+01:00)
              </SelectItem>
              <SelectItem value="asia-tokyo">Asia/Tokyo (UTC+09:00)</SelectItem>
              <SelectItem value="australia-sydney">
                Australia/Sydney (UTC+10:00)
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-zinc-400">
            Used for displaying event times and schedules
          </p>
        </div>
      </div>
    </SettingsCard>
  );
}
