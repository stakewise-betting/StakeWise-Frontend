import { createContext, useEffect, useState, ReactNode } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// Define UserData type
interface UserData {
  id: string;
  name: string;
  email: string;
  isAccountVerified: boolean;
  walletAddress: string;
  picture: string;
}

// Define context type
interface AppContextType {
  backendUrl: string;
  isLoggedin: boolean;
  setIsLoggedin: (value: boolean) => void;
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  getUserData: () => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
  const [isLoggedin, setIsLoggedin] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const getUserData = async (): Promise<void> => {
    try {
      console.log("Fetching user data..."); // Debugging
      const { data } = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });
      console.log("User data:", data);
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error("API Error:", error.response?.status, error.response?.data); // Debugging
      toast.error(error.response?.data?.message || "Failed to fetch user data");
    }
  };
  

  const getAuthState = async (): Promise<void> => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/isAuthenticated`, {
        withCredentials: true,
      });
  
      console.log("Auth State:", data); // Debugging log
      setIsLoggedin(data.success);
  
      if (data.success) {
        await getUserData();
      } else {
        console.warn("User is not authenticated, skipping getUserData()");
      }
    } catch (error: any) {
      setIsLoggedin(false);
      toast.error(error.response?.data?.message || "Failed to check auth state");
    }
  };
  
  useEffect(() => {
    getAuthState();
  }, []); 

  const value: AppContextType = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
