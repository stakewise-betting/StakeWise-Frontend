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
  const { userData, backendUrl, isLoggedin } = context;

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
        className="text-dark-primary !w-8 !h-8 sm:!w-9 sm:!h-9 !p-2 hover:bg-secondary/20 hover:text-secondary transition-all duration-300 relative min-h-0 rounded-lg border border-transparent hover:border-secondary/30 hover:shadow-lg"
        onClick={() => setNotificationsOpen(!notificationsOpen)}
        aria-label="Toggle Notifications"
      >
        <Bell className="!w-5 !h-5 sm:!w-6 sm:!h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-secondary to-secondary/80 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg shadow-secondary/30 animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      {notificationsOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-card border border-gray-700/60 rounded-xl shadow-2xl shadow-black/50 mr-2 z-50 overflow-hidden">
          <div className="p-4 flex justify-between items-center border-b border-gray-700/60 bg-gradient-to-r from-secondary/5 to-transparent">
            <h3 className="font-bold text-lg text-dark-primary flex items-center gap-2">
              <Bell className="h-5 w-5 text-secondary" />
              Notifications
            </h3>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-secondary hover:text-secondary/80 font-medium transition-colors duration-200 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
            {notifications.length > 0 ? (
              <div className="p-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 flex items-start space-x-3 rounded-lg transition-all duration-200 mb-2 last:mb-0 ${
                      !n.read
                        ? "bg-secondary/10 border border-secondary/20 shadow-sm"
                        : "bg-primary/20 hover:bg-secondary/5"
                    } ${
                      n.eventId
                        ? "cursor-pointer hover:bg-secondary/10 hover:border-secondary/30 hover:shadow-md"
                        : "cursor-default"
                    }`}
                    onClick={() => handleNotificationClick(n)}
                    role={n.eventId ? "link" : "listitem"}
                    aria-label={`Notification: ${n.message}`}
                  >
                    {n.notificationImageURL && (
                      <div className="flex-shrink-0">
                        <img
                          src={n.notificationImageURL}
                          className="w-10 h-10 rounded-full border-2 border-gray-700/60 object-cover"
                          alt="Notification"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-dark-primary text-sm font-medium leading-relaxed">
                        {n.message}
                      </p>
                      {n.timestamp && (
                        <p className="text-dark-secondary text-xs mt-1">
                          {formatTimestamp(n.timestamp)}
                        </p>
                      )}
                    </div>
                    {!n.read && (
                      <div className="flex-shrink-0 mt-2">
                        <span className="w-2 h-2 bg-secondary rounded-full block shadow-sm"></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Bell className="h-8 w-8 text-secondary/50" />
                </div>
                <p className="text-dark-secondary text-base font-medium mb-2">
                  No notifications yet
                </p>
                <p className="text-dark-secondary/70 text-sm">
                  Stay tuned for updates and important announcements
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsBell;
