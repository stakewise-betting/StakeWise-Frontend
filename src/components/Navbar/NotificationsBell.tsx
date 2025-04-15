// src/components/navbar/NotificationsBell.tsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaBell } from "react-icons/fa";
import { AppContext } from "@/context/AppContext";
import { Notification as NotificationType } from "./navbar.types"; // Renamed to avoid conflict
import { formatTimestamp } from "./navbar.utils";
import logo from "@/assets/images/logo.png";

const NotificationsBell: React.FC = () => {
  const context = useContext(AppContext);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  if (!context) {
    console.error("AppContext is null in NotificationsBell");
    return null;
  }
  const { userData, backendUrl, isLoggedin } = context;

  // --- Helper: Mark specific notifications as read on Backend ---
  const markBackendNotificationsAsRead = async (idsToMark: string[]) => {
    if (!isLoggedin || !userData?.id || idsToMark.length === 0) {
      return; // No user or nothing to mark
    }
    try {
      console.log(
        `Sending request to mark ${idsToMark.length} notifications as read:`,
        idsToMark
      );
      await axios.post(
        `${backendUrl}/api/notifications/read`, // Use the NEW endpoint
        { notificationIds: idsToMark }, // Send IDs in the body
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json", // Important for POST body
            "user-id": userData.id,
          },
          timeout: 8000, // Slightly shorter timeout?
        }
      );
      console.log("Successfully marked notifications as read on backend.");
    } catch (error) {
      console.error("Error marking notifications as read on backend:", error);
      toast.error("Failed to sync read status with server.");
      // Return error state to potentially handle rollback if needed
      return { error: true };
    }
    return { error: false };
  };

  // --- Fetch initial notifications ---
  const fetchNotifications = async () => {
    if (!isLoggedin || !userData?.id) {
      setNotifications([]);
      return;
    }
    console.log("Fetching notifications...");
    try {
      const { data } = await axios.get<{
        success: boolean;
        notifications: any[];
      }>(`${backendUrl}/api/notifications`, {
        withCredentials: true,
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          "user-id": userData.id,
        },
      });

      // Check success flag and data structure
      if (
        data.success &&
        data.notifications &&
        Array.isArray(data.notifications)
      ) {
        const formattedNotifications = data.notifications
          .map((n: any) => ({
            // Ensure mapping uses the fields returned by the modified backend
            id: n.id || n._id, // Use id field added in backend
            message: n.message || "Notification content missing.",
            notificationImageURL: n.notificationImageURL || n.image, // Use standardized name from backend processing
            timestamp: n.timestamp || Date.now(), // Use standardized timestamp from backend
            eventId: n.eventId || null,
            // *** Use the 'read' boolean directly from the backend ***
            read: !!n.read, // Backend now sends the correct boolean for the user
          }))
          .sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp
        console.log(
          "Fetched and formatted notifications:",
          formattedNotifications
        );
        setNotifications(formattedNotifications);
      } else {
        console.warn("Received empty or invalid notification data:", data);
        setNotifications([]);
      }
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      toast.error("Could not load notifications.");
      setNotifications([]);
    }
  };

  // --- Click Outside Handler ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Calculate Unread Count (derived state) ---
  // This depends purely on the local 'notifications' state
  const unreadCount = notifications.filter((n) => !n.read).length;

  // --- EFFECT: Mark As Read When Panel Opens ---
  useEffect(() => {
    // Only run when the panel is opened AND there are unread messages
    if (notificationsOpen && unreadCount > 0 && isLoggedin && userData?.id) {
      console.log(
        `Notification panel opened with ${unreadCount} unread messages. Marking them read.`
      );

      // 1. Identify unread notification IDs
      const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);

      if (unreadIds.length > 0) {
        // 2. Optimistic UI Update: Mark them as read locally immediately
        setNotifications((prevNotifications) =>
          prevNotifications.map((n) =>
            unreadIds.includes(n.id) ? { ...n, read: true } : n
          )
        );

        // 3. Call the backend to update the persistent state
        markBackendNotificationsAsRead(unreadIds).then((result) => {
          if (result?.error) {
            // 4. Rollback optimistic update on backend failure
            console.warn(
              "Backend update failed. Rolling back optimistic read status."
            );
            toast.info(
              "Could not sync read status. Unread messages may reappear on refresh."
            ); // Inform user gently
            setNotifications((prevNotifications) =>
              prevNotifications.map((n) =>
                unreadIds.includes(n.id) ? { ...n, read: false } : n
              )
            );
          } else {
            console.log("Backend confirmed read status update.");
          }
        });
      }
    }
    // Dependencies: open state, count (to trigger when it goes > 0), and user info for API call
  }, [notificationsOpen, unreadCount, isLoggedin, userData?.id, notifications]); // Added 'notifications' as dependency

  // --- EFFECT: Fetch initial notifications on login/user change ---
  useEffect(() => {
    fetchNotifications();
    // Clean up notifications if user logs out
    if (!isLoggedin) {
      setNotifications([]);
    }
  }, [isLoggedin, userData?.id, backendUrl]); // Keep backendUrl dependency

  // --- EFFECT: WebSocket connection ---
  useEffect(() => {
    if (!isLoggedin || !userData?.id || !backendUrl) {
      if (ws.current) {
        console.log("Closing WebSocket due to logout or missing info.");
        ws.current.close();
        ws.current = null;
      }
      return;
    }

    // Avoid reconnecting if already connected
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected.");
      return;
    }

    const websocketUrl = (
      import.meta.env.VITE_WEBSOCKET_URL || backendUrl.replace(/^http/, "ws")
    ).replace(/\/$/, ""); // Remove trailing slash if present
    const wsUrl = `${websocketUrl}?userId=${userData.id}`;
    console.log(`Attempting to connect WebSocket: ${wsUrl}`);

    try {
      ws.current = new WebSocket(wsUrl);
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      return; // Don't proceed if constructor fails
    }

    ws.current.onopen = () =>
      console.log("WebSocket connected (Notifications)");

    ws.current.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      try {
        const message = JSON.parse(event.data);
        // Check if it's a relevant notification type
        if (
          message.type === "notification" ||
          message.type === "newEvent" ||
          message.notificationMessage
        ) {
          const newNotification: Notification = {
            // Use backend ID if available, otherwise generate temporary one
            id:
              message.id || message._id || `ws-${Date.now()}-${Math.random()}`,
            message:
              message.message ||
              message.notificationMessage ||
              "New notification.",
            notificationImageURL: message.image || message.notificationImageURL,
            read: false, // New notifications are always unread
            timestamp: message.createdAt
              ? new Date(message.createdAt).getTime()
              : Date.now(),
            eventId: message.eventId || null,
          };
          console.log(
            "Processing new notification from WebSocket:",
            newNotification
          );
          setNotifications((prev) => {
            // Prevent duplicates just in case
            if (prev.some((n) => n.id === newNotification.id)) {
              console.log(
                "Duplicate notification ID detected from WS, skipping:",
                newNotification.id
              );
              return prev;
            }
            // Add new notification and re-sort
            return [newNotification, ...prev].sort(
              (a, b) => b.timestamp - a.timestamp
            );
          });
          // Show a toast for the new notification
          if (newNotification.message) {
            toast.info(newNotification.message);
          }
        } else {
          console.log("Received non-notification WS message:", message.type);
        }
      } catch (error) {
        console.error(
          "Error processing WS message:",
          error,
          "Raw data:",
          event.data
        );
      }
    };

    ws.current.onclose = (e) => {
      // Only log if it wasn't an intentional close (e.g., during cleanup)
      if (ws.current) {
        console.log(
          `WebSocket disconnected (Notifications) Code: ${e.code}, Reason: ${e.reason}`
        );
        ws.current = null;
        // Optional: Implement reconnection logic here if desired
      } else {
        console.log("WebSocket already cleaned up, ignoring close event.");
      }
    };

    ws.current.onerror = (e) => {
      console.error("WebSocket error (Notifications):", e);
      // Ensure cleanup happens on error too
      if (ws.current) {
        ws.current.close(); // Attempt to close if possible
        ws.current = null;
      }
    };

    // Cleanup function
    return () => {
      if (ws.current) {
        console.log("Cleaning up WebSocket connection.");
        // Remove handlers to prevent them firing during/after close
        ws.current.onopen = null;
        ws.current.onmessage = null;
        ws.current.onclose = null;
        ws.current.onerror = null;
        ws.current.close();
        ws.current = null;
      }
    };
  }, [isLoggedin, userData?.id, backendUrl]); // Dependencies for connection lifecycle

  // --- Render Logic ---
  if (!isLoggedin) {
    return null; // Don't render the bell if not logged in
  }

  const handleNotificationClick = (notification: NotificationType) => {
    if (notification.eventId) {
      navigate(`/bet/${notification.eventId}`);
      setNotificationsOpen(false); // Close dropdown after navigating
    }
    // No need to manually mark as read here, it happens when panel opens
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setNotificationsOpen(!notificationsOpen)}
        aria-label="Toggle Notifications"
        className="text-2xl text-gray-300 hover:text-white transition duration-200 relative"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-primary animate-pulse">
            {" "}
            {/* Added pulse animation */}
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {notificationsOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
          {" "}
          {/* Increased width slightly on larger screens */}
          <div className="p-3 flex justify-between items-center border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
            {" "}
            {/* Make header sticky */}
            <span className="font-semibold text-white">Notifications</span>
            {/* Removed the Mark all as read button */}
          </div>
          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 flex items-start space-x-3 transition-colors duration-150 border-b border-gray-700/50 ${
                    !n.read
                      ? "bg-gradient-to-r from-blue-900/30 to-gray-800"
                      : "hover:bg-gray-700/50" // Enhanced unread style
                  } ${n.eventId ? "cursor-pointer" : "cursor-default"}`}
                  onClick={() => handleNotificationClick(n)}
                  role={n.eventId ? "link" : "listitem"} // Add role for accessibility
                  aria-label={`Notification: ${n.message}`}
                >
                  <div className="flex-shrink-0 w-8 h-8 mt-0.5">
                    {n.notificationImageURL ? (
                      <img
                        src={n.notificationImageURL}
                        className="w-full h-full rounded-full object-cover border border-gray-600" // Added subtle border
                        alt="" // Alt text intentionally empty for decorative notification images
                        onError={(e) => {
                          e.currentTarget.onerror = null; // Prevent infinite loop if logo also fails
                          e.currentTarget.src = logo;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gray-600 flex items-center justify-center">
                        <FaBell className="text-gray-300 text-sm" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-100 leading-snug mb-0.5">
                      {" "}
                      {/* Use <p> for semantics */}
                      {n.message}
                    </p>
                    <div className="text-xs text-gray-400 mt-1">
                      {formatTimestamp(n.timestamp)}
                    </div>
                  </div>
                  {!n.read && (
                    <span
                      className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5 ml-2 animate-fade-in" // Added fade-in and margin
                      aria-label="Unread"
                      title="Unread" // Tooltip for clarity
                    ></span>
                  )}
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-400 text-sm">
                You're all caught up! No new notifications.
              </div>
            )}
          </div>
          {/* Optional Footer (e.g., link to settings) */}
          {/* <div className="p-2 text-center border-t border-gray-700">
            <Link to="/settings/notifications" onClick={() => setNotificationsOpen(false)} className="text-sm text-blue-400 hover:underline">
                Notification Settings
            </Link>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default NotificationsBell;

// Add these simple animations to your global CSS or Tailwind config if needed:
/*
@keyframes pulse {
  50% {
    opacity: .7;
    transform: scale(1.1);
  }
}
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
*/

// Ensure your navbar.types.ts matches:
// src/components/navbar/navbar.types.ts (Example)
export interface Notification {
  id: string;
  message: string;
  notificationImageURL?: string | null; // Optional image
  timestamp: number; // Unix timestamp (ms)
  eventId?: number | string | null; // Can be number or string, optional
  read: boolean; // Simple boolean
}
