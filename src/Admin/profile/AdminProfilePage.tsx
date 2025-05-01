// StakeWise-Frontend/src/Admin/profile/AdminProfilePage.tsx (Create folder and file)
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CircleUserRound,
  Pencil,
  Save,
  XCircle,
  AlertCircle,
  CheckCircle,
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
    <Card className="bg-card border border-gray-700/60 shadow-lg">
      <CardHeader>
        <Skeleton className="h-6 w-1/3 bg-gray-700/50" />
        <Skeleton className="h-4 w-1/2 bg-gray-700/50 mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-20 w-20 rounded-full bg-gray-700/50" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-gray-700/50" />
            <Skeleton className="h-4 w-32 bg-gray-700/50" />
          </div>
        </div>
        <Skeleton className="h-8 w-full bg-gray-700/50" />
        <Skeleton className="h-8 w-full bg-gray-700/50" />
        <Skeleton className="h-8 w-full bg-gray-700/50" />
      </CardContent>
    </Card>
  );

  const renderError = () => (
    <Alert
      variant="destructive"
      className="dark border-red-500/50 bg-red-900/20 text-red-300"
    >
      <AlertCircle className="h-4 w-4 !text-red-400" />
      <AlertTitle className="text-red-300">Error</AlertTitle>
      <AlertDescription className="text-red-400">
        {error} - Please{" "}
        <button onClick={loadUserData} className="underline font-semibold">
          try again
        </button>
        .
      </AlertDescription>
    </Alert>
  );

  const renderProfileDisplay = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20 border-2 border-secondary">
            <AvatarImage
              src={user?.picture || user?.avatarSrc || ""}
              alt={user?.username}
            />
            <AvatarFallback className="text-2xl bg-secondary/20 text-secondary font-semibold">
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold text-dark-primary">
              {user?.fname || user?.lname
                ? `${user.fname || ""} ${user.lname || ""}`.trim()
                : user?.username}
            </h3>
            <p className="text-sm text-dark-secondary">
              {user?.email || "No email provided"}
            </p>
          </div>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="text-right text-dark-secondary">Username</Label>
          <p className="col-span-2 text-dark-primary font-medium">
            {user?.username || "N/A"}
          </p>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="text-right text-dark-secondary">First Name</Label>
          <p className="col-span-2 text-dark-primary">
            {user?.fname || (
              <span className="italic text-dark-secondary/70">Not set</span>
            )}
          </p>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="text-right text-dark-secondary">Last Name</Label>
          <p className="col-span-2 text-dark-primary">
            {user?.lname || (
              <span className="italic text-dark-secondary/70">Not set</span>
            )}
          </p>
        </div>
        {/* Add more fields to display as needed */}
        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="text-right text-dark-secondary">Role</Label>
          <p className="col-span-2 text-dark-primary capitalize font-semibold">
            {user?.role}
          </p>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="text-right text-dark-secondary">Joined</Label>
          <p className="col-span-2 text-dark-primary">
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="text-right text-dark-secondary">
            Account Verified
          </Label>
          <p
            className={`col-span-2 font-medium ${
              user?.isAccountVerified ? "text-green" : "text-orange-500"
            }`}
          >
            {user?.isAccountVerified ? (
              <CheckCircle className="inline h-4 w-4 mr-1" />
            ) : (
              <AlertCircle className="inline h-4 w-4 mr-1" />
            )}
            {user?.isAccountVerified ? "Verified" : "Not Verified"}
          </p>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="text-right text-dark-secondary">
            Auth Provider
          </Label>
          <p className="col-span-2 text-dark-primary capitalize">
            {user?.authProvider}
          </p>
        </div>
        {user?.walletAddress && (
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-right text-dark-secondary">
              Wallet Address
            </Label>
            <p
              className="col-span-2 text-dark-primary font-mono text-xs break-all"
              title={user.walletAddress}
            >
              {user.walletAddress}
            </p>
          </div>
        )}
      </div>
    </>
  );

  const renderProfileForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && ( // Display submission error within the form
        <Alert
          variant="destructive"
          className="dark border-red-500/50 bg-red-900/20 text-red-300"
        >
          <AlertCircle className="h-4 w-4 !text-red-400" />
          <AlertTitle className="text-red-300">Update Failed</AlertTitle>
          <AlertDescription className="text-red-400">{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex items-center space-x-4 mb-6">
        {/* Keep avatar display consistent */}
        <Avatar className="h-20 w-20 border-2 border-secondary">
          <AvatarImage
            src={user?.picture || user?.avatarSrc || ""}
            alt={user?.username}
          />
          <AvatarFallback className="text-2xl bg-secondary/20 text-secondary font-semibold">
            {getUserInitials(user)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-semibold text-dark-primary">
            {user?.username}
          </h3>
          <p className="text-sm text-dark-secondary">
            {user?.email || "No email provided"}
          </p>
          <p className="text-xs text-orange-400 mt-1">
            Avatar and Email cannot be changed here.
          </p>
        </div>
      </div>
      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="username" className="text-dark-secondary">
            Username
          </Label>
          <Input
            id="username"
            className="mt-1 dark:bg-black/20 dark:border-gray-600"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-red-400 text-xs mt-1">
              {errors.username.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="fname" className="text-dark-secondary">
            First Name
          </Label>
          <Input
            id="fname"
            className="mt-1 dark:bg-black/20 dark:border-gray-600"
            {...register("fname")}
            placeholder="Enter first name (optional)"
          />
          {errors.fname && (
            <p className="text-red-400 text-xs mt-1">{errors.fname.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="lname" className="text-dark-secondary">
            Last Name
          </Label>
          <Input
            id="lname"
            className="mt-1 dark:bg-black/20 dark:border-gray-600"
            {...register("lname")}
            placeholder="Enter last name (optional)"
          />
          {errors.lname && (
            <p className="text-red-400 text-xs mt-1">{errors.lname.message}</p>
          )}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancelEdit}
          disabled={isSaving}
          className="dark:border-gray-600 dark:hover:bg-gray-700"
        >
          <XCircle className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button type="submit" variant="secondary" disabled={isSaving}>
          {isSaving ? (
            <>
              <span className="loader ease-linear rounded-full border-2 border-t-2 border-gray-200 h-4 w-4 mr-2"></span>{" "}
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-dark-primary flex items-center gap-3">
        <CircleUserRound className="w-7 h-7 text-secondary" />
        My Profile
      </h2>
      {loading && renderLoading()}
      {!loading && error && !user && renderError()}{" "}
      {/* Show fetch error if no user data */}
      {!loading && user && (
        <Card className="bg-card border border-gray-700/60 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-dark-primary">
              Account Information
            </CardTitle>
            <CardDescription className="text-dark-secondary">
              {isEditing
                ? "Update your profile details."
                : "View your account details."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? renderProfileForm() : renderProfileDisplay()}
          </CardContent>
        </Card>
      )}
      {/* Maybe add sections for password change, avatar upload later */}
    </div>
  );
};

export default AdminProfilePage;
