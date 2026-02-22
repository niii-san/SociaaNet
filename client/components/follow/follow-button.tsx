"use client";

import { Button } from "@/components/ui/button";
import { useFollowUser } from "@/hooks/useFollowUser";
import { useFollow } from "@/contexts";
import { Loader2, UserPlus, UserCheck, UserX } from "lucide-react";
import { useState, useEffect } from "react";

interface FollowButtonProps {
    userId: string;
    username: string;
    isFollowing: boolean;
    isPrivate: boolean;
    onFollowChange?: () => void;
    variant?: "default" | "outline";
    size?: "default" | "sm" | "lg";
    customFollowText?: string;
}

export function FollowButton({
    userId,
    username,
    isFollowing: initialIsFollowing,
    isPrivate,
    onFollowChange,
    variant = "default",
    size = "default",
    customFollowText,
}: FollowButtonProps) {
    const { handleFollow, handleUnfollow, handleCancelRequest, loading } = useFollowUser();
    const { followingRequests } = useFollow();
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

    // Update local state when prop changes
    useEffect(() => {
        setIsFollowing(initialIsFollowing);
    }, [initialIsFollowing]);

    // Check if there's a pending request
    const hasPendingRequest = followingRequests.some(
        (req) => req.following === userId && req.status === "pending"
    );

    const handleClick = async () => {
        if (isFollowing) {
            const success = await handleUnfollow(userId, onFollowChange);
            if (success) {
                setIsFollowing(false);
            }
        } else if (hasPendingRequest) {
            await handleCancelRequest(userId, onFollowChange);
        } else {
            const success = await handleFollow(userId, isPrivate, onFollowChange);
            if (success && !isPrivate) {
                setIsFollowing(true);
            }
        }
    };

    const getButtonContent = () => {
        if (loading) {
            return (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="ml-2">Loading...</span>
                </>
            );
        }

        if (isFollowing) {
            return (
                <>
                    <UserCheck className="w-4 h-4" />
                    <span className="ml-2">Following</span>
                </>
            );
        }

        if (hasPendingRequest) {
            return (
                <>
                    <UserX className="w-4 h-4" />
                    <span className="ml-2">Requested</span>
                </>
            );
        }

        return (
            <>
                <UserPlus className="w-4 h-4" />
                <span className="ml-2">{customFollowText || "Follow"}</span>
            </>
        );
    };

    const getVariant = () => {
        if (isFollowing || hasPendingRequest) {
            return "outline";
        }
        return variant;
    };

    return (
        <Button
            onClick={handleClick}
            disabled={loading}
            variant={getVariant()}
            size={size}
            className="gap-1"
        >
            {getButtonContent()}
        </Button>
    );
}
