// StakeWise-Frontend/src/Admin/users/UserTable.tsx
import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, UserCog } from "lucide-react";
import { format } from "date-fns";
import { IUser } from "@/types/user.types";
import { toast } from "sonner";

interface UserTableProps {
  users: IUser[];
  onDeleteUser: (userId: string) => Promise<void>;
  onChangeRole: (user: IUser) => void;
  deletingUserId: string | null;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  onDeleteUser,
  onChangeRole,
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
    return "?";
  };

  const handleDeleteClick = (userId: string, userIdentifier: string) => {
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
        return "destructive";
      case "metamask":
        return "secondary";
      case "credentials":
        return "outline";
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
      case "user":
      default:
        return "outline";
    }
  };

  return (
    <div className="bg-[#1C1C27] rounded-xl border border-gray-700/30 backdrop-blur-sm overflow-hidden">
      <Table className="w-full border-collapse text-sm text-white">
        <TableHeader className="bg-[#1C1C27] backdrop-blur-sm [&_tr]:border-b [&_tr]:border-gray-700/30">
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-300 whitespace-nowrap w-[50px]">
              Avatar
            </TableHead>
            <TableHead className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-300 min-w-[120px]">
              Name
            </TableHead>
            <TableHead className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-300 min-w-[150px]">
              Contact
            </TableHead>
            <TableHead className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-300 whitespace-nowrap w-[80px]">
              Auth
            </TableHead>
            <TableHead className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-300 whitespace-nowrap w-[70px]">
              Role
            </TableHead>
            <TableHead className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-300 whitespace-nowrap w-[70px]">
              Status
            </TableHead>
            <TableHead className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-300 whitespace-nowrap w-[90px]">
              Joined
            </TableHead>
            <TableHead className="px-3 py-3 text-right text-xs font-bold uppercase tracking-wider text-indigo-300 whitespace-nowrap w-[100px]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr:last-child]:border-0">
          {users.map((user) => (
            <TableRow
              key={user._id}
              className="border-b border-gray-700/30 transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-800/30 hover:to-gray-700/30 hover:border-gray-600/50 backdrop-blur-sm"
            >
              <TableCell className="px-3 py-3 whitespace-nowrap">
                <Avatar className="h-8 w-8 ring-1 ring-gray-600/30">
                  <AvatarImage
                    src={user.picture || user.avatarSrc || ""}
                    alt={user.username || "User"}
                  />
                  <AvatarFallback className="bg-secondary/20 text-secondary font-semibold text-xs">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="px-3 py-3 text-sm font-medium text-white">
                <div className="truncate max-w-[120px]">
                  {user.fname || user.lname
                    ? `${user.fname || ""} ${user.lname || ""}`.trim()
                    : user.username || "N/A"}
                </div>
              </TableCell>
              <TableCell className="px-3 py-3 text-xs text-slate-300">
                <div
                  className="truncate max-w-[150px]"
                  title={user.email || user.walletAddress || "N/A"}
                >
                  {user.email || user.walletAddress || "N/A"}
                </div>
              </TableCell>
              <TableCell className="px-3 py-3 whitespace-nowrap">
                <Badge
                  variant={getAuthProviderBadgeVariant(user.authProvider)}
                  className="capitalize text-xs px-1.5 py-0.5 bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border-purple-500/40"
                >
                  {user.authProvider === "credentials"
                    ? "Email"
                    : user.authProvider === "metamask"
                    ? "Web3"
                    : user.authProvider}
                </Badge>
              </TableCell>
              <TableCell className="px-3 py-3 whitespace-nowrap">
                <Badge
                  variant={getRoleBadgeVariant(user.role)}
                  className="capitalize text-xs px-1.5 py-0.5 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-300 border-emerald-500/40"
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell className="px-3 py-3 whitespace-nowrap">
                <Badge
                  variant={user.isAccountVerified ? "default" : "secondary"}
                  className={`text-xs px-1.5 py-0.5 ${
                    user.isAccountVerified
                      ? "bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-300 border-green-500/40"
                      : "bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border-amber-500/40"
                  }`}
                >
                  {user.isAccountVerified ? "✓" : "✗"}
                </Badge>
              </TableCell>
              <TableCell className="px-3 py-3 whitespace-nowrap text-xs text-slate-300">
                <div className="bg-gradient-to-r from-indigo-900/20 to-indigo-800/20 border border-indigo-700/30 rounded-lg px-1.5 py-1 text-center">
                  {format(new Date(user.createdAt), "MMM d")}
                </div>
              </TableCell>
              <TableCell className="px-3 py-3 whitespace-nowrap text-right">
                <div className="flex items-center gap-1 justify-end">
                  {/* Role Change Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onChangeRole(user)}
                    className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 border border-gray-600/30 text-gray-300 hover:from-indigo-600/20 hover:to-indigo-500/20 hover:border-indigo-500/40 hover:text-indigo-300 transition-all duration-300 rounded-lg px-2 py-1 text-xs h-8 w-8 p-0"
                    title="Change Role"
                  >
                    <UserCog className="h-3 w-3" />
                  </Button>

                  {/* Delete Button */}
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
                    disabled={deletingUserId === user._id}
                    className="bg-gradient-to-r from-red-600/80 to-red-500/80 hover:from-red-600/90 hover:to-red-500/90 text-white border-0 rounded-lg shadow-lg hover:shadow-red-500/25 transition-all duration-300 text-xs h-8 w-8 p-0"
                    title="Delete User"
                  >
                    {deletingUserId === user._id ? (
                      <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
