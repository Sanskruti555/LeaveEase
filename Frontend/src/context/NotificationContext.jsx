import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { notificationApi } from "../api/notification.api";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    // Added an isBackgroundPoll parameter defaulting to false
    const fetchNotifications = useCallback(async (isBackgroundPoll = false) => {
        if (!isAuthenticated) {
            setNotifications([]);
            return;
        }

        try {
            // Only trigger the loading state if it's a manual or initial fetch
            if (!isBackgroundPoll) {
                setLoading(true);
            }
            
            const response = await notificationApi.getNotifications();
            if (response.success && Array.isArray(response.data)) {
                setNotifications(response.data);
            }
        } catch (error) {
            console.error("Failed to load notifications:", error);
        } finally {
            if (!isBackgroundPoll) {
                setLoading(false);
            }
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            // Initial load (shows spinner)
            fetchNotifications(false);
            
            // Background polling every 60 seconds (invisible to user)
            const interval = setInterval(() => {
                fetchNotifications(true);
            }, 60000);
            
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, fetchNotifications]);

    const markAsRead = async (notificationId) => {
        try {
            // Optimistic update
            setNotifications((prev) =>
                prev.map((item) =>
                    // Ensure this 1 matches your DB structure (or change to 'true' if expecting a boolean)
                    item.notification_id === notificationId ? { ...item, is_read: 1 } : item
                )
            );
            await notificationApi.markNotificationAsRead(notificationId);
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
            // Refetch to sync state (passed 'true' so it happens silently in the background)
            fetchNotifications(true);
        }
    };

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    const value = {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
};