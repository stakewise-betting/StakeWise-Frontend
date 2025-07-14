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
      <DialogContent className="sm:max-w-[425px] bg-card border border-gray-700/60">
        <DialogHeader>
          <DialogTitle className="text-dark-primary flex items-center gap-2">
            <UserCog className="h-5 w-5 text-secondary" />
            Change User Role
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/40">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-sm font-medium text-dark-primary">
                {user.fname || user.lname
                  ? `${user.fname || ""} ${user.lname || ""}`.trim()
                  : user.username || "N/A"}
              </div>
              <Badge variant="outline" className="text-xs">
                {user.email || user.walletAddress || "N/A"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-dark-secondary">Current Role:</span>
              <Badge
                variant={user.role === "admin" ? "destructive" : user.role === "moderator" ? "secondary" : "outline"}
                className="capitalize flex items-center gap-1"
              >
                {getRoleIcon(user.role)}
                {user.role}
              </Badge>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-dark-primary font-medium">Select New Role:</Label>
            <RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
              {["user", "admin"].map((role) => (
                <div key={role} className="flex items-center space-x-3 p-3 border border-gray-700/40 rounded-lg hover:bg-gray-800/20 transition-colors">
                  <RadioGroupItem value={role} id={role} />
                  <Label
                    htmlFor={role}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={getRoleColor(role)}>
                        {getRoleIcon(role)}
                      </span>
                      <span className="font-medium text-dark-primary capitalize">
                        {role}
                      </span>
                    </div>
                    <p className="text-sm text-dark-secondary">
                      {getRoleDescription(role)}
                    </p>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Warning */}
          {selectedRole === "admin" && user.role !== "admin" && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Warning:</span>
              </div>
              <p className="text-red-300 text-sm mt-1">
                Granting admin access will give this user full system permissions.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-gray-600 text-dark-secondary hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || selectedRole === user.role}
            className="bg-secondary hover:bg-secondary/80"
          >
            {isLoading ? "Updating..." : "Update Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleChangeDialog;