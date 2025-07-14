// StakeWise-Frontend/src/Admin/users/UserManagementPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Users as UsersIcon, AlertCircle } from "lucide-react";
import UserTable from "./UserTable";
import RoleChangeDialog from "./RoleChangeDialog";
import { fetchAllUsers, deleteUserById, changeUserRole } from "@/services/adminService"; 
import { IUser } from "@/types/user.types";
import { toast } from "sonner";

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  
  const [roleChangeDialog, setRoleChangeDialog] = useState<{
    isOpen: boolean;
    user: IUser | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    user: null,
    isLoading: false,
  });

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
    setDeletingUserId(userId);
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
      throw err;
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleRoleChange = (user: IUser) => {
    setRoleChangeDialog({
      isOpen: true,
      user,
      isLoading: false,
    });
  };

  const handleConfirmRoleChange = async (userId: string, newRole: string) => {
    setRoleChangeDialog(prev => ({ ...prev, isLoading: true }));
    
    try {
      const result = await changeUserRole(userId, newRole);
      
      // Update the user in the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole as "admin" | "moderator" | "user" } : user
        )
      );
      
      toast.success(result.message || "User role updated successfully!");
      
      setRoleChangeDialog({
        isOpen: false,
        user: null,
        isLoading: false,
      });
    } catch (err: any) {
      console.error("Role change error:", err);
      toast.error(
        `Failed to change user role: ${
          err.response?.data?.message || err.message || "Server error"
        }`
      );
      setRoleChangeDialog(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCloseRoleDialog = () => {
    setRoleChangeDialog({
      isOpen: false,
      user: null,
      isLoading: false,
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-[40px] w-full" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-[50px] w-full" />
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
          <AlertCircle className="h-4 w-4 !text-red-400" />
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
          onChangeRole={handleRoleChange} 
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
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>

      <RoleChangeDialog
        user={roleChangeDialog.user}
        isOpen={roleChangeDialog.isOpen}
        onClose={handleCloseRoleDialog}
        onConfirm={handleConfirmRoleChange}
        isLoading={roleChangeDialog.isLoading}
      />
    </div>
  );
};

export default UserManagementPage;