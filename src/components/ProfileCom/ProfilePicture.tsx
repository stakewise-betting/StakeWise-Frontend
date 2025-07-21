import { useState, useEffect, useContext, type ChangeEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
import { Camera, Check, User, Upload, Image } from "lucide-react";
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
      description="Upload a professional photo that represents you on the platform"
    >
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#E27625] to-[#F4A261] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <Avatar className="relative h-32 w-32 border-2 border-[#333447] hover:border-[#E27625]/50 transition-all duration-300 shadow-2xl">
              <AvatarImage
                alt="Profile"
                src={avatarSrc}
                className="bg-gradient-to-br from-[#1C1C27] to-[#252538]"
              />
              <AvatarFallback className="bg-gradient-to-br from-[#1C1C27] to-[#252538] text-zinc-100 text-xl border border-[#333447]">
                {userData?.picture ? (
                  <img
                    src={userData.picture}
                    alt="Google Profile"
                    width={115}
                    height={115}
                    className="object-cover rounded-full"
                  />
                ) : userData?.username ? (
                  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#E27625] to-[#F4A261] text-white font-bold text-2xl">
                    {userData.username[0].toUpperCase()}
                  </div>
                ) : userData?.walletAddress ? (
                  <img
                    src={MetamaskLogo}
                    alt="MetaMask Logo"
                    width={80}
                    height={80}
                    className="object-contain rounded-full"
                  />
                ) : (
                  <User className="h-12 w-12 text-zinc-400" />
                )}
              </AvatarFallback>
            </Avatar>

            {/* Upload Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/70 to-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer p-3 rounded-full bg-gradient-to-r from-[#E27625] to-[#F4A261] hover:from-[#D16819] hover:to-[#E2955A] text-white shadow-lg transform transition-all duration-200 hover:scale-110"
              >
                {isUploading ? (
                  <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Camera className="h-6 w-6" />
                )}
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

          {/* Upload Button */}
          <label
            htmlFor="avatar-upload"
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isUploading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-[#E27625] to-[#F4A261] hover:from-[#D16819] hover:to-[#E2955A] text-white shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
          >
            {isUploading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Photo
              </>
            )}
          </label>
        </div>

        {/* Guidelines Section */}
        <div className="flex-1 space-y-6">
          <div className="bg-gradient-to-br from-[#1C1C27] to-[#252538] p-6 rounded-xl border border-[#333447] hover:border-[#E27625]/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-lg">
                <Image className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100">
                Upload Guidelines
              </h3>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-[#10B981] to-[#34D399] flex items-center justify-center mt-0.5">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div>
                  <span className="font-medium text-zinc-100">
                    Clear & Professional
                  </span>
                  <p className="text-sm text-zinc-400 mt-1">
                    Use a high-quality, well-lit photo of yourself
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-[#10B981] to-[#34D399] flex items-center justify-center mt-0.5">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div>
                  <span className="font-medium text-zinc-100">
                    Square Format
                  </span>
                  <p className="text-sm text-zinc-400 mt-1">
                    Square images (1:1 ratio) work best for profile pictures
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-[#10B981] to-[#34D399] flex items-center justify-center mt-0.5">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div>
                  <span className="font-medium text-zinc-100">
                    File Requirements
                  </span>
                  <p className="text-sm text-zinc-400 mt-1">
                    JPEG, PNG, or WEBP format • Maximum 5MB file size
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Upload Progress/Status */}
          {isUploading && (
            <div className="bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                <span className="text-white font-medium">
                  Uploading your profile picture...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </SettingsCard>
  );
}
