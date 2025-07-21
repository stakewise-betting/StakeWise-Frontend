import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, UserX, Trash2, Shield, Power } from "lucide-react";
import SettingsCard from "./SettingsCard";
import { toast } from "react-toastify";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "@/context/AppContext";
import Swal from "sweetalert2";

export default function DangerZone() {
  const { backendUrl, userData, setUserData, getUserData } =
    useContext(AppContext)!;
  const [isActive, setIsActive] = useState(userData?.isActive ?? true);

  // Sync with userData changes
  useEffect(() => {
    setIsActive(userData?.isActive ?? true);
  }, [userData?.isActive]);

  const handleAccountStatus = async () => {
    const action = isActive ? "deactivate" : "activate";
    const result = await Swal.fire({
      title: `${isActive ? "Deactivate" : "Activate"} Account`,
      text: `Are you sure you want to ${action} your account?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      width: 400,
      customClass: {
        title: "!text-lg !font-semibold !text-red-500 !mb-2",
        htmlContainer: "!text-sm !text-zinc-400",
        confirmButton:
          "!bg-red-500 hover:!bg-red-600 !text-white !py-2 !px-5 !rounded-lg !ml-2",
        cancelButton:
          "!bg-gray-300 hover:!bg-gray-400 !text-black !py-2 !px-5 !rounded-lg",
        actions: "!mt-4 !gap-2",
      },
      padding: "1.5rem",
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        const endpoint = isActive
          ? `${backendUrl}/api/auth/deactivateAccount`
          : `${backendUrl}/api/auth/activateAccount`;

        const response = await axios.post(
          endpoint,
          {},
          { withCredentials: true }
        );

        // Update local state
        setIsActive(!isActive);

        // Update global user data
        if (userData) {
          const updatedUser = { ...userData, isActive: !isActive };
          setUserData(updatedUser);
        }

        // Refresh user data from backend
        await getUserData();

        toast.success(response.data.message);
        window.location.href = "/";
      } catch (error: any) {
        console.error("Error response:", error.response);
        toast.error(error.response?.data?.message || "An error occurred");
      }
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Account",
      text: "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      width: 400,
      customClass: {
        title: "!text-lg !font-semibold !text-red-500 !mb-2",
        htmlContainer: "!text-sm !text-zinc-400",
        confirmButton:
          "!bg-red-500 hover:!bg-red-600 !text-white !py-2 !px-5 !rounded-lg !ml-2",
        cancelButton:
          "!bg-gray-300 hover:!bg-gray-400 !text-black !py-2 !px-5 !rounded-lg",
        actions: "!mt-4 !gap-2",
      },
      padding: "1.5rem",
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/auth/deleteAccount`,
          {},
          { withCredentials: true }
        );
        toast.success(response.data.message);
        window.location.href = "/";
      } catch (error: any) {
        console.error("Error response:", error.response);
        toast.error(error.response?.data?.message || "An error occurred");
      }
    }
  };

  return (
    <SettingsCard
      title="Danger Zone"
      description="Critical account actions that cannot be easily reversed"
      titleColor="text-red-500"
    >
      <div className="space-y-6">
        {/* Warning Header */}
        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-400">
                Important Notice
              </h3>
              <p className="text-sm text-zinc-400 mt-1">
                The actions below will significantly impact your account. Please
                proceed with caution.
              </p>
            </div>
          </div>
        </div>

        {/* Account Status Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-2 rounded-lg ${
                isActive
                  ? "bg-gradient-to-r from-amber-500 to-orange-500"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500"
              }`}
            >
              <Power className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-100">
              Account Status
            </h3>
          </div>

          <div className="bg-gradient-to-br from-[#1C1C27] to-[#252538] p-6 rounded-xl border border-[#333447] hover:border-red-500/30 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {isActive ? (
                    <UserX className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Shield className="h-5 w-5 text-blue-500" />
                  )}
                  <h4 className="text-lg font-medium text-zinc-100">
                    {isActive ? "Deactivate Account" : "Activate Account"}
                  </h4>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {isActive
                    ? "Temporarily disable your account while preserving all your data. You can reactivate it anytime by logging in again."
                    : "Restore full functionality to your account. All your previous data and settings will be available."}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span
                    className={`text-xs font-medium ${
                      isActive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    Account is currently {isActive ? "Active" : "Deactivated"}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Button
                  variant="outline"
                  className={`py-3 px-6 border-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                    isActive
                      ? "border-amber-500 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
                      : "border-blue-500 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
                  }`}
                  onClick={handleAccountStatus}
                >
                  {isActive ? (
                    <>
                      <UserX className="w-4 h-4 mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Activate
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

        {/* Delete Account Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-red-400">
              Permanent Deletion
            </h3>
          </div>

          <div className="bg-gradient-to-br from-red-950/20 to-red-900/10 p-6 rounded-xl border border-red-500/30 hover:border-red-500/50 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Trash2 className="h-5 w-5 text-red-400" />
                  <h4 className="text-lg font-medium text-red-400">
                    Delete Account Permanently
                  </h4>
                </div>
                <div className="space-y-2 text-sm text-zinc-400 leading-relaxed">
                  <p>This action will permanently remove:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Your user profile and personal information</li>
                    <li>All betting history and transaction records</li>
                    <li>Account preferences and settings</li>
                    <li>Any accumulated rewards or bonuses</li>
                  </ul>
                </div>
                <div className="flex items-center gap-2 mt-4 p-3 bg-red-500/10 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-red-400">
                    This action cannot be undone
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Button
                  variant="destructive"
                  className="py-3 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-none rounded-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-105"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Forever
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}
