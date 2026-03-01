"use client";

import { useEffect, useState, useRef } from "react";
import { getSuggestedUsers, SuggestedUser } from "@/features/feed/feed.api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useFollowUser } from "@/hooks/useFollowUser";
import { ChevronLeft, ChevronRight, UserPlus, X } from "lucide-react";
import Link from "next/link";

export function SuggestedUsersBar() {
    const [users, setUsers] = useState<SuggestedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());
    const [showArrows, setShowArrows] = useState({ left: false, right: false });
    const scrollRef = useRef<HTMLDivElement>(null);
    const { handleFollow, loading: followLoading } = useFollowUser();
    const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        (async () => {
            try {
                const data = await getSuggestedUsers(15);
                setUsers(data);
            } catch {
                // Silently fail — optional widget
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Check scroll arrows visibility
    const updateArrows = () => {
        const el = scrollRef.current;
        if (!el) return;
        setShowArrows({
            left: el.scrollLeft > 10,
            right: el.scrollLeft < el.scrollWidth - el.clientWidth - 10,
        });
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        updateArrows();
        el.addEventListener("scroll", updateArrows, { passive: true });
        const resizeObs = new ResizeObserver(updateArrows);
        resizeObs.observe(el);
        return () => {
            el.removeEventListener("scroll", updateArrows);
            resizeObs.disconnect();
        };
    }, [users, dismissed]);

    const scroll = (direction: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        const amount = direction === "left" ? -200 : 200;
        el.scrollBy({ left: amount, behavior: "smooth" });
    };

    const handleDismiss = (userId: string) => {
        setDismissed((prev) => new Set(prev).add(userId));
    };

    const handleFollowClick = async (user: SuggestedUser) => {
        const success = await handleFollow(user.user_id, false);
        if (success) {
            setFollowingIds((prev) => new Set(prev).add(user.user_id));
        }
    };

    const visibleUsers = users.filter((u) => !dismissed.has(u.user_id));

    if (loading || visibleUsers.length === 0) return null;

    return (
        <div className="border-b border-border bg-background">
            {/* Section header */}
            <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                <p className="text-sm font-semibold text-muted-foreground">
                    Suggested for you
                </p>
            </div>

            {/* Scrollable container */}
            <div className="relative group/scroll">
                {/* Left arrow */}
                {showArrows.left && (
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-background/90 border border-border rounded-full p-1 shadow-md opacity-0 group-hover/scroll:opacity-100 transition-opacity hidden md:flex items-center justify-center cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                )}

                {/* Right arrow */}
                {showArrows.right && (
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-background/90 border border-border rounded-full p-1 shadow-md opacity-0 group-hover/scroll:opacity-100 transition-opacity hidden md:flex items-center justify-center cursor-pointer"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}

                <div
                    ref={scrollRef}
                    className="flex gap-3 overflow-x-auto px-4 pb-3 pt-1 scrollbar-none"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {visibleUsers.map((user) => {
                        const isFollowed = followingIds.has(user.user_id);

                        return (
                            <div
                                key={user.user_id}
                                className="flex flex-col items-center gap-1.5 min-w-25 w-25 relative rounded-xl border border-border bg-card p-3 shrink-0"
                            >
                                {/* Dismiss button */}
                                <button
                                    onClick={() => handleDismiss(user.user_id)}
                                    className="absolute top-1 right-1 p-0.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                                >
                                    <X className="w-3 h-3" />
                                </button>

                                {/* Avatar with link */}
                                <Link href={`/u/${user.username}`}>
                                    <Avatar className="w-14 h-14 ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                                        <AvatarImage
                                            src={user.avatar_url || undefined}
                                            alt={user.username}
                                        />
                                        <AvatarFallback className="text-lg">
                                            {user.username[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>

                                {/* Username */}
                                <Link
                                    href={`/u/${user.username}`}
                                    className="text-xs font-semibold truncate w-full text-center hover:underline"
                                >
                                    {user.username}
                                </Link>

                                {/* Full name */}
                                <p className="text-[10px] text-muted-foreground truncate w-full text-center -mt-1">
                                    {user.full_name}
                                </p>

                                {/* Follow button */}
                                <Button
                                    size="sm"
                                    variant={isFollowed ? "outline" : "default"}
                                    className="w-full h-7 text-xs mt-auto"
                                    onClick={() => handleFollowClick(user)}
                                    disabled={followLoading || isFollowed}
                                >
                                    {isFollowed ? (
                                        "Following"
                                    ) : (
                                        <>
                                            <UserPlus className="w-3 h-3 mr-1" />
                                            Follow
                                        </>
                                    )}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
