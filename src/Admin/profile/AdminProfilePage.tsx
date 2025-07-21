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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  CircleUserRound,
  Pencil,
  Save,
  XCircle,
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  Calendar,
  Shield,
  Wallet,
  Crown,
  Sparkles,
} from "lucide-react";
import { IUser } from "@/types/user.types";
import {
  fetchCurrentUserData,
  updateCurrentUserProfile,
} from "@/services/userService";
import { profileSchema, ProfileFormData } from "@/schema/profileSchema";

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
        `Failed to load profile data: ${err.response?.data?.message || err.message
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

  const getRoleBadge = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return (
          <Badge className="bg-secondary text-white shadow-lg">
            <Crown className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        );
      case "moderator":
        return (
          <Badge className="bg-orange-500 text-white shadow-lg">
            <Shield className="w-3 h-3 mr-1" />
            Moderator
          </Badge>
        );
      case "user":
        return (
          <Badge className="bg-gray-600 text-white shadow-lg">
            <User className="w-3 h-3 mr-1" />
            User
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500 text-white shadow-lg">
            <User className="w-3 h-3 mr-1" />
            {role}
          </Badge>
        );
    }
  };

  const renderLoading = () => (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-card border border-gray-700/60 shadow-lg">
        <div className="p-8">
          <div className="flex items-center space-x-6 mb-8">
            <Skeleton className="h-28 w-28 rounded-full bg-gray-700/50" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-48 bg-gray-700/50" />
              <Skeleton className="h-5 w-32 bg-gray-700/50" />
              <Skeleton className="h-6 w-24 bg-gray-700/50" />
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-5 w-5 bg-gray-700/50" />
                <Skeleton className="h-4 w-24 bg-gray-700/50" />
                <Skeleton className="h-4 w-40 bg-gray-700/50" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderError = () => (
    <Alert className="dark border-red-500/50 bg-red-900/20 text-red-300 animate-fade-in">
      <AlertCircle className="h-5 w-5 !text-red-400" />
      <AlertTitle className="font-semibold text-red-300">Error Loading Profile</AlertTitle>
      <AlertDescription className="mt-2 text-red-400">
        {error}
        <Button
          onClick={loadUserData}
          variant="link"
          className="p-0 ml-2 text-red-300 underline font-semibold hover:text-red-200"
        >
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );

  const renderProfileDisplay = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Profile Section */}
      <div className="bg-gradient-to-br from-secondary/5 to-orange-500/5 rounded-2xl p-8 border border-secondary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-32 w-32 shadow-lg border-4 border-white dark:border-gray-800">
                <AvatarImage
                  src={user?.picture || user?.avatarSrc || ""}
                  alt={user?.username}
                  className="object-cover"
                />
                <AvatarFallback className="text-4xl bg-gradient-to-br from-secondary to-orange-500 text-white font-bold">
                  {getUserInitials(user)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2">
                {getRoleBadge(user?.role || "")}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-bold text-dark-primary">
                {user?.fname || user?.lname
                  ? `${user.fname || ""} ${user.lname || ""}`.trim()
                  : user?.username}
              </h3>
              <div className="flex items-center space-x-2 text-dark-secondary">
                <Mail className="w-4 h-4" />
                <span>{user?.email || "No email provided"}</span>
              </div>
              <div className="flex items-center space-x-3">
                {user?.isAccountVerified ? (
                  <Badge className="bg-green-500 text-white shadow-lg">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge className="bg-orange-500 text-white shadow-lg">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Unverified
                  </Badge>
                )}
                <span className="text-sm text-dark-secondary/70">
                  Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : "N/A"}
                </span>
              </div>
            </div>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="dark:border-gray-600 dark:hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border border-gray-700/60 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-secondary/20 rounded-lg">
                <User className="w-5 h-5 text-secondary" />
              </div>
              <h4 className="text-lg font-semibold text-dark-primary">
                Personal Information
              </h4>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-dark-secondary">Username</span>
                <span className="font-medium text-dark-primary">
                  {user?.username || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-dark-secondary">First Name</span>
                <span className="font-medium text-dark-primary">
                  {user?.fname || <span className="italic text-dark-secondary/70">Not set</span>}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-dark-secondary">Last Name</span>
                <span className="font-medium text-dark-primary">
                  {user?.lname || <span className="italic text-dark-secondary/70">Not set</span>}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-gray-700/60 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-orange-500" />
              </div>
              <h4 className="text-lg font-semibold text-dark-primary">
                Account Security
              </h4>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-dark-secondary">Auth Provider</span>
                <span className="font-medium text-dark-primary capitalize">
                  {user?.authProvider}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-dark-secondary">Account Status</span>
                <span className={`font-medium ${user?.isAccountVerified ? 'text-green-500' : 'text-orange-500'}`}>
                  {user?.isAccountVerified ? 'Active' : 'Pending Verification'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-dark-secondary">Role</span>
                <span className="font-medium text-dark-primary capitalize">
                  {user?.role}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Information */}
      {user?.walletAddress && (
        <Card className="bg-card border border-gray-700/60 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-secondary/20 rounded-lg">
                <Wallet className="w-5 h-5 text-secondary" />
              </div>
              <h4 className="text-lg font-semibold text-dark-primary">
                Wallet Information
              </h4>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-xs font-mono text-dark-primary break-all">
                {user.walletAddress}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderProfileForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-fade-in">
      {error && (
        <Alert className="dark border-red-500/50 bg-red-900/20 text-red-300">
          <AlertCircle className="h-5 w-5 !text-red-400" />
          <AlertTitle className="font-semibold text-red-300">Update Failed</AlertTitle>
          <AlertDescription className="mt-2 text-red-400">{error}</AlertDescription>
        </Alert>
      )}

      {/* Profile Header */}
      <div className="bg-gradient-to-br from-secondary/5 to-orange-500/5 rounded-2xl p-8 border border-secondary/10">
        <div className="flex items-center space-x-6">
          <Avatar className="h-32 w-32 shadow-lg border-4 border-white dark:border-gray-800">
            <AvatarImage
              src={user?.picture || user?.avatarSrc || ""}
              alt={user?.username}
              className="object-cover"
            />
            <AvatarFallback className="text-4xl bg-gradient-to-br from-secondary to-orange-500 text-white font-bold">
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-3">
            <h3 className="text-3xl font-bold text-dark-primary">
              Editing Profile
            </h3>
            <div className="flex items-center space-x-2 text-dark-secondary">
              <Mail className="w-4 h-4" />
              <span>{user?.email || "No email provided"}</span>
            </div>
            <div className="flex items-center space-x-2 text-orange-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">Avatar and Email cannot be changed here</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <Card className="bg-card border border-gray-700/60 shadow-lg">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="username" className="text-dark-secondary font-medium mb-2 block">
                  Username
                </Label>
                <Input
                  id="username"
                  className="bg-gray-800/40 text-white border-2 border-gray-600 focus:border-secondary dark:focus:border-secondary rounded-lg shadow-sm transition-colors font-medium placeholder:text-gray-400"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-red-400 text-sm mt-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="fname" className="text-dark-secondary font-medium mb-2 block">
                  First Name
                </Label>
                <Input
                  id="fname"
                  className="bg-gray-800/40 text-white border-2 border-gray-600 focus:border-secondary dark:focus:border-secondary rounded-lg shadow-sm transition-colors font-medium placeholder:text-gray-400"
                  {...register("fname")}
                  placeholder="Enter your first name"
                />
                {errors.fname && (
                  <p className="text-red-400 text-sm mt-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.fname.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="lname" className="text-dark-secondary font-medium mb-2 block">
                  Last Name
                </Label>
                <Input
                  id="lname"
                  className="bg-gray-800/40 text-white border-2 border-gray-600 focus:border-secondary dark:focus:border-secondary rounded-lg shadow-sm transition-colors font-medium placeholder:text-gray-400"
                  {...register("lname")}
                  placeholder="Enter your last name"
                />
                {errors.lname && (
                  <p className="text-red-400 text-sm mt-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.lname.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="text-center p-8 bg-gradient-to-br from-secondary/10 to-orange-500/10 rounded-2xl border-2 border-dashed border-secondary/30">
                <User className="w-16 h-16 mx-auto text-secondary mb-4" />
                <h4 className="text-lg font-semibold text-dark-primary mb-2">
                  Profile Update
                </h4>
                <p className="text-dark-secondary text-sm">
                  Make sure your profile information is accurate and up to date for the best experience.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancelEdit}
          disabled={isSaving}
          className="border-2 border-gray-600 hover:bg-gray-700 transition-colors"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button
          type="submit"
          variant="secondary"
          disabled={isSaving}
          className="bg-secondary hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="text-3xl font-bold text-dark-primary flex items-center gap-3">
            <CircleUserRound className="w-7 h-7 text-secondary" />
            My Profile
          </h2>
          
        </div>
      </div>
      <div >
        {/* Content */}
        {loading && renderLoading()}
        {!loading && error && !user && renderError()}
        {!loading && user && (
          <Card className="bg-card border border-gray-700/60 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center ">
              <CardTitle className="text-2xl font-bold text-dark-primary">
                Account Information
              </CardTitle>
              <CardDescription className="text-dark-secondary text-base">
                {isEditing
                  ? "Update your profile details below"
                  : "Your current account information"}
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