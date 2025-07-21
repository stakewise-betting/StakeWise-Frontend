import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Lock, Shield, Bell, Save, Eye, EyeOff, KeyRound } from "lucide-react";
import SettingsCard from "./SettingsCard";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { toast } from "react-toastify";

export default function PasswordSecurity() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { backendUrl, userData } = useContext(AppContext)!;

  const handlePasswordUpdate = async (e: any) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/changePassword`,
        { currentPassword, newPassword, confirmPassword },
        { withCredentials: true }
      );

      const data = response.data;
      toast.success(data.message);

      // Clear form fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error response:", error.response);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsCard
      title="Password & Security"
      description="Manage your account security settings and authentication preferences"
    >
      <div className="space-y-8">
        {userData?.authProvider === "credentials" ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-[#EF4444] to-[#F87171] rounded-lg">
                <KeyRound className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100">
                Change Password
              </h3>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              {/* Current Password */}
              <div className="bg-gradient-to-br from-[#1C1C27] to-[#252538] p-6 rounded-xl border border-[#333447] hover:border-[#EF4444]/30 transition-all duration-300">
                <div className="space-y-3">
                  <Label
                    htmlFor="current-password"
                    className="text-zinc-200 font-medium"
                  >
                    Current Password
                  </Label>
                  <div className="relative">
                    <div className="flex items-center bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#EF4444] hover:border-[#EF4444]/50 transition-all duration-200">
                      <Lock className="h-4 w-4 text-[#EF4444] mr-3" />
                      <input
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-transparent text-sm text-zinc-100 focus:outline-none placeholder-zinc-500"
                        placeholder="Enter your current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="ml-2 p-1 text-zinc-400 hover:text-[#EF4444] transition-colors"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* New Password */}
              <div className="bg-gradient-to-br from-[#1C1C27] to-[#252538] p-6 rounded-xl border border-[#333447] hover:border-[#10B981]/30 transition-all duration-300">
                <div className="space-y-3">
                  <Label
                    htmlFor="new-password"
                    className="text-zinc-200 font-medium"
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <div className="flex items-center bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#10B981] hover:border-[#10B981]/50 transition-all duration-200">
                      <Lock className="h-4 w-4 text-[#10B981] mr-3" />
                      <input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-transparent text-sm text-zinc-100 focus:outline-none placeholder-zinc-500"
                        placeholder="Enter your new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="ml-2 p-1 text-zinc-400 hover:text-[#10B981] transition-colors"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Password must be at least 8 characters long
                  </p>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="bg-gradient-to-br from-[#1C1C27] to-[#252538] p-6 rounded-xl border border-[#333447] hover:border-[#3B82F6]/30 transition-all duration-300">
                <div className="space-y-3">
                  <Label
                    htmlFor="confirm-password"
                    className="text-zinc-200 font-medium"
                  >
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <div className="flex items-center bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#3B82F6] hover:border-[#3B82F6]/50 transition-all duration-200">
                      <Lock className="h-4 w-4 text-[#3B82F6] mr-3" />
                      <input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-transparent text-sm text-zinc-100 focus:outline-none placeholder-zinc-500"
                        placeholder="Confirm your new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="ml-2 p-1 text-zinc-400 hover:text-[#3B82F6] transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  {confirmPassword &&
                    newPassword &&
                    confirmPassword !== newPassword && (
                      <p className="text-sm text-red-400 flex items-center gap-2">
                        Passwords do not match
                      </p>
                    )}
                </div>
              </div>

              <div className="flex justify-start">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#EF4444] to-[#F87171] hover:from-[#DC2626] hover:to-[#EF4444] text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
                  disabled={
                    isLoading ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword ||
                    newPassword !== confirmPassword
                  }
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Password
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#1C1C27] to-[#252538] p-6 rounded-xl border border-[#333447]">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-[#6B7280] to-[#9CA3AF] rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100">
                External Authentication
              </h3>
            </div>
            <p className="text-sm text-zinc-400">
              You're using{" "}
              {userData?.authProvider === "google"
                ? "Google OAuth"
                : "MetaMask wallet"}{" "}
              for authentication. Password management is handled by your chosen
              provider.
            </p>
          </div>
        )}

        <Separator className="bg-gradient-to-r from-transparent via-[#333447] to-transparent" />

        {/* Security Preferences */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-100">
              Security Preferences
            </h3>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#1C1C27] to-[#252538] p-6 rounded-xl border border-[#333447] hover:border-[#8B5CF6]/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Bell className="h-4 w-4 text-[#8B5CF6]" />
                    <h4 className="text-lg font-medium text-zinc-100">
                      Login Notifications
                    </h4>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Receive email notifications when someone logs into your
                    account from a new device
                  </p>
                </div>
                <div className="ml-6">
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#8B5CF6] data-[state=checked]:to-[#A78BFA]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}
