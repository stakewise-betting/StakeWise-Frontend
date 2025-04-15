import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Lock } from "lucide-react";
import SettingsCard from "./SettingsCard";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { toast } from "react-toastify";

export default function PasswordSecurity() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { backendUrl, userData } = useContext(AppContext)!;

  const handlePasswordUpdate = async (e: any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    let data;
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/changePassword`,
        { currentPassword, newPassword, confirmPassword },
        { withCredentials: true }
      );
      data = response.data;
      toast.success(data.message);
    } catch (error: any) {
      console.error("Error response:", error.response);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <SettingsCard
      title="Password & Security"
      description="Manage your account security"
    >
      <div className="space-y-4">
        {userData?.authProvider === "credentials" ? (
          <>
            <h3 className="text-lg font-medium text-zinc-100">
              Change Password
            </h3>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="flex gap-4 items-center bg-[#333447] rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
                  <Lock className="h-4 w-4 text-zinc-400" />
                  <input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-transparent text-sm px-2 py-1 focus:outline-none"
                    placeholder="Enter current password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="flex gap-4 items-center bg-[#333447] rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
                  <Lock className="h-4 w-4 text-zinc-400" />
                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-transparent text-sm px-2 py-1 focus:outline-none"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="flex gap-4 items-center bg-[#333447] rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
                  <Lock className="h-4 w-4 text-zinc-400" />
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent text-sm px-2 py-1 focus:outline-none"
                    placeholder="Confirm new password"
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
          </>
        ) : (
          <p className="text-sm text-zinc-400">
            Password management is not applicable for your login method.
          </p>
        )}

        <Separator className="bg-zinc-800" />

        <div className="space-y-4">
          {/* <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-zinc-100">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-zinc-400 mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch />
          </div> */}

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
