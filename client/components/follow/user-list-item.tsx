"use client";

import { FollowUser } from "@/types";
import Link from "next/link";
import { useAuth } from "@/contexts";
import { FollowButton } from "./follow-button";

interface UserListItemProps {
    user: FollowUser;
    onFollowChange?: () => void;
    onNavigate?: () => void;
    showFollowButton?: boolean;
    followButtonText?: string;
}

export function UserListItem({ 
    user, 
    onFollowChange, 
    onNavigate,
    showFollowButton = true,
    followButtonText
}: UserListItemProps) {
    const { data: currentUser } = useAuth();
    const isCurrentUser = currentUser?.user_id === user.user_id;
    const isLocalhost = user.avatar_url?.includes('localhost');

    return (
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-colors border border-transparent">
            <Link
                href={`/u/${user.username}`}
                onClick={onNavigate}
                className="flex items-center gap-3 flex-1 min-w-0"
            >
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted shrink-0">
                    {isLocalhost || !user.avatar_url ? (
                        <img
                            src={user.avatar_url || "/images/defaultAvatar.svg"}
                            alt={user.fullname}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img
                            src={user.avatar_url}
                            alt={user.fullname}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{user.fullname}</p>
                    <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                </div>
            </Link>
            {!isCurrentUser && showFollowButton && (
                <FollowButton
                    userId={user.user_id}
                    username={user.username}
                    isFollowing={user.is_following || false}
                    isPrivate={false}
                    onFollowChange={onFollowChange}
                    size="sm"
                    customFollowText={followButtonText}
                />
            )}
        </div>
    );
}
