import { useState, useEffect, useContext, type ChangeEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Check } from "lucide-react";
import SettingsCard from "./SettingsCard";
import { AppContext } from "@/context/AppContext";
import MetamaskLogo from "@/assets/images/MetaMask-icon-fox.svg";
import { toast } from "react-toastify";
import axios from "axios";

export default function ProfilePicture() {
  const { userData, backendUrl, getUserData } = useContext(AppContext)!;
  const [avatarSrc, setAvatarSrc] = useState(userData?.picture);
  const [isUploading, setIsUploading] = useState(false); // New state for upload status

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  useEffect(() => {
    if (userData?.avatarSrc) {
      setAvatarSrc(userData.avatarSrc);
    }
  }, [userData]);

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
  
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WEBP images are allowed");
      return;
    }
  
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB");
      return;
    }
  
    const formData = new FormData();
    formData.append("avatar", file);
  
    setIsUploading(true);
  
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user-update/updateProfilePicture`,
        formData,
        {
          withCredentials: true, // Crucial for cookies
          // Remove manual Content-Type header - let browser set it with boundary
        }
      );
  
      if (data?.success) {
        toast.success("Profile picture updated successfully");
        setAvatarSrc(data.avatarUrl);
        getUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update profile picture"
      );
    } finally {
      setIsUploading(false);
    }
  };
  

  // const handleResetAvatar = async () => {
  //   setIsUploading(true);
  //   try {
  //     const response = await axios.post(
  //       `${backendUrl}/api/user-update/resetProfilePicture`,
  //       {},
  //       { withCredentials: true }
  //     );

  //     if (response.data.success) {
  //       setAvatarSrc("/placeholder.svg"); // Reset to default
  //       toast.success("Profile picture reset successfully");
  //     } else {
  //       toast.error("Failed to reset profile picture");
  //     }
  //   } catch (error: any) {
  //     toast.error(error.response?.data?.message || "Error resetting profile picture");
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  return (
    <SettingsCard
      title="Profile Picture"
      description="Your profile picture will be visible to other users"
    >
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
        <div className="relative group">
          <Avatar className="h-32 w-32 border-2 border-zinc-800">
            <AvatarImage alt="Profile" src={avatarSrc} />
            <AvatarFallback className="bg-zinc-800 text-zinc-100 text-4xl">
            {userData?.picture ? (
                <img
                  src={userData.picture}
                  alt="Google Profile"
                  width={115}
                  height={115}
                  className="object-cover rounded-full"
                />
              ) : userData?.username ? (
                userData.username[0].toUpperCase()
              ) : userData?.walletAddress ? (
                <img
                  src={MetamaskLogo}
                  alt="MetaMask Logo"
                  width={115}
                  height={115}
                  className="object-contain rounded-full"
                />
              ) : (
                ""
              )}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer p-2 rounded-full bg-zinc-800 hover:bg-zinc-700"
            >
              <Camera className="h-6 w-6" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={isUploading}
            />
          </div>
        </div>
        <div className="space-y-4 flex-1">
          <div>
            <h3 className="font-medium text-zinc-100">Profile Picture Guidelines</h3>
            <ul className="mt-2 text-sm text-zinc-400 space-y-1">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                Use a clear, recognizable photo
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                Square images work best
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                Maximum file size: 5MB
              </li>
            </ul>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="py-3 bg-red-500 border-none rounded-lg hover:bg-red-600"
              // onClick={handleResetAvatar}
              disabled={isUploading}
            >
              Reset to Default
            </Button>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}
