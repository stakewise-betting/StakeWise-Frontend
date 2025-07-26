// StakeWise-Frontend/src/Admin/profile/AdminProfilePage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CircleUserRound,
  Pencil,
  Save,
  XCircle,
  AlertCircle,
  CheckCircle,
  Settings,
  CreditCard,
} from "lucide-react";
import { IUser } from "@/types/user.types";
import {
  fetchCurrentUserData,
  updateCurrentUserProfile,
} from "@/services/userService";
import { profileSchema, ProfileFormData } from "@/schema/profileSchema";

const LoadingIndicator: React.FC<{ message?: string }> = ({
  message = "Loading Profile...",
}) => (
  <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <div
        className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"
        style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
      ></div>
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-semibold text-white">{message}</h3>
      <p className="text-slate-400">
        Please wait while we fetch your profile data...
      </p>
    </div>
  </div>
);

const AdminProfilePage: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fname: "",
      lname: "",
      username: "",
    },
  });

  const loadUserData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await fetchCurrentUserData();
      setUser(userData);
      reset({
        fname: userData.fname || "",
        lname: userData.lname || "",
        username: userData.username || "",
      });
    } catch (err: any) {
      setError(
        `Failed to load profile data: ${
          err.response?.data?.message || err.message
        }`
      );
      toast.error(
        `Error loading profile: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    setError(null);
    console.log("Submitting profile data:", data);

    const updateData = {
      fname: data.fname?.trim() || null,
      lname: data.lname?.trim() || null,
      username: data.username.trim(),
    };

    try {
      const updatedUser = await updateCurrentUserProfile(updateData);
      setUser(updatedUser);
      reset(updatedUser);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unknown error occurred";
      setError(`Failed to update profile: ${errorMessage}`);
      toast.error(`Update failed: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      reset({
        fname: user.fname || "",
        lname: user.lname || "",
        username: user.username || "",
      });
    }
    setError(null);
  };

  const getUserInitials = (currentUser: IUser | null): string => {
    if (!currentUser) return "?";
    const fnameInitial = currentUser.fname ? currentUser.fname[0] : "";
    const lnameInitial = currentUser.lname ? currentUser.lname[0] : "";
    if (fnameInitial || lnameInitial) {
      return `${fnameInitial}${lnameInitial}`.toUpperCase();
    }
    if (currentUser.username) {
      return currentUser.username[0].toUpperCase();
    }
    return "?";
  };

  const renderError = () => (
    <div className="bg-gradient-to-br from-[#1C1C27] to-[#262633] border border-gray-700/30 rounded-2xl shadow-2xl p-6">
      <Alert className="bg-gradient-to-r from-[#EF4444]/10 to-[#DC2626]/10 border-2 border-[#EF4444]/50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#EF4444] to-[#DC2626] flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-white" />
          </div>
          <div>
            <AlertTitle className="text-[#EF4444] font-bold">
              Error Loading Profile
            </AlertTitle>
            <AlertDescription className="text-gray-300 mt-1">
              {error} - Please{" "}
              <button
                onClick={loadUserData}
                className="underline font-semibold text-secondary hover:text-secondary/80 transition-colors duration-200"
              >
                try again
              </button>
              .
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  );

  const renderProfileDisplay = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-secondary/50 shadow-lg">
              <AvatarImage
                src={user?.picture || user?.avatarSrc || ""}
                alt={user?.username}
                className="object-cover"
              />
              <AvatarFallback className="text-3xl bg-gradient-to-r from-secondary to-secondary/80 text-white font-bold">
                {getUserInitials(user)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">
              {user?.fname || user?.lname
                ? `${user.fname || ""} ${user.lname || ""}`.trim()
                : user?.username}
            </h3>
            <p className="text-slate-400 text-base flex items-center gap-2">
              <span>Email:</span>
              {user?.email || "No email provided"}
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="px-3 py-1 rounded-full bg-secondary/20 border border-secondary/50">
                <span className="text-secondary font-semibold text-sm">
                  {user?.role?.toUpperCase()}
                </span>
              </div>
              {user?.isAccountVerified && (
                <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50">
                  <span className="text-green-500 font-semibold text-sm">
                    Verified
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="group flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none relative overflow-hidden bg-secondary/20 text-dark-primary border border-secondary/50 shadow-lg hover:bg-secondary/30 hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <div className="flex items-center justify-center mr-3 rounded-lg transition-all duration-300 h-8 w-8 bg-secondary/20 text-secondary shadow-lg">
              <Pencil
                className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300"
                aria-hidden="true"
              />
            </div>
            <span className="text-sm font-semibold transition-colors duration-300 text-dark-primary">
              Edit Profile
            </span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information Card */}
        <div className="bg-gradient-to-br from-[#1C1C27] to-[#262633] border border-gray-700/30 rounded-2xl shadow-2xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CircleUserRound className="h-5 w-5 text-secondary" />
            Personal Information
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-700/30">
              <Label className="text-slate-400 font-medium">Username</Label>
              <p className="text-white font-semibold">
                {user?.username || "N/A"}
              </p>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700/30">
              <Label className="text-slate-400 font-medium">First Name</Label>
              <p className="text-white">
                {user?.fname || (
                  <span className="italic text-slate-500">Not set</span>
                )}
              </p>
            </div>
            <div className="flex justify-between items-center py-2">
              <Label className="text-slate-400 font-medium">Last Name</Label>
              <p className="text-white">
                {user?.lname || (
                  <span className="italic text-slate-500">Not set</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Account Details Card */}
        <div className="bg-gradient-to-br from-[#1C1C27] to-[#262633] border border-gray-700/30 rounded-2xl shadow-2xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5 text-secondary" />
            Account Details
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-700/30">
              <Label className="text-slate-400 font-medium">Role</Label>
              <p className="text-white font-semibold capitalize">
                {user?.role}
              </p>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700/30">
              <Label className="text-slate-400 font-medium">Joined</Label>
              <p className="text-white">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div className="flex justify-between items-center py-2">
              <Label className="text-slate-400 font-medium">
                Auth Provider
              </Label>
              <p className="text-white capitalize">{user?.authProvider}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Status Card */}
        <div className="bg-gradient-to-br from-[#1C1C27] to-[#262633] border border-gray-700/30 rounded-2xl shadow-2xl p-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                user?.isAccountVerified ? "bg-green-500" : "bg-yellow-500"
              }`}
            >
              {user?.isAccountVerified ? (
                <CheckCircle className="h-5 w-5 text-white" />
              ) : (
                <AlertCircle className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <h4
                className={`font-semibold ${
                  user?.isAccountVerified ? "text-green-500" : "text-yellow-500"
                }`}
              >
                Account Status
              </h4>
              <p className="text-white font-medium">
                {user?.isAccountVerified ? "Verified" : "Not Verified"}
              </p>
            </div>
          </div>
        </div>

        {/* Wallet Card */}
        {user?.walletAddress && (
          <div className="bg-gradient-to-br from-[#1C1C27] to-[#262633] border border-gray-700/30 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-secondary">Wallet Address</h4>
                <p
                  className="text-white font-mono text-xs break-all"
                  title={user.walletAddress}
                >
                  {user.walletAddress}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfileForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="bg-gradient-to-br from-[#1C1C27] to-[#262633] border border-gray-700/30 rounded-2xl shadow-2xl p-6">
          <Alert className="bg-gradient-to-r from-[#EF4444]/10 to-[#DC2626]/10 border-2 border-[#EF4444]/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#EF4444] to-[#DC2626] flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <AlertTitle className="text-[#EF4444] font-bold">
                  Update Failed
                </AlertTitle>
                <AlertDescription className="text-gray-300 mt-1">
                  {error}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        </div>
      )}

      {/* Avatar Section */}
      <div className="bg-gradient-to-br from-[#1C1C27] to-[#262633] border border-gray-700/30 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-secondary/50 shadow-lg">
              <AvatarImage
                src={user?.picture || user?.avatarSrc || ""}
                alt={user?.username}
                className="object-cover"
              />
              <AvatarFallback className="text-3xl bg-gradient-to-r from-secondary to-secondary/80 text-white font-bold">
                {getUserInitials(user)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg">
              <Pencil className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">{user?.username}</h3>
            <p className="text-slate-400 flex items-center gap-2">
              <span>Email:</span>
              {user?.email || "No email provided"}
            </p>
            <p className="text-yellow-500 text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Avatar and Email cannot be changed here
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-gradient-to-br from-[#1C1C27] to-[#262633] border border-gray-700/30 rounded-2xl shadow-2xl p-6">
        <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Pencil className="h-5 w-5 text-secondary" />
          Edit Information
        </h4>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-slate-400 font-medium flex items-center gap-2"
            >
              <CircleUserRound className="h-4 w-4 text-secondary" />
              Username
            </Label>
            <Input
              id="username"
              className="bg-[#1C1C27] border-gray-700/50 text-white placeholder-slate-400 focus:border-secondary focus:ring-secondary/20 transition-all duration-300 h-12"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-[#EF4444] text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="fname"
              className="text-slate-400 font-medium flex items-center gap-2"
            >
              <CircleUserRound className="h-4 w-4 text-secondary" />
              First Name
            </Label>
            <Input
              id="fname"
              className="bg-[#1C1C27] border-gray-700/50 text-white placeholder-slate-400 focus:border-green-500 focus:ring-green-500/20 transition-all duration-300 h-12"
              {...register("fname")}
              placeholder="Enter first name (optional)"
            />
            {errors.fname && (
              <p className="text-[#EF4444] text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.fname.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="lname"
              className="text-slate-400 font-medium flex items-center gap-2"
            >
              <CircleUserRound className="h-4 w-4 text-secondary" />
              Last Name
            </Label>
            <Input
              id="lname"
              className="bg-[#1C1C27] border-gray-700/50 text-white placeholder-slate-400 focus:border-green-500 focus:ring-green-500/20 transition-all duration-300 h-12"
              {...register("lname")}
              placeholder="Enter last name (optional)"
            />
            {errors.lname && (
              <p className="text-[#EF4444] text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.lname.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 bg-gradient-to-br from-[#1C1C27] to-[#262633] border border-gray-700/30 rounded-2xl shadow-2xl p-6">
        <Button
          type="button"
          onClick={handleCancelEdit}
          disabled={isSaving}
          className="group flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none relative overflow-hidden bg-[#1C1C27] text-white border border-gray-700/50 shadow-lg hover:bg-[#262633] hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          <div className="flex items-center justify-center mr-3 rounded-lg transition-all duration-300 h-8 w-8 bg-[#EF4444]/20 text-[#EF4444] shadow-lg">
            <XCircle
              className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300"
              aria-hidden="true"
            />
          </div>
          <span className="text-sm font-semibold transition-colors duration-300 text-white">
            Cancel
          </span>
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
          className="group flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none relative overflow-hidden bg-green-500/20 text-white border border-green-500/50 shadow-lg hover:bg-green-500/30 hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {isSaving ? (
            <>
              <div className="flex items-center justify-center mr-3 rounded-lg transition-all duration-300 h-8 w-8 bg-green-500/20 text-green-500 shadow-lg">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <span className="text-sm font-semibold transition-colors duration-300 text-white">
                Saving...
              </span>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center mr-3 rounded-lg transition-all duration-300 h-8 w-8 bg-green-500/20 text-green-500 shadow-lg">
                <Save
                  className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300"
                  aria-hidden="true"
                />
              </div>
              <span className="text-sm font-semibold transition-colors duration-300 text-white">
                Save Changes
              </span>
            </>
          )}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-[#1C1C27] text-white">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-dark-primary flex items-center gap-3">
              <div className="p-2 rounded-full flex items-center justify-center bg-secondary/20">
                <CircleUserRound className="w-6 h-6 text-secondary" />
              </div>
              My Profile
            </h2>
            <p className="text-slate-400 text-lg">
              Manage your account information and preferences
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-gradient-to-br from-[#1C1C27] to-[#262633] border border-gray-700/30 rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden">
          {/* Loading State */}
          {loading && <LoadingIndicator />}

          {/* Error State */}
          {!loading && error && !user && renderError()}

          {/* Profile Content */}
          {!loading && user && (
            <div className="p-6">
              {isEditing ? renderProfileForm() : renderProfileDisplay()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
