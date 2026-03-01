"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusSquare, Clapperboard, User } from "lucide-react";
import { useAuth } from "@/contexts";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
    const pathname = usePathname();
    const { data: user } = useAuth();

    // Don't show on certain pages
    const hideOnPages = ["/inbox/", "/reels"];
    const shouldHide = hideOnPages.some((p) => pathname.startsWith(p));
    if (shouldHide) return null;

    const navItems = [
        {
            icon: Home,
            href: "/",
            label: "Home",
            active: pathname === "/" || pathname === "/home",
        },
        {
            icon: Search,
            href: "/explore",
            label: "Explore",
            active: pathname === "/explore",
        },
        {
            icon: PlusSquare,
            href: "/create-post",
            label: "Create",
            active: pathname === "/create-post",
        },
        {
            icon: Clapperboard,
            href: "/reels",
            label: "Reels",
            active: pathname === "/reels",
        },
        {
            icon: User,
            href: `/u/${user?.username}`,
            label: "Profile",
            active: pathname === `/u/${user?.username}`,
        },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border px-2 pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center justify-around">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center gap-0.5 py-2 px-3 relative transition-colors",
                            item.active
                                ? "text-foreground"
                                : "text-muted-foreground"
                        )}
                    >
                        <item.icon
                            className={cn(
                                "w-6 h-6",
                                item.active && "text-foreground"
                            )}
                        />
                        <span className="text-[10px] font-medium">
                            {item.label}
                        </span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
