"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
    Heart,
    MessageSquare,
    Play,
    Eye
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ExploreItem, ExplorePost, ExploreReel } from "@/features/feed/feed.api";
import {
    likePost,
    unlikePost,
    savePost,
    unsavePost,
    likeReel,
    unlikeReel,
    saveReel,
    unsaveReel
} from "@/features/posts/posts.api";

interface ExploreCardProps {
    item: ExploreItem;
    size?: "normal" | "large";
}

export function ExploreCard({ item, size = "normal" }: ExploreCardProps) {
    if (item.type === "post") {
        return <ExplorePostCard post={item} size={size} />;
    }
    return <ExploreReelCard reel={item} size={size} />;
}

function ExplorePostCard({
    post,
    size
}: {
    post: ExplorePost;
    size: "normal" | "large";
}) {
    const [liked, setLiked] = useState(post.is_liked);
    const [likesCount, setLikesCount] = useState(post.likes_count);

    const handleLike = useCallback(
        async (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const newLiked = !liked;
            setLiked(newLiked);
            setLikesCount((c) => c + (newLiked ? 1 : -1));
            try {
                if (newLiked) await likePost(post.post_id);
                else await unlikePost(post.post_id);
            } catch {
                setLiked(!newLiked);
                setLikesCount((c) => c + (newLiked ? -1 : 1));
            }
        },
        [liked, post.post_id]
    );

    const hasImage = post.media_urls.length > 0;

    return (
        <Link
            href={`/posts/${post.post_id}`}
            className={cn(
                "relative group rounded-xl overflow-hidden bg-muted border border-border block",
                size === "large" ? "row-span-2" : ""
            )}
        >
            {hasImage ? (
                <img
                    src={post.media_urls[0]}
                    alt="Post"
                    className={cn(
                        "w-full object-cover transition-transform duration-300 group-hover:scale-105",
                        size === "large" ? "h-full min-h-80" : "h-52"
                    )}
                    loading="lazy"
                />
            ) : (
                <div
                    className={cn(
                        "w-full flex items-center justify-center p-4 bg-linear-to-br from-primary/10 to-primary/5",
                        size === "large" ? "h-full min-h-80" : "h-52"
                    )}
                >
                    <p className="text-sm text-center line-clamp-4 text-foreground/80">
                        {post.caption}
                    </p>
                </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex items-center gap-6 text-white">
                    <button
                        onClick={handleLike}
                        className="flex items-center gap-1.5 active:scale-95 transition-transform"
                    >
                        <Heart
                            className={cn(
                                "w-6 h-6",
                                liked && "fill-white"
                            )}
                        />
                        <span className="font-semibold text-sm">
                            {likesCount}
                        </span>
                    </button>
                    <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-6 h-6" />
                        <span className="font-semibold text-sm">
                            {post.comments_count}
                        </span>
                    </div>
                </div>
            </div>

            {/* Multi-image indicator */}
            {post.media_urls.length > 1 && (
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md">
                    1/{post.media_urls.length}
                </div>
            )}

            {/* Author chip */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-black/60 to-transparent">
                <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                        <AvatarImage
                            src={post.author.avatar_url || undefined}
                            alt={post.author.username}
                        />
                        <AvatarFallback className="text-[10px]">
                            {post.author.username[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-white text-xs font-medium truncate">
                        {post.author.username}
                    </span>
                </div>
            </div>
        </Link>
    );
}

function ExploreReelCard({
    reel,
    size
}: {
    reel: ExploreReel;
    size: "normal" | "large";
}) {
    const [liked, setLiked] = useState(reel.is_liked);
    const [likesCount, setLikesCount] = useState(reel.likes_count);

    const handleLike = useCallback(
        async (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const newLiked = !liked;
            setLiked(newLiked);
            setLikesCount((c) => c + (newLiked ? 1 : -1));
            try {
                if (newLiked) await likeReel(reel.reel_id);
                else await unlikeReel(reel.reel_id);
            } catch {
                setLiked(!newLiked);
                setLikesCount((c) => c + (newLiked ? -1 : 1));
            }
        },
        [liked, reel.reel_id]
    );

    return (
        <Link
            href={`/reels?id=${reel.reel_id}`}
            className={cn(
                "relative group rounded-xl overflow-hidden bg-muted border border-border block",
                size === "large" ? "row-span-2" : ""
            )}
        >
            <img
                src={reel.thumbnail_url}
                alt="Reel thumbnail"
                className={cn(
                    "w-full object-cover transition-transform duration-300 group-hover:scale-105",
                    size === "large" ? "h-full min-h-80" : "h-52"
                )}
                loading="lazy"
            />

            {/* Play icon + duration */}
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md">
                <Play className="w-3 h-3 fill-white" />
                <span>
                    {Math.floor(reel.duration_seconds / 60)}:
                    {String(Math.floor(reel.duration_seconds % 60)).padStart(
                        2,
                        "0"
                    )}
                </span>
            </div>

            {/* Views badge */}
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md">
                <Eye className="w-3 h-3" />
                <span>{formatCount(reel.views_count)}</span>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex items-center gap-6 text-white">
                    <button
                        onClick={handleLike}
                        className="flex items-center gap-1.5 active:scale-95 transition-transform"
                    >
                        <Heart
                            className={cn(
                                "w-6 h-6",
                                liked && "fill-white"
                            )}
                        />
                        <span className="font-semibold text-sm">
                            {likesCount}
                        </span>
                    </button>
                    <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-6 h-6" />
                        <span className="font-semibold text-sm">
                            {reel.comments_count}
                        </span>
                    </div>
                </div>
            </div>

            {/* Author chip */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-black/60 to-transparent">
                <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                        <AvatarImage
                            src={reel.author.avatar_url || undefined}
                            alt={reel.author.username}
                        />
                        <AvatarFallback className="text-[10px]">
                            {reel.author.username[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-white text-xs font-medium truncate">
                        {reel.author.username}
                    </span>
                </div>
            </div>
        </Link>
    );
}

function formatCount(count: number): string {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count.toString();
}
