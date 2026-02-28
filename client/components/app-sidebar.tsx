"use client";

import { Button } from "@/components/ui/button";
import { useAuth, useNotifications } from "@/contexts";
import { useChat } from "@/contexts/chat.context";
import {
    Bookmark,
    Home,
    Search,
    Bell,
    Mail,
    User,
    Settings,
    MessageCircle,
    MoreHorizontal,
    Clapperboard,
    PlusSquare,
    Film
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AppSidebar() {
    const { data: user } = useAuth();
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

    const navItems = [
        {
            icon: Home,
            label: "Home",
            href: "/home",
            active: pathname === "/home" || pathname === "/"
        },
        {
            icon: Search,
            label: "Explore",
            href: "/explore",
            active: pathname === "/explore"
        },
        {
            icon: Bell,
            label: "Notifications",
            href: "/notifications",
            active: pathname === "/notifications"
        },
        {
            icon: Mail,
            label: "Inbox",
            href: "/inbox",
            active: pathname === "/inbox"
        },
        {
            icon: Clapperboard,
            label: "Reels",
            href: "/reels",
            active: pathname === "/reels"
        }, // Replaced Bookmarks with Reels
        {
            icon: User,
            label: "Profile",
            href: `/u/${user?.username}`,
            active: pathname === `/u/${user?.username}`
        },
        {
            icon: Settings,
            label: "Settings",
            href: "/settings",
            active: pathname === "/settings"
        }
    ];

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 p-4 border-r border-border bg-background">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 px-3 py-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">SociaaNet</span>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-xl transition-colors relative",
                            item.active
                                ? "bg-primary/10 text-primary font-medium"
                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <item.icon
                            className={cn(
                                "w-5 h-5",
                                item.active && "text-primary"
                            )}
                        />
                        <span>{item.label}</span>
                        {item.label === "Notifications" && notifUnread > 0 && (
                            <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1.5">
                                {notifUnread > 99 ? "99+" : notifUnread}
                            </span>
                        )}
                        {item.label === "Inbox" && unreadTotal > 0 && (
                            <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1.5">
                                {unreadTotal > 99 ? "99+" : unreadTotal}
                            </span>
                        )}
                    </Link>
                ))}
            </nav>

            {/* Create Buttons */}
            <div className="space-y-2 mb-4">
                <Link href="/create-post">
                    <Button className="w-full h-11 rounded-xl text-base font-semibold shadow-lg shadow-primary/20 gap-2">
                        <PlusSquare className="w-5 h-5" />
                        Create Post
                    </Button>
                </Link>
                <Link href="/create-reel">
                    <Button variant="outline" className="w-full h-11 rounded-xl text-base font-semibold gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/50">
                        <Film className="w-5 h-5" />
                        Create Reel
                    </Button>
                </Link>
            </div>

            {/* User Profile */}
            {user && (
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer mt-auto border border-transparent hover:border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {user.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt={user.full_name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-5 h-5 text-primary" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                            {user.full_name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            @{user.username}
                        </p>
                    </div>
                    <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                </div>
            )}
        </aside>
    );
}
