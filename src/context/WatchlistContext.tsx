import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { AppContext } from "./AppContext";

// Define types
interface WatchlistEvent {
  _id: string;
  eventId: number;
  name: string;
  imageURL: string;
  options: string[];
  endTime: string;
  startTime: string;
  description?: string;
  category?: string;
  createdAt?: string;
}

// Structure of the context (functions and states exposed)
interface WatchlistContextType {
  watchlistEvents: WatchlistEvent[];
  isLoading: boolean;
  error: string | null;
  addToWatchlist: (eventId: number) => Promise<boolean>;
  removeFromWatchlist: (eventId: number) => Promise<boolean>;
  checkInWatchlist: (eventId: number) => Promise<boolean>;
  refreshWatchlist: () => Promise<void>;
}

// Create context
export const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

// Provider component
interface WatchlistProviderProps {
  children: ReactNode;
}

export const WatchlistProvider: React.FC<WatchlistProviderProps> = ({ children }) => {
  // State for storing watchlist events
  const [watchlistEvents, setWatchlistEvents] = useState<WatchlistEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get backend URL and auth state from AppContext
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("WatchlistProvider must be used within AppContextProvider");
  }
  
  const { backendUrl, isLoggedin } = appContext;
  
  // Fetch user's watchlist
  /**
 * Fetches the user's watchlist events from the backend API.
 * 
 * This function retrieves watchlist events for the currently logged-in user.
 * It handles authentication checks, loading states, and error handling.
 * 
 * @async
 * @function fetchWatchlist
 * @returns {Promise<void>} Does not return a value, but updates state variables.
 * 
 * @throws {Error} If the API request fails or returns an error response.
 * 
 * @example
 * // Call the function to fetch watchlist
 * await fetchWatchlist();
 * 
 * @remarks
 * - Sets {@link isLoading} state to true during the API call and false afterward.
 * - Updates {@link watchlistEvents} state with fetched data on success.
 * - Sets {@link error} state with an error message if the operation fails.
 * - Requires user to be logged in (checks {@link isLoggedin} state).
 * - Uses credentials for authorization with the backend.
 */
  const fetchWatchlist = async () => {
    // Clear previous errors
    setError(null);
    
    // If not logged in, reset and exit
    if (!isLoggedin) {
      setIsLoading(false);
      setWatchlistEvents([]);
      setError("Please log in to view your watchlist");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data } = await axios.get(`${backendUrl}/api/watchlist`, {
        withCredentials: true
      });
      
      if (data.success) {
        setWatchlistEvents(data.watchlistEvents);
      } else {
        setError(data.message || "Failed to fetch watchlist");
      }
    } catch (err: any) {
      console.error("Error fetching watchlist:", err);
      setError(err.response?.data?.message || "Failed to fetch watchlist");
    } finally {
      setIsLoading(false);
    }
  };

  // Add event to watchlist
  const addToWatchlist = async (eventId: number): Promise<boolean> => {
    if (!isLoggedin) {
      setError("Please log in to add to watchlist");
      return false;
    }
    
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/watchlist/add`,
        { eventId },
        { withCredentials: true }
      );
      
      if (data.success) {
        // Refresh watchlist to get updated data
        await fetchWatchlist();
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Error adding to watchlist:", err);
      setError(err.response?.data?.message || "Failed to add to watchlist");
      return false;
    }
  };

  // Remove event from watchlist
  const removeFromWatchlist = async (eventId: number): Promise<boolean> => {
    if (!isLoggedin) {
      setError("Please log in to remove from watchlist");
      return false;
    }
    
    try {
      const { data } = await axios.delete(`${backendUrl}/api/watchlist/remove/${eventId}`, {
        withCredentials: true
      });
      
      if (data.success) {
        // Update local state instead of re-fetching
        setWatchlistEvents(prev => prev.filter(event => event.eventId !== eventId));
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Error removing from watchlist:", err);
      setError(err.response?.data?.message || "Failed to remove from watchlist");
      return false;
    }
  };

  // Check if event is in watchlist
  const checkInWatchlist = async (eventId: number): Promise<boolean> => {
    if (!isLoggedin) {
      return false;
    }
    
    try {
      const { data } = await axios.get(`${backendUrl}/api/watchlist/check/${eventId}`, {
        withCredentials: true
      });
      
      return data.success && data.isInWatchlist;
    } catch (err) {
      console.error("Error checking watchlist status:", err);
      return false;
    }
  };

  // Public method to refresh watchlist
  const refreshWatchlist = async (): Promise<void> => {
    await fetchWatchlist();
  };

  // Fetch watchlist when login state changes
  useEffect(() => {
    fetchWatchlist();
  }, [isLoggedin]);

  // Context value
  const value: WatchlistContextType = {
    watchlistEvents,
    isLoading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    checkInWatchlist,
    refreshWatchlist
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

// Custom hook for easier context use
export const useWatchlist = (): WatchlistContextType => {
  const context = useContext(WatchlistContext);
  
  if (context === undefined) {
    throw new Error("useWatchlist must be used within WatchlistProvider");
  }
  
  return context;
};