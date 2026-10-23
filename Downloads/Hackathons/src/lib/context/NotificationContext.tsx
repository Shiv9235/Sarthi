"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PatientNotification } from "../types";
import { StorageService } from "../data/storage";

interface NotificationContextType {
  notifications: PatientNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<PatientNotification[]>([]);

  const refresh = () => {
    setNotifications(StorageService.getNotifications());
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    StorageService.markNotificationAsRead(id);
    refresh();
  };

  const markAllAsRead = () => {
    StorageService.markAllNotificationsAsRead();
    refresh();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refreshNotifications: refresh,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
