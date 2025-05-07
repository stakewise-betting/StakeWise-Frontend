// src/components/RoleRoute.tsx
import { FC, useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AppContext } from "@/context/AppContext";

interface RoleRouteProps {
  allowedRoles: Array<"admin" | "user">;
}

const RoleRoute: FC<RoleRouteProps> = ({ allowedRoles }) => {
  const ctx = useContext(AppContext)!;
  const { isAuthLoading, isLoggedin, userData } = ctx;
  const location = useLocation();

  if (isAuthLoading) {
    return <p>Loading authentication…</p>;
  }

  // not logged in → redirect to login
  if (!isLoggedin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // logged in but data has not arrived? (should be unlikely now, but for safety)
  if (isLoggedin && !userData) {
    return <p>Loading user profile…</p>;
  }

  // role mismatch → unauthorized
  if (userData && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Outlet />;
};

export default RoleRoute;
