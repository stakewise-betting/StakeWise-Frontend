import { type FormEvent, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Lock } from "lucide-react";
import SettingsCard from "./SettingsCard";

export default function PasswordSecurity() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordUpdate = (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    console.log("Password updated");
    // API call would go here
  };

  return (
    <SettingsCard
      title="Password & Security"
      description="Manage your account security"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-zinc-100">Change Password</h3>

        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="flex items-center bg-[#333447] rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Lock className="h-4 w-4 text-zinc-400" />
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-transparent text-sm px-2 py-1 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="flex items-center bg-[#333447] rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Lock className="h-4 w-4 text-zinc-400" />
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-transparent text-sm px-2 py-1 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="flex items-center bg-[#333447] rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Lock className="h-4 w-4 text-zinc-400" />
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent text-sm px-2 py-1 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Update Password
            </Button>
          </div>
        </form>

        <Separator className="bg-zinc-800" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-zinc-100">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-zinc-400 mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-zinc-100">
                Login Notifications
              </h3>
              <p className="text-sm text-zinc-400 mt-1">
                Get notified when someone logs into your account
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}
