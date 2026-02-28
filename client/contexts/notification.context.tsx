"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback
} from "react";
import { AppNotification } from "@/types";
import {
    getNotifications,
    getUnreadNotificationCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    clearAllNotifications
} from "@/features/notifications/notifications.api";
import { useAuth } from "./auth.context";
import { useChat } from "./chat.context";

interface NotificationContextType {
    notifications: AppNotification[];
    unreadCount: number;
    loading: boolean;
    hasMore: boolean;
    refreshNotifications: () => Promise<void>;
    loadMore: () => Promise<void>;
    markAllRead: () => Promise<void>;
    markOneRead: (notificationId: string) => Promise<void>;
    clearAll: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const { isLoggedIn, isLoading: authLoading } = useAuth();
    const { socket } = useChat();
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);

    // Initial fetch
    const refreshNotifications = useCallback(async () => {
        if (!isLoggedIn) return;
        try {
            setLoading(true);
            const [data, count] = await Promise.all([
                getNotifications(1, 30),
                getUnreadNotificationCount()
            ]);
            setNotifications(data.notifications);
            setHasMore(data.hasMore);
            setPage(1);
            setUnreadCount(count);
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn]);

    // Load more (pagination)
    const loadMore = useCallback(async () => {
        if (!hasMore) return;
        const nextPage = page + 1;
        try {
            const data = await getNotifications(nextPage, 30);
            setNotifications((prev) => [...prev, ...data.notifications]);
            setHasMore(data.hasMore);
            setPage(nextPage);
        } catch {
            // silent
        }
    }, [hasMore, page]);

    // Mark all as read
    const markAllRead = useCallback(async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, is_read: true }))
            );
            setUnreadCount(0);
        } catch {
            // silent
        }
    }, []);

    // Mark single as read
    const markOneRead = useCallback(async (notificationId: string) => {
        try {
            await markNotificationAsRead(notificationId);
            setNotifications((prev) =>
                prev.map((n) =>
                    n._id === notificationId ? { ...n, is_read: true } : n
                )
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch {
            // silent
        }
    }, []);

    // Clear all
    const clearAll = useCallback(async () => {
        try {
            await clearAllNotifications();
            setNotifications([]);
            setUnreadCount(0);
        } catch {
            // silent
        }
    }, []);

    // Fetch on mount when auth is ready
    useEffect(() => {
        if (!authLoading && isLoggedIn) {
            refreshNotifications();
        }
    }, [authLoading, isLoggedIn, refreshNotifications]);

    // Socket listeners for real-time notifications
    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (data: {
            notification: AppNotification;
            unreadCount: number;
        }) => {
            setNotifications((prev) => [data.notification, ...prev]);
            setUnreadCount(data.unreadCount);
        };

        const handleCountUpdate = (data: { unreadCount: number }) => {
            setUnreadCount(data.unreadCount);
        };

        socket.on("notification:new", handleNewNotification);
        socket.on("notification:count", handleCountUpdate);

        return () => {
            socket.off("notification:new", handleNewNotification);
            socket.off("notification:count", handleCountUpdate);
        };
    }, [socket]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,
                hasMore,
                refreshNotifications,
                loadMore,
                markAllRead,
                markOneRead,
                clearAll
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
