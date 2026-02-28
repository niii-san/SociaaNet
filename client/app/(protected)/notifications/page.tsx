"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/contexts";
import { AppNotification } from "@/types";
import {
    Bell,
    Heart,
    MessageCircle,
    UserPlus,
    UserCheck,
    Repeat2,
    AtSign,
    Loader2,
    CheckCheck,
    Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePageTitle } from "@/hooks/usePageTitle";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

function getNotificationIcon(type: AppNotification["type"]) {
    switch (type) {
        case "follow":
        case "follow_request":
            return <UserPlus className="w-5 h-5 text-blue-500" />;
        case "follow_request_accepted":
            return <UserCheck className="w-5 h-5 text-green-500" />;
        case "like_post":
        case "like_reel":
        case "like_comment":
            return <Heart className="w-5 h-5 text-red-500" />;
        case "comment_post":
        case "comment_reel":
        case "reply_comment":
            return <MessageCircle className="w-5 h-5 text-primary" />;
        case "repost_post":
        case "repost_reel":
            return <Repeat2 className="w-5 h-5 text-green-500" />;
        case "mention":
            return <AtSign className="w-5 h-5 text-purple-500" />;
        default:
            return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
}

function getNotificationText(notification: AppNotification): string {
    switch (notification.type) {
        case "follow":
            return "started following you";
        case "follow_request":
            return "requested to follow you";
        case "follow_request_accepted":
            return "accepted your follow request";
        case "like_post":
            return "liked your post";
        case "like_reel":
            return "liked your reel";
        case "like_comment":
            return "liked your comment";
        case "comment_post":
            return "commented on your post";
        case "comment_reel":
            return "commented on your reel";
        case "reply_comment":
            return "replied to your comment";
        case "repost_post":
            return "reposted your post";
        case "repost_reel":
            return "reposted your reel";
        case "mention":
            return "mentioned you";
        default:
            return "interacted with you";
    }
}

function getNotificationLink(notification: AppNotification): string | null {
    switch (notification.type) {
        case "follow":
        case "follow_request":
        case "follow_request_accepted":
            return `/u/${notification.sender.username}`;
        case "like_post":
        case "comment_post":
        case "repost_post":
            return notification.target_id
                ? `/posts/${notification.target_id}`
                : null;
        case "like_reel":
        case "comment_reel":
        case "repost_reel":
            return notification.target_id
                ? `/reels/${notification.target_id}`
                : null;
        case "reply_comment":
        case "like_comment":
            if (notification.target_id && notification.target_type) {
                return notification.target_type === "post"
                    ? `/posts/${notification.target_id}`
                    : `/reels/${notification.target_id}`;
            }
            return null;
        case "mention":
            if (notification.target_id && notification.target_type) {
                return notification.target_type === "post"
                    ? `/posts/${notification.target_id}`
                    : `/reels/${notification.target_id}`;
            }
            return null;
        default:
            return null;
    }
}

function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w`;
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
}

function NotificationItem({
    notification,
    onClick
}: {
    notification: AppNotification;
    onClick: () => void;
}) {
    const text = getNotificationText(notification);
    const icon = getNotificationIcon(notification.type);
    const time = timeAgo(notification.created_at);

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                !notification.is_read && "bg-primary/5"
            )}
        >
            {/* Sender avatar */}
            <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full bg-muted overflow-hidden">
                    {notification.sender.avatar_url ? (
                        <img
                            src={notification.sender.avatar_url}
                            alt={notification.sender.full_name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-sm font-bold">
                            {notification.sender.full_name
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                    )}
                </div>
                {/* Icon badge */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-background flex items-center justify-center border border-border">
                    {icon}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug">
                    <span className="font-semibold">
                        {notification.sender.username}
                    </span>{" "}
                    {text}
                </p>
                {notification.content && (
                    <p className="text-sm text-muted-foreground mt-0.5 truncate">
                        {notification.content}
                    </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">{time}</p>
            </div>

            {/* Unread indicator */}
            {!notification.is_read && (
                <div className="shrink-0 mt-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                </div>
            )}
        </button>
    );
}

export default function NotificationsPage() {
    const router = useRouter();
    const {
        notifications,
        unreadCount,
        loading,
        hasMore,
        loadMore,
        markAllRead,
        markOneRead,
        clearAll
    } = useNotifications();

    const observerRef = useRef<HTMLDivElement>(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    usePageTitle("Notifications");

    // Mark all as read when page is opened
    useEffect(() => {
        if (unreadCount > 0) {
            markAllRead();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Infinite scroll
    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasMore) {
                loadMore();
            }
        },
        [hasMore, loadMore]
    );

    useEffect(() => {
        const target = observerRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(handleObserver, {
            threshold: 0.1
        });
        observer.observe(target);

        return () => observer.disconnect();
    }, [handleObserver]);

    const handleNotificationClick = (notification: AppNotification) => {
        if (!notification.is_read) {
            markOneRead(notification._id);
        }
        const link = getNotificationLink(notification);
        if (link) {
            router.push(link);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Bell className="w-6 h-6 text-primary" />
                        <h1 className="text-xl font-bold">Notifications</h1>
                    </div>
                    {notifications.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={markAllRead}
                                className="text-xs gap-1.5"
                            >
                                <CheckCheck className="w-4 h-4" />
                                Mark all read
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowClearConfirm(true)}
                                className="text-xs gap-1.5 text-destructive hover:text-destructive"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear all
                            </Button>
                        </div>
                    )}
                </div>
            </header>

            {/* Notification list */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-20">
                    <Bell className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                        No notifications yet
                    </h3>
                    <p className="text-muted-foreground text-sm">
                        When someone interacts with you, you&apos;ll see it
                        here.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-border">
                    {notifications.map((notification) => (
                        <NotificationItem
                            key={notification._id}
                            notification={notification}
                            onClick={() =>
                                handleNotificationClick(notification)
                            }
                        />
                    ))}

                    {/* Infinite scroll trigger */}
                    <div ref={observerRef} className="py-4 text-center">
                        {hasMore && (
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mx-auto" />
                        )}
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={showClearConfirm}
                onOpenChange={setShowClearConfirm}
                title="Clear all notifications?"
                description="This will permanently remove all your notifications. This action cannot be undone."
                confirmLabel="Clear all"
                variant="destructive"
                onConfirm={() => { clearAll(); setShowClearConfirm(false); }}
            />
        </div>
    );
}
