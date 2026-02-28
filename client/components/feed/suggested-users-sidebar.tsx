"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "@/components/follow/follow-button";
import { getSuggestedUsers, SuggestedUser } from "@/features/feed/feed.api";

export function SuggestedUsersSidebar() {
    const [users, setUsers] = useState<SuggestedUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSuggestedUsers(5)
            .then(setUsers)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleFollowChange = (userId: string) => {
        setUsers((prev) => prev.filter((u) => u.user_id !== userId));
    };

    if (loading) {
        return (
            <div className="bg-muted/50 rounded-2xl p-4">
                <h2 className="text-base font-bold mb-4">Who to follow</h2>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 animate-pulse">
                            <div className="w-10 h-10 rounded-full bg-muted" />
                            <div className="flex-1">
                                <div className="h-3 w-24 bg-muted rounded" />
                                <div className="h-2.5 w-16 bg-muted rounded mt-1.5" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (users.length === 0) return null;

    return (
        <div className="bg-muted/50 rounded-2xl p-4">
            <h2 className="text-base font-bold mb-4">Suggested for you</h2>
            <div className="space-y-3">
                {users.map((user) => (
                    <div key={user.user_id} className="flex items-center gap-3">
                        <Link href={`/u/${user.username}`}>
                            <Avatar size="default" className="w-10 h-10">
                                <AvatarImage
                                    src={user.avatar_url || undefined}
                                    alt={user.username}
                                />
                                <AvatarFallback>
                                    {user.username[0]?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </Link>
                        <div className="flex-1 min-w-0">
                            <Link
                                href={`/u/${user.username}`}
                                className="font-semibold text-sm truncate block hover:underline"
                            >
                                {user.full_name}
                            </Link>
                            <p className="text-xs text-muted-foreground truncate">
                                @{user.username}
                            </p>
                        </div>
                        <FollowButton
                            userId={user.user_id}
                            username={user.username}
                            isFollowing={false}
                            isPrivate={false}
                            size="sm"
                            onFollowChange={() => handleFollowChange(user.user_id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
