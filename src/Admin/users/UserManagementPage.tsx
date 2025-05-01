// StakeWise-Frontend/src/Admin/users/UserManagementPage.tsx (Create this new file)
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Assuming you have Alert
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have Skeleton
import { Users as UsersIcon, AlertCircle } from "lucide-react";
import UserTable from "./UserTable"; // Import the table component
import { fetchAllUsers, deleteUserById } from "@/services/adminService"; // Import API functions
import { IUser } from "@/types/user.types"; // Adjust path if needed
import { toast } from "sonner"; // Or your preferred toast library

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null); // Track deletion state

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUsers = await fetchAllUsers();
      setUsers(fetchedUsers);
    } catch (err: any) {
      setError(
        `Failed to load users: ${
          err.response?.data?.message || err.message || "Unknown error"
        }`
      );
      toast.error(
        `Error loading users: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDeleteUser = async (userId: string): Promise<void> => {
    setDeletingUserId(userId); // Set loading state for this specific user
    try {
      const result = await deleteUserById(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      toast.success(result.message || "User deleted successfully!");
    } catch (err: any) {
      console.error("Deletion error:", err);
      toast.error(
        `Failed to delete user: ${
          err.response?.data?.message || err.message || "Server error"
        }`
      );
      // Re-throw the error so the Table component knows it failed
      throw err;
    } finally {
      setDeletingUserId(null); // Clear loading state regardless of success/failure
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" /> {/* Header Skeleton */}
          <Skeleton className="h-[40px] w-full" /> {/* Table Header Skeleton */}
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-[50px] w-full"
            /> /* Table Row Skeletons */
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Alert
          variant="destructive"
          className="dark border-red-500/50 bg-red-900/20 text-red-300"
        >
          <AlertCircle className="h-4 w-4 !text-red-400" />{" "}
          {/* Ensure icon color */}
          <AlertTitle className="text-red-300">Error</AlertTitle>
          <AlertDescription className="text-red-400">
            {error} - Please try refreshing the page.
          </AlertDescription>
        </Alert>
      );
    }

    if (users.length === 0) {
      return <p className="text-center text-dark-secondary">No users found.</p>;
    }

    return (
      <div className="overflow-x-auto">
        <UserTable
          users={users}
          onDeleteUser={handleDeleteUser}
          deletingUserId={deletingUserId}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-dark-primary flex items-center gap-3">
        <UsersIcon className="w-7 h-7 text-secondary" />
        User Management
      </h2>

      <Card className="bg-card border border-gray-700/60 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-dark-primary">
            All Registered Users ({users.length})
          </CardTitle>
          {/* Optional: Add search/filter input here later */}
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </div>
  );
};

export default UserManagementPage;
