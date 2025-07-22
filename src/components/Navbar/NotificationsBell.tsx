// src/components/navbar/NotificationsBell.tsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Bell } from "lucide-react";
import { AppContext } from "@/context/AppContext";
import { Notification as NotificationType } from "./navbar.types";
import { formatTimestamp } from "./navbar.utils";
import { Button } from "@/components/ui/button";

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

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "https://stakewisebackend.onrender.com";
  const { userData, isLoggedin } = context;

  // --- Helper: Mark specific notifications as read on Backend ---
  const markBackendNotificationsAsRead = async (idsToMark: string[]) => {
    if (!isLoggedin || !userData?.id || idsToMark.length === 0) {
      return;
    }
    try {
      console.log(
        `Sending request to mark ${idsToMark.length} notifications as read:`,
        idsToMark
      );
      await axios.post(
        `${backendUrl}/api/notifications/read`,
        { notificationIds: idsToMark },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "user-id": userData.id,
          },
          timeout: 8000,
        }
      );
      console.log("Successfully marked notifications as read on backend.");
    } catch (error) {
      console.error("Error marking notifications as read on backend:", error);
      toast.error("Failed to sync read status with server.");
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

      if (
        data.success &&
        data.notifications &&
        Array.isArray(data.notifications)
      ) {
        const formattedNotifications = data.notifications
          .map((n: any) => ({
            id: n.id || n._id,
            message: n.message || "Notification content missing.",
            notificationImageURL: n.notificationImageURL || n.image,
            timestamp: n.timestamp || Date.now(),
            eventId: n.eventId || null,
            read: !!n.read,
          }))
          .sort((a, b) => b.timestamp - a.timestamp);

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
  const unreadCount = notifications.filter((n) => !n.read).length;

  // --- EFFECT: Mark As Read When Panel Opens ---
  useEffect(() => {
    if (notificationsOpen && unreadCount > 0 && isLoggedin && userData?.id) {
      const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);

      if (unreadIds.length > 0) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((n) =>
            unreadIds.includes(n.id) ? { ...n, read: true } : n
          )
        );

        markBackendNotificationsAsRead(unreadIds).then((result) => {
          if (result?.error) {
            console.warn(
              "Backend update failed. Rolling back optimistic read status."
            );
            toast.info(
              "Could not sync read status. Unread messages may reappear on refresh."
            );
            setNotifications((prevNotifications) =>
              prevNotifications.map((n) =>
                unreadIds.includes(n.id) ? { ...n, read: false } : n
              )
            );
          }
        });
      }
    }
  }, [notificationsOpen, unreadCount, isLoggedin, userData?.id, notifications]);

  // --- EFFECT: Fetch initial notifications on login/user change ---
  useEffect(() => {
    fetchNotifications();
    if (!isLoggedin) {
      setNotifications([]);
    }
  }, [isLoggedin, userData?.id, backendUrl]);

  // --- EFFECT: WebSocket connection ---
  useEffect(() => {
    if (!isLoggedin || !userData?.id || !backendUrl) {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
      return;
    }

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      return;
    }

    const websocketUrl = (
      import.meta.env.VITE_WEBSOCKET_URL || backendUrl.replace(/^http/, "ws")
    ).replace(/\/$/, "");
    const wsUrl = `${websocketUrl}?userId=${userData.id}`;

    try {
      ws.current = new WebSocket(wsUrl);
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      return;
    }

    ws.current.onopen = () =>
      console.log("WebSocket connected (Notifications)");

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (
          message.type === "notification" ||
          message.type === "newEvent" ||
          message.notificationMessage
        ) {
          const newNotification: NotificationType = {
            // Corrected type here to NotificationType
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
            eventId: message.eventId || null,
          };

          setNotifications((prev) => {
            if (prev.some((n) => n.id === newNotification.id)) {
              return prev;
            }
            return [newNotification, ...prev].sort(
              (a, b) => b.timestamp - a.timestamp
            );
          });
          if (newNotification.message) {
            toast.info(newNotification.message);
          }
        } else {
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
      if (ws.current) {
        ws.current = null;
      } else {
      }
    };

    ws.current.onerror = (e) => {
      console.error("WebSocket error (Notifications):", e);
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };

    return () => {
      if (ws.current) {
        ws.current.onopen = null;
        ws.current.onmessage = null;
        ws.current.onclose = null;
        ws.current.onerror = null;
        ws.current.close();
        ws.current = null;
      }
    };
  }, [isLoggedin, userData?.id, backendUrl]);

  if (!isLoggedin) {
    return null;
  }

  const handleNotificationClick = (notification: NotificationType) => {
    if (notification.eventId) {
      navigate(`/bet/${notification.eventId}`);
      setNotificationsOpen(false);
    }
  };

  // Function to mark all notifications as read - Implemented here - Fixes error 10
  const markAllAsRead = () => {
    if (unreadCount === 0) return; // No unread notifications

    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    // Optimistic update
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) => ({ ...n, read: true }))
    );

    markBackendNotificationsAsRead(unreadIds).then((result) => {
      if (result?.error) {
        // Rollback on failure
        setNotifications((prevNotifications) =>
          prevNotifications.map((n) => ({ ...n, read: false }))
        );
        toast.info("Failed to sync read status. Please refresh.");
      }
    });
  };

  return (
    <div className="relative" ref={notificationRef}>
      <Button
        variant="ghost"
        size="icon"
        className="text-[#ffffff] !w-8 !h-8 !p-2 hover:bg-gray-700 transition relative min-h-0 " // Added min-h-0 h-auto, fixed button style - Fixes error 09
        onClick={() => setNotificationsOpen(!notificationsOpen)}
        aria-label="Toggle Notifications"
      >
        <Bell className="!w-6 !h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#209de6] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {notificationsOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-[#1C1C27] border border-[#8488AC] rounded-lg shadow-xl">
          <div className="p-3 flex justify-between items-center border-b border-[#8488AC]">
            <span className="font-bold text-lg text-white">Notifications</span>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-orange-500 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-60 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-2 flex items-center space-x-3 hover:bg-gray-800 ${
                    !n.read ? "bg-gray-800/50" : ""
                  } ${n.eventId ? "cursor-pointer" : "cursor-default"}`}
                  onClick={() => handleNotificationClick(n)}
                  role={n.eventId ? "link" : "listitem"}
                  aria-label={`Notification: ${n.message}`}
                >
                  {n.notificationImageURL && (
                    <img
                      src={n.notificationImageURL}
                      className="w-8 h-8 rounded-full"
                      alt="Notification"
                    />
                  )}
                  <span className="text-white text-sm">{n.message}</span>
                  {!n.read && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full ml-auto"></span>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsBell;
