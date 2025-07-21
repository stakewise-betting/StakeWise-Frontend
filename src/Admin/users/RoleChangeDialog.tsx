// StakeWise-Frontend/src/Admin/users/RoleChangeDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { IUser } from "@/types/user.types";
import { UserCog, Shield, Users, Crown } from "lucide-react";

interface RoleChangeDialogProps {
  user: IUser | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: string, newRole: string) => Promise<void>;
  isLoading: boolean;
}

const RoleChangeDialog: React.FC<RoleChangeDialogProps> = ({
  user,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>("");

  React.useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
    }
  }, [user]);

  const handleConfirm = async () => {
    if (user && selectedRole && selectedRole !== user.role) {
      await onConfirm(user._id, selectedRole);
      onClose();
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4" />;
      case "user":
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "text-red-400";
      case "user":
      default:
        return "text-gray-400";
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "admin":
        return "Full system access, can manage users and all content";
      case "user":
      default:
        return "Standard user with basic access permissions";
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-[#1C1C27] to-[#262633] border border-gray-700/30 shadow-2xl backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-3">
            <div className="p-2 rounded-full flex items-center justify-center bg-secondary/20">
              <UserCog className="h-5 w-5 text-secondary" />
            </div>
            Change User Role
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-700/40 p-4 rounded-xl border border-gray-600/30 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-sm font-semibold text-white">
                {user.fname || user.lname
                  ? `${user.fname || ""} ${user.lname || ""}`.trim()
                  : user.username || "N/A"}
              </div>
              <Badge
                variant="outline"
                className="text-xs bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border-purple-500/40"
              >
                {user.email || user.walletAddress || "N/A"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300">Current Role:</span>
              <Badge
                variant={
                  user.role === "admin"
                    ? "destructive"
                    : user.role === "moderator"
                    ? "secondary"
                    : "outline"
                }
                className="capitalize flex items-center gap-1 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-300 border-emerald-500/40"
              >
                {getRoleIcon(user.role)}
                {user.role}
              </Badge>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <Label className="text-white font-semibold">Select New Role:</Label>
            <RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
              {["user", "admin"].map((role) => (
                <div
                  key={role}
                  className="flex items-center space-x-3 p-4 border border-gray-600/30 rounded-xl hover:bg-gradient-to-r hover:from-gray-800/30 hover:to-gray-700/30 hover:border-gray-500/50 transition-all duration-300 shadow-lg backdrop-blur-sm"
                >
                  <RadioGroupItem
                    value={role}
                    id={role}
                    className="border-gray-500 text-secondary"
                  />
                  <Label htmlFor={role} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`p-1.5 rounded-lg ${getRoleColor(
                          role
                        )} bg-gradient-to-r from-gray-800/30 to-gray-700/30 border border-gray-600/30`}
                      >
                        {getRoleIcon(role)}
                      </div>
                      <span className="font-semibold text-white capitalize text-base">
                        {role}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {getRoleDescription(role)}
                    </p>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Warning */}
          {selectedRole === "admin" && user.role !== "admin" && (
            <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-500/40 rounded-xl p-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-3 text-red-300 text-sm mb-2">
                <div className="p-1 rounded-full bg-red-500/20">
                  <Shield className="h-4 w-4" />
                </div>
                <span className="font-semibold">Warning:</span>
              </div>
              <p className="text-red-200 text-sm leading-relaxed">
                Granting admin access will give this user full system
                permissions including user management capabilities.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 border border-gray-600/30 text-gray-300 hover:from-gray-600/60 hover:to-gray-500/60 hover:border-gray-500/50 hover:text-white transition-all duration-300 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || selectedRole === user.role}
            className="bg-gradient-to-r from-secondary/80 to-secondary/60 hover:from-secondary/90 hover:to-secondary/70 text-white border-0 rounded-xl shadow-lg hover:shadow-secondary/25 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Updating...
              </div>
            ) : (
              "Update Role"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleChangeDialog;
