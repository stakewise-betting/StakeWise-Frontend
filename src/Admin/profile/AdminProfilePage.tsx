// StakeWise-Frontend/src/Admin/profile/AdminProfilePage.tsx (Create folder and file)
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { IUser } from "@/types/user.types"; // Adjust path if necessary
import {
  fetchCurrentUserData,
  updateCurrentUserProfile,
} from "@/services/userService"; // Import service functions
import { profileSchema, ProfileFormData } from "@/schema/profileSchema"; // Import schema and type

const AdminProfilePage: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset, // Use reset to populate/clear form
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      // Initialize default values
      fname: "",
      lname: "",
      username: "",
    },
  });

  // Fetch user data on mount
  const loadUserData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await fetchCurrentUserData();
      setUser(userData);
      // Populate form with fetched data when loading finishes
      reset({
        fname: userData.fname || "",
        lname: userData.lname || "",
        username: userData.username || "", // Username should exist, provide fallback just in case
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
  }, [reset]); // Add reset as dependency

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Handle form submission
  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    setError(null); // Clear previous errors
    console.log("Submitting profile data:", data);

    // Ensure we only send non-empty strings or null for optional fields
    const updateData = {
      fname: data.fname?.trim() || null,
      lname: data.lname?.trim() || null,
      username: data.username.trim(), // Username is required by schema
    };

    try {
      const updatedUser = await updateCurrentUserProfile(updateData);
      setUser(updatedUser); // Update local state with response from backend
      reset(updatedUser); // Update form values to match saved state
      setIsEditing(false); // Exit editing mode
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

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to original user data if changes were made
    if (user) {
      reset({
        fname: user.fname || "",
        lname: user.lname || "",
        username: user.username || "",
      });
    }
    setError(null); // Clear any previous submission errors
  };

  // Helper to get initials for Avatar fallback
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

  // --- Render Functions ---

  const renderLoading = () => (
    <Card className="bg-gradient-to-br from-[#252538] to-[#2A2A3E] border-gray-600/50 shadow-2xl shadow-black/20 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#2A2A3E] to-[#252538] border-b border-gray-600/30 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gradient-to-r from-gray-600 to-gray-500 rounded-lg w-1/3"></div>
          <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded w-1/2"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 p-8">
        <div className="flex items-center space-x-6">
          <div className="animate-pulse">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-gray-600 to-gray-500"></div>
          </div>
          <div className="space-y-3 flex-1">
            <div className="animate-pulse space-y-2">
              <div className="h-6 bg-gradient-to-r from-gray-600 to-gray-500 rounded w-48"></div>
              <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded w-32"></div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl w-full"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl w-full"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl w-full"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderError = () => (
    <Alert className="bg-gradient-to-r from-[#EF4444]/10 to-[#DC2626]/10 border-2 border-[#EF4444]/50 rounded-xl shadow-2xl shadow-[#EF4444]/20 p-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#EF4444] to-[#DC2626] flex items-center justify-center shadow-lg shadow-[#EF4444]/30">
          <AlertCircle className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <AlertTitle className="text-[#EF4444] font-bold text-xl flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Error Loading Profile
          </AlertTitle>
          <AlertDescription className="text-gray-300 mt-2 text-base">
            {error} - Please{" "}
            <button
              onClick={loadUserData}
              className="underline font-semibold text-[#3B82F6] hover:text-[#1D4ED8] transition-colors duration-200"
            >
              try again
            </button>
            .
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );

  const renderProfileDisplay = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-gradient-to-r from-[#3B82F6] to-[#1D4ED8] shadow-2xl shadow-[#3B82F6]/30 ring-4 ring-[#3B82F6]/20">
              <AvatarImage
                src={user?.picture || user?.avatarSrc || ""}
                alt={user?.username}
                className="object-cover"
              />
              <AvatarFallback className="text-3xl bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] text-white font-bold shadow-inner">
                {getUserInitials(user)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-[#10B981] to-[#059669] flex items-center justify-center shadow-lg">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">
              {user?.fname || user?.lname
                ? `${user.fname || ""} ${user.lname || ""}`.trim()
                : user?.username}
            </h3>
            <p className="text-gray-400 text-base flex items-center gap-2">
              <span>Email:</span>
              {user?.email || "No email provided"}
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#E27625]/20 to-[#F59E0B]/20 border border-[#E27625]/30">
                <span className="text-[#E27625] font-semibold text-sm">
                  {user?.role?.toUpperCase()}
                </span>
              </div>
              {user?.isAccountVerified && (
                <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#10B981]/20 to-[#059669]/20 border border-[#10B981]/30">
                  <span className="text-[#10B981] font-semibold text-sm">
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
            className="bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#3B82F6] text-white font-semibold px-6 py-3 transition-all duration-300 hover:scale-105 shadow-lg shadow-[#3B82F6]/30"
          >
            <Pencil className="mr-2 h-5 w-5" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information Card */}
        <div className="bg-gradient-to-r from-[#1C1C27] to-[#252538] rounded-xl p-6 border border-gray-600/30 shadow-lg">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CircleUserRound className="h-5 w-5" />
            Personal Information
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-600/20">
              <Label className="text-gray-400 font-medium">Username</Label>
              <p className="text-white font-semibold">
                {user?.username || "N/A"}
              </p>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-600/20">
              <Label className="text-gray-400 font-medium">First Name</Label>
              <p className="text-white">
                {user?.fname || (
                  <span className="italic text-gray-500">Not set</span>
                )}
              </p>
            </div>
            <div className="flex justify-between items-center py-2">
              <Label className="text-gray-400 font-medium">Last Name</Label>
              <p className="text-white">
                {user?.lname || (
                  <span className="italic text-gray-500">Not set</span>
                )}
              </p>
            </div>
          </div>
        </div>
        {/* Account Details Card */}
        <div className="bg-gradient-to-r from-[#1C1C27] to-[#252538] rounded-xl p-6 border border-gray-600/30 shadow-lg">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Account Details
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-600/20">
              <Label className="text-gray-400 font-medium">Role</Label>
              <p className="text-white font-semibold capitalize">
                {user?.role}
              </p>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-600/20">
              <Label className="text-gray-400 font-medium">Joined</Label>
              <p className="text-white">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div className="flex justify-between items-center py-2">
              <Label className="text-gray-400 font-medium">Auth Provider</Label>
              <p className="text-white capitalize">{user?.authProvider}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Status Card */}
        <div
          className={`rounded-xl p-6 border shadow-lg ${
            user?.isAccountVerified
              ? "bg-gradient-to-r from-[#10B981]/10 to-[#059669]/10 border-[#10B981]/30"
              : "bg-gradient-to-r from-[#E27625]/10 to-[#F59E0B]/10 border-[#E27625]/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                user?.isAccountVerified
                  ? "bg-gradient-to-r from-[#10B981] to-[#059669]"
                  : "bg-gradient-to-r from-[#E27625] to-[#F59E0B]"
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
                  user?.isAccountVerified ? "text-[#10B981]" : "text-[#E27625]"
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
          <div className="bg-gradient-to-r from-[#3B82F6]/10 to-[#1D4ED8]/10 rounded-xl p-6 border border-[#3B82F6]/30 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-[#3B82F6]">Wallet Address</h4>
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
        <Alert className="bg-gradient-to-r from-[#EF4444]/10 to-[#DC2626]/10 border-2 border-[#EF4444]/50 rounded-xl shadow-lg p-6">
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
      )}

      {/* Avatar Section */}
      <div className="bg-gradient-to-r from-[#1C1C27] to-[#252538] rounded-xl p-6 border border-gray-600/30 shadow-lg">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-gradient-to-r from-[#3B82F6] to-[#1D4ED8] shadow-2xl shadow-[#3B82F6]/30 ring-4 ring-[#3B82F6]/20">
              <AvatarImage
                src={user?.picture || user?.avatarSrc || ""}
                alt={user?.username}
                className="object-cover"
              />
              <AvatarFallback className="text-3xl bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] text-white font-bold shadow-inner">
                {getUserInitials(user)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-[#E27625] to-[#F59E0B] flex items-center justify-center shadow-lg">
              <Pencil className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">{user?.username}</h3>
            <p className="text-gray-400 flex items-center gap-2">
              <span>Email:</span>
              {user?.email || "No email provided"}
            </p>
            <p className="text-[#E27625] text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Avatar and Email cannot be changed here
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-gradient-to-r from-[#1C1C27] to-[#252538] rounded-xl p-6 border border-gray-600/30 shadow-lg">
        <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Pencil className="h-5 w-5" />
          Edit Information
        </h4>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-gray-300 font-medium flex items-center gap-2"
            >
              <CircleUserRound className="h-4 w-4" />
              Username
            </Label>
            <Input
              id="username"
              className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] border-gray-600/50 text-white placeholder-gray-400 focus:border-[#3B82F6] focus:ring-[#3B82F6]/20 transition-all duration-300 h-12"
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
              className="text-gray-300 font-medium flex items-center gap-2"
            >
              <CircleUserRound className="h-4 w-4" />
              First Name
            </Label>
            <Input
              id="fname"
              className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] border-gray-600/50 text-white placeholder-gray-400 focus:border-[#10B981] focus:ring-[#10B981]/20 transition-all duration-300 h-12"
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
              className="text-gray-300 font-medium flex items-center gap-2"
            >
              <CircleUserRound className="h-4 w-4" />
              Last Name
            </Label>
            <Input
              id="lname"
              className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] border-gray-600/50 text-white placeholder-gray-400 focus:border-[#10B981] focus:ring-[#10B981]/20 transition-all duration-300 h-12"
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
      <div className="flex justify-end space-x-4 bg-gradient-to-r from-[#252538]/50 to-[#2A2A3E]/50 p-6 rounded-xl border border-gray-600/30">
        <Button
          type="button"
          onClick={handleCancelEdit}
          disabled={isSaving}
          className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] hover:from-[#2A2A3E] hover:to-[#252538] border-gray-600/50 text-white hover:text-white transition-all duration-300 px-6 py-3"
        >
          <XCircle className="mr-2 h-5 w-5" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#10B981] text-white font-semibold px-8 py-3 transition-all duration-300 hover:scale-105 shadow-lg shadow-[#10B981]/30"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="bg-gradient-to-br from-[#1C1C27] via-[#252538] to-[#2A2A3E] min-h-screen p-6 -m-6">
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-2xl p-8 shadow-2xl shadow-black/20 border border-gray-700/50">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] bg-clip-text text-transparent flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center shadow-lg shadow-[#3B82F6]/30">
              <CircleUserRound className="w-6 h-6 text-white" />
            </div>
            My Profile
          </h2>
          <p className="text-gray-400 mt-2 text-lg">
            Manage your account information and preferences
          </p>
        </div>
        {/* Loading State */}
        {loading && renderLoading()}

        {/* Error State */}
        {!loading && error && !user && renderError()}

        {/* Profile Content */}
        {!loading && user && (
          <Card className="bg-gradient-to-br from-[#252538] to-[#2A2A3E] border-gray-600/50 shadow-2xl shadow-black/20 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#2A2A3E] to-[#252538] border-b border-gray-600/30 p-8">
              <CardTitle className="text-2xl text-white font-bold flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#10B981] to-[#059669] flex items-center justify-center">
                  <span className="text-white text-lg">ℹ️</span>
                </div>
                Account Information
              </CardTitle>
              <CardDescription className="text-gray-400 text-lg mt-2">
                {isEditing
                  ? "✏️ Update your profile details and save changes"
                  : "📋 View and manage your account details"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {isEditing ? renderProfileForm() : renderProfileDisplay()}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminProfilePage;
