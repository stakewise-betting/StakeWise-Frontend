// StakeWise-Frontend/src/Admin/users/UserTable.tsx (Create this new file and folder)
import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"; // Assuming you have these shadcn table components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, User as UserIcon } from "lucide-react";
import { format } from "date-fns"; // For date formatting
import { IUser } from "@/types/user.types"; // Adjust path if needed
import { toast } from "sonner"; // Or react-toastify

interface UserTableProps {
  users: IUser[];
  onDeleteUser: (userId: string) => Promise<void>; // Function to handle deletion
  deletingUserId: string | null; // Track which user is being deleted
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  onDeleteUser,
  deletingUserId,
}) => {
  const getUserInitials = (user: IUser): string => {
    const fnameInitial = user.fname ? user.fname[0] : "";
    const lnameInitial = user.lname ? user.lname[0] : "";
    if (fnameInitial || lnameInitial) {
      return `${fnameInitial}${lnameInitial}`.toUpperCase();
    }
    if (user.username) {
      return user.username[0].toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "?"; // Fallback
  };

  const handleDeleteClick = (userId: string, userIdentifier: string) => {
    // Basic confirmation
    if (
      window.confirm(
        `Are you sure you want to delete user: ${userIdentifier}? This action cannot be undone.`
      )
    ) {
      onDeleteUser(userId).catch((err) => {
        toast.error(`Failed to delete user: ${err.message || "Unknown error"}`);
      });
    }
  };

  const getAuthProviderBadgeVariant = (
    provider: string
  ): "secondary" | "outline" | "default" | "destructive" => {
    switch (provider) {
      case "google":
        return "destructive"; // Example color
      case "metamask":
        return "secondary"; // Example color
      case "credentials":
        return "outline"; // Example color
      default:
        return "default";
    }
  };

  const getRoleBadgeVariant = (
    role: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (role) {
      case "admin":
        return "destructive";
      case "moderator":
        return "secondary";
      case "user":
      default:
        return "outline";
    }
  };

  return (
    <Table className="min-w-full divide-y divide-gray-700">
      <TableHeader className="bg-card">
        <TableRow>
          <TableHead className="px-4 py-3 text-left text-xs font-medium text-dark-secondary uppercase tracking-wider w-[50px]">
            Avatar
          </TableHead>
          <TableHead className="px-4 py-3 text-left text-xs font-medium text-dark-secondary uppercase tracking-wider">
            Name/Username
          </TableHead>
          <TableHead className="px-4 py-3 text-left text-xs font-medium text-dark-secondary uppercase tracking-wider">
            Email/Wallet
          </TableHead>
          <TableHead className="px-4 py-3 text-left text-xs font-medium text-dark-secondary uppercase tracking-wider">
            Auth
          </TableHead>
          <TableHead className="px-4 py-3 text-left text-xs font-medium text-dark-secondary uppercase tracking-wider">
            Role
          </TableHead>
          <TableHead className="px-4 py-3 text-left text-xs font-medium text-dark-secondary uppercase tracking-wider">
            Verified
          </TableHead>
          <TableHead className="px-4 py-3 text-left text-xs font-medium text-dark-secondary uppercase tracking-wider">
            Joined
          </TableHead>
          <TableHead className="px-4 py-3 text-right text-xs font-medium text-dark-secondary uppercase tracking-wider">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-primary divide-y divide-gray-700/50">
        {users.map((user) => (
          <TableRow
            key={user._id}
            className="hover:bg-card/50 transition-colors"
          >
            <TableCell className="px-4 py-3 whitespace-nowrap">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={user.picture || user.avatarSrc || ""}
                  alt={user.username || "User"}
                />
                <AvatarFallback className="bg-secondary/20 text-secondary font-semibold">
                  {getUserInitials(user)}
                </AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell className="px-4 py-3 whitespace-nowrap text-sm font-medium text-dark-primary">
              {user.fname || user.lname
                ? `${user.fname || ""} ${user.lname || ""}`.trim()
                : user.username || "N/A"}
            </TableCell>
            <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-dark-secondary truncate max-w-[200px]">
              {user.email || user.walletAddress || "N/A"}
            </TableCell>
            <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-dark-secondary">
              <Badge
                variant={getAuthProviderBadgeVariant(user.authProvider)}
                className="capitalize"
              >
                {user.authProvider}
              </Badge>
            </TableCell>
            <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-dark-secondary">
              <Badge
                variant={getRoleBadgeVariant(user.role)}
                className="capitalize"
              >
                {user.role}
              </Badge>
            </TableCell>
            <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-dark-secondary">
              <Badge
                variant={user.isAccountVerified ? "default" : "secondary"}
                className="capitalize"
              >
                {" "}
                {/* Assuming you have these variants */}
                {user.isAccountVerified ? "Yes" : "No"}
              </Badge>
            </TableCell>
            <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-dark-secondary">
              {format(new Date(user.createdAt), "MMM d, yyyy")}
            </TableCell>
            <TableCell className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  handleDeleteClick(
                    user._id,
                    user.username ||
                      user.email ||
                      user.walletAddress ||
                      user._id
                  )
                }
                disabled={deletingUserId === user._id} // Disable button while deleting this specific user
                className="px-2 py-1 h-auto" // Adjust padding for smaller size
              >
                {deletingUserId === user._id ? (
                  <span className="loader ease-linear rounded-full border-2 border-t-2 border-gray-200 h-4 w-4 mr-1"></span> // Simple spinner
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
