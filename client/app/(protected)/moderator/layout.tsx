"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    FileText,
    Film,
    ArrowLeft,
    Shield,
    Menu,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";

const modNavItems = [
    {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/moderator"
    },
    {
        icon: Users,
        label: "Users",
        href: "/moderator/users"
    },
    {
        icon: FileText,
        label: "Posts",
        href: "/moderator/posts"
    },
    {
        icon: Film,
        label: "Reels",
        href: "/moderator/reels"
    }
];

export default function ModeratorLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const { data: user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && user) {
            if (user.role !== "moderator" && user.role !== "system_admin") {
                router.replace("/");
            }
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    if (!user || (user.role !== "moderator" && user.role !== "system_admin")) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="font-bold text-lg">Mod Panel</span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X className="w-5 h-5" />
                    ) : (
                        <Menu className="w-5 h-5" />
                    )}
                </Button>
            </header>

            {/* Mobile Nav Dropdown */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-b border-border bg-background p-2 space-y-1">
                    {modNavItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                                pathname === item.href
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                    <Link
                        href="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to App</span>
                    </Link>
                </div>
            )}

            <div className="flex">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 p-4 border-r border-border bg-background">
                    {/* Header */}
                    <div className="flex items-center gap-2 px-3 py-2 mb-6">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                            <span className="text-lg font-bold block leading-tight">
                                Mod Panel
                            </span>
                            <span className="text-xs text-muted-foreground">
                                SociaaNet
                            </span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                        {modNavItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-colors",
                                    pathname === item.href
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "w-5 h-5",
                                        pathname === item.href && "text-primary"
                                    )}
                                />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Back to App */}
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors mt-auto"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to App</span>
                    </Link>

                    {/* User Info */}
                    <div className="flex items-center gap-3 p-3 rounded-xl mt-2 border border-border">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                            {user.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt={user.full_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Users className="w-4 h-4 text-primary" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                                {user.full_name}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                                {user.role.replace("_", " ")}
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-h-screen p-4 md:p-6 lg:p-8 max-w-6xl">
                    {children}
                </main>
            </div>
        </div>
    );
}
