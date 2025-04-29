import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SettingsCard from "./SettingsCard";
import { toast } from "react-toastify";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "@/context/AppContext";
import Swal from "sweetalert2";

export default function DangerZone() {
  const { backendUrl, userData, setUserData, getUserData } = useContext(AppContext)!;
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
      description="Irreversible account actions"
      titleColor="text-red-500"
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium text-zinc-100">
              {isActive ? "Deactivate" : "Activate"} Account
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              {isActive
                ? "Temporarily disable your account. You can reactivate it anytime."
                : "Reactivate your account to restore full functionality."}
            </p>
          </div>
          <Button
            variant="outline"
            className={`py-3 border-none rounded-lg ${
              isActive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            onClick={handleAccountStatus}
          >
            {isActive ? "Deactivate" : "Activate"}
          </Button>
        </div>

        <Separator className="bg-zinc-800" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium text-red-500">Delete Account</h3>
            <p className="text-sm text-zinc-400 mt-1">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
          </div>
          <Button
            variant="destructive"
            className="sm:w-auto py-3 bg-red-500 border-none rounded-lg hover:bg-red-600"
            onClick={handleDelete}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </SettingsCard>
  );
}