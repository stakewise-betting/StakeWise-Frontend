// src/components/RoleRoute.tsx
import { FC, useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import { Loader2, Shield, User } from "lucide-react";

interface RoleRouteProps {
  allowedRoles: Array<"admin" | "user">;
}

// Professional Loading Component
const LoadingScreen: FC<{ message: string; icon?: React.ReactNode }> = ({
  message,
  icon = <Loader2 className="h-8 w-8 animate-spin text-secondary" />,
}) => (
  <div className="min-h-screen bg-gradient-to-br from-[#0F0F15] via-[#1C1C27] to-[#0F0F15] flex items-center justify-center">
    <div className="bg-[#1C1C27] border border-gray-700/60 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
      <div className="flex flex-col items-center space-y-6">
        {/* Loading Animation */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center border border-gray-700/60 shadow-lg">
            {icon}
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full animate-pulse"></div>
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-dark-primary">{message}</h3>
          <p className="text-dark-secondary text-sm">
            Please wait while we verify your access...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700/60 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-secondary/60 to-secondary rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

const RoleRoute: FC<RoleRouteProps> = ({ allowedRoles }) => {
  const ctx = useContext(AppContext)!;
  const { isAuthLoading, isLoggedin, userData } = ctx;
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <LoadingScreen
        message="Authenticating"
        icon={<Shield className="h-8 w-8 animate-pulse text-secondary" />}
      />
    );
  }

  // not logged in → redirect to login
  if (!isLoggedin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // logged in but data has not arrived? (should be unlikely now, but for safety)
  if (isLoggedin && !userData) {
    return (
      <LoadingScreen
        message="Loading Profile"
        icon={<User className="h-8 w-8 animate-spin text-secondary" />}
      />
    );
  }

  // role mismatch → unauthorized
  if (userData && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
