// StakeWise-Frontend/src/context/AppContext.tsx
import React, { createContext, useEffect, useState, ReactNode } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// Define UserData type
export interface UserData {
  id: string;
  fname: string;
  lname: string;
  username: string;
  email: string;
  authProvider: string;
  isAccountVerified: boolean;
  walletAddress: string;
  gender: string;
  avatarSrc: string;
  phone: string;
  birthday: string;
  country: string;
  picture: string;
  language: string;
  isActive: boolean;
  role: "admin" | "user";
}

// Define context type
export interface AppContextType {
  backendUrl: string;
  isLoggedin: boolean;
  isAuthLoading: boolean;
  setIsLoggedin: (value: boolean) => void;
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  getUserData: () => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;

  const [isLoggedin, setIsLoggedin] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Fetch user data after successful auth check
  const getUserData = async (): Promise<void> => {
    try {
      console.log("Fetching user data...");
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
      });
      console.log("User data:", data);
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
        setUserData(null);
      }
    } catch (error: any) {
      console.error("API Error:", error.response?.status, error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to fetch user data"
      );
      setUserData(null);
    }
  };

  // Check authentication state on mount
  const getAuthState = async (): Promise<void> => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/auth/isAuthenticated`,
        {
          withCredentials: true,
        }
      );

      console.log("Auth State:", data);
      setIsLoggedin(data.success);

      if (data.success) {
        await getUserData();
      }
    } catch (error: any) {
      console.error("Auth check failed:", error.response?.data);
      setIsLoggedin(false);
      setUserData(null);
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value: AppContextType = {
    backendUrl,
    isLoggedin,
    isAuthLoading,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};
