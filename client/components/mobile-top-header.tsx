"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Mail, MessageCircle } from "lucide-react";
import { useNotifications } from "@/contexts";
import { useChat } from "@/contexts/chat.context";
import { cn } from "@/lib/utils";

export function MobileTopHeader() {
    const pathname = usePathname();

    let unreadTotal = 0;
    let notifUnread = 0;
    try {
        const chat = useChat();
        unreadTotal = chat.unreadTotal;
    } catch {
        // ChatProvider might not be available
    }
    try {
        const notif = useNotifications();
        notifUnread = notif.unreadCount;
    } catch {
        // NotificationProvider might not be available
    }

    // Only show on home page - other pages have their own headers
    const showOnPages = ["/", "/home"];
    const shouldShow = showOnPages.includes(pathname);
    if (!shouldShow) return null;

    return (
        <header className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
            <div className="flex items-center justify-between px-4 py-2.5">
                {/* App Logo + Name */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold">SociaaNet</span>
                </Link>

                {/* Action Icons */}
                <div className="flex items-center gap-1">
                    {/* Notifications */}
                    <Link
                        href="/notifications"
                        className={cn(
                            "relative p-2 rounded-full transition-colors",
                            pathname === "/notifications"
                                ? "text-primary"
                                : "text-foreground hover:bg-muted"
                        )}
                    >
                        <Bell className="w-6 h-6" />
                        {notifUnread > 0 && (
                            <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1 leading-none">
                                {notifUnread > 99 ? "99+" : notifUnread}
                            </span>
                        )}
                    </Link>

                    {/* Inbox */}
                    <Link
                        href="/inbox"
                        className={cn(
                            "relative p-2 rounded-full transition-colors",
                            pathname === "/inbox"
                                ? "text-primary"
                                : "text-foreground hover:bg-muted"
                        )}
                    >
                        <Mail className="w-6 h-6" />
                        {unreadTotal > 0 && (
                            <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1 leading-none">
                                {unreadTotal > 99 ? "99+" : unreadTotal}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}
