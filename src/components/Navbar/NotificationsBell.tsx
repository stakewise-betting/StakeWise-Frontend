// src/components/navbar/NotificationsBell.tsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaBell } from "react-icons/fa";
import { AppContext } from "@/context/AppContext"; // Adjust path as needed
import { Notification } from "./navbar.types"; // Import shared type
import { formatTimestamp } from "./navbar.utils"; // Import utility
import logo from "@/assets/images/logo.png"; // Adjust path as needed

const NotificationsBell: React.FC = () => {
  const context = useContext(AppContext);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Need context for user info and backend URL
  if (!context) {
    console.error("AppContext is null in NotificationsBell");
    return null; // Or some fallback UI
  }
  const { userData, backendUrl, isLoggedin } = context;

  // Close dropdown when clicking outside
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

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  // --- Fetch initial notifications ---
  const fetchNotifications = async () => {
    if (!isLoggedin || !userData?.id) {
      setNotifications([]);
      return;
    }
    try {
      const { data } = await axios.get<{ notifications: any[] }>(
        `${backendUrl}/api/notifications`,
        {
          withCredentials: true,
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
            "user-id": userData.id,
          },
        }
      );
      if (data.notifications && Array.isArray(data.notifications)) {
        const formattedNotifications = data.notifications
          .map((n: any) => ({
            id: n._id || `temp-${Date.now()}-${Math.random()}`,
            message: n.message || "Notification content missing.",
            notificationImageURL: n.image || n.notificationImageURL,
            timestamp: n.createdAt
              ? new Date(n.createdAt).getTime()
              : Date.now(),
            read: !!n.read,
          }))
          .sort((a, b) => b.timestamp - a.timestamp);
        setNotifications(formattedNotifications);
      } else {
        setNotifications([]);
      }
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      // Optionally show toast error
      setNotifications([]);
    }
  };

  // --- Mark all as read ---
  const markAllAsRead = async () => {
    // Optimistic UI update
    const previouslyUnreadIds = notifications
      .filter((n) => !n.read)
      .map((n) => n.id);
    if (previouslyUnreadIds.length === 0) return; // Nothing to mark

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    if (isLoggedin && userData?.id) {
      try {
        await axios.post(
          `${backendUrl}/api/notifications/read-all`,
          {},
          { withCredentials: true, headers: { "user-id": userData.id } }
        );
      } catch (error) {
        console.error("Error marking notifications as read on backend:", error);
        toast.error("Failed to sync read status with server.");
        // Revert optimistic update on failure
        setNotifications((prev) =>
          prev.map((n) =>
            previouslyUnreadIds.includes(n.id) ? { ...n, read: false } : n
          )
        );
        // Optional: re-fetch to be absolutely sure
        // fetchNotifications();
      }
    }
  };

  // Mark as read when panel opens
  useEffect(() => {
    if (notificationsOpen && unreadCount > 0) {
      // Delay slightly to allow user to see the unread state briefly?
      const timer = setTimeout(() => {
        markAllAsRead();
      }, 500); // 0.5 second delay
      return () => clearTimeout(timer);
    }
  }, [notificationsOpen, unreadCount]); // Re-run if panel opens or count changes

  // Fetch initial notifications on login/user change
  useEffect(() => {
    fetchNotifications();
  }, [isLoggedin, userData?.id, backendUrl]); // Added backendUrl dependency

  // --- WebSocket connection ---
  useEffect(() => {
    if (!isLoggedin || !userData?.id || !backendUrl) {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
      return;
    }
    if (ws.current && ws.current.readyState === WebSocket.OPEN) return;

    const websocketUrl =
      import.meta.env.VITE_WEBSOCKET_URL || backendUrl.replace(/^http/, "ws");
    const wsUrl = `${websocketUrl}?userId=${userData.id}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () =>
      console.log("WebSocket connected (Notifications)");
    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "notification" || message.type === "newEvent") {
          const newNotification: Notification = {
            id:
              message.id || message._id || `ws-${Date.now()}-${Math.random()}`,
            message:
              message.message ||
              message.notificationMessage ||
              "New notification.",
            notificationImageURL: message.image || message.notificationImageURL,
            read: false,
            timestamp: message.createdAt
              ? new Date(message.createdAt).getTime()
              : Date.now(),
          };
          setNotifications((prev) => {
            if (prev.some((n) => n.id === newNotification.id)) return prev;
            return [newNotification, ...prev];
          });
          toast.info(newNotification.message);
        }
      } catch (error) {
        console.error("Error processing WS message:", error);
      }
    };
    ws.current.onclose = (e) => {
      console.log("WebSocket disconnected (Notifications)", e.code);
      ws.current = null;
    };
    ws.current.onerror = (e) => {
      console.error("WebSocket error (Notifications):", e);
      ws.current = null;
    };

    return () => {
      if (ws.current) {
        ws.current.onclose = null;
        ws.current.onerror = null;
        ws.current.close();
        ws.current = null;
      }
    };
  }, [isLoggedin, userData?.id, backendUrl]); // Added backendUrl dependency

  // Render nothing if user not logged in
  if (!isLoggedin) {
    return null;
  }

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setNotificationsOpen(!notificationsOpen)}
        aria-label="Toggle Notifications"
        className="text-2xl text-gray-300 hover:text-white transition duration-200 relative"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-primary">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {notificationsOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
          {" "}
          {/* Ensure high z-index */}
          <div className="p-3 flex justify-between items-center border-b border-gray-700">
            <span className="font-semibold text-white">Notifications</span>
            {unreadCount > 0 && ( // Show only if there are unread messages
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  markAllAsRead();
                }}
                className="text-xs text-blue-400 hover:underline disabled:text-gray-500 disabled:no-underline"
                disabled={unreadCount === 0}
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 flex items-start space-x-3 transition-colors duration-150 border-b border-gray-700/50 ${
                    !n.read ? "bg-blue-900/20" : "hover:bg-gray-700/50"
                  }`}
                >
                  <div className="flex-shrink-0 w-8 h-8 mt-0.5">
                    {n.notificationImageURL ? (
                      <img
                        src={n.notificationImageURL}
                        className="w-full h-full rounded-full object-cover"
                        alt="" // Alt text can be empty for decorative images in notifications
                        onError={(e) => (e.currentTarget.src = logo)}
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gray-600 flex items-center justify-center">
                        <FaBell className="text-gray-300 text-sm" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-100 leading-snug">
                      {n.message}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {formatTimestamp(n.timestamp)}
                    </div>
                  </div>
                  {!n.read && (
                    <span
                      className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"
                      aria-label="Unread"
                    ></span>
                  )}
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-400 text-sm">
                You're all caught up!
              </div>
            )}
          </div>
          {/* Optional: View All link */}
          {/* <div className="p-2 text-center border-t border-gray-700">
            <Link to="/notifications" onClick={() => setNotificationsOpen(false)} className="text-sm text-blue-400 hover:underline">
                View All
            </Link>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default NotificationsBell;
