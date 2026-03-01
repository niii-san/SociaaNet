"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
    Heart,
    MessageSquare,
    Repeat2,
    Bookmark,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Send
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FeedPost } from "@/features/feed/feed.api";
import {
    likePost,
    unlikePost,
    repostPost,
    unrepostPost,
    savePost,
    unsavePost,
    viewPost
} from "@/features/posts/posts.api";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { ShareToChatDialog } from "@/components/chat/share-to-chat-dialog";
function timeAgoShort(dateStr: string): string {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diff = now - then;
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo`;
    const years = Math.floor(days / 365);
    return `${years}y`;
}

interface PostCardProps {
    post: FeedPost;
    isActive?: boolean;
}

export function PostCard({ post, isActive = false }: PostCardProps) {
    const [liked, setLiked] = useState(post.is_liked);
    const [likesCount, setLikesCount] = useState(post.likes_count);
    const [reposted, setReposted] = useState(post.is_reposted);
    const [repostsCount, setRepostsCount] = useState(post.reposts_count);
    const [saved, setSaved] = useState(post.is_saved);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showHeart, setShowHeart] = useState(false);
    const [viewed, setViewed] = useState(post.is_seen);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const heartTimeout = useRef<NodeJS.Timeout | null>(null);

    // Track view when card becomes visible
    useEffect(() => {
        if (viewed) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        viewPost(post.post_id).catch(() => {});
                        setViewed(true);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [post.post_id, viewed]);

    const handleLike = useCallback(async () => {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikesCount((c) => c + (newLiked ? 1 : -1));
        try {
            if (newLiked) {
                await likePost(post.post_id);
            } else {
                await unlikePost(post.post_id);
            }
        } catch {
            setLiked(!newLiked);
            setLikesCount((c) => c + (newLiked ? -1 : 1));
        }
    }, [liked, post.post_id]);

    const handleRepost = useCallback(async () => {
        const newReposted = !reposted;
        setReposted(newReposted);
        setRepostsCount((c) => c + (newReposted ? 1 : -1));
        try {
            if (newReposted) {
                await repostPost(post.post_id);
            } else {
                await unrepostPost(post.post_id);
            }
        } catch {
            setReposted(!newReposted);
            setRepostsCount((c) => c + (newReposted ? -1 : 1));
        }
    }, [reposted, post.post_id]);

    const handleSave = useCallback(async () => {
        const newSaved = !saved;
        setSaved(newSaved);
        try {
            if (newSaved) {
                await savePost(post.post_id);
            } else {
                await unsavePost(post.post_id);
            }
        } catch {
            setSaved(!newSaved);
        }
    }, [saved, post.post_id]);

    const handleDoubleClick = useCallback(() => {
        if (!liked) {
            handleLike();
        }
        setShowHeart(true);
        if (heartTimeout.current) clearTimeout(heartTimeout.current);
        heartTimeout.current = setTimeout(() => setShowHeart(false), 800);
    }, [liked, handleLike]);

    // Keyboard shortcuts when post is focused/active
    useKeyboardShortcut(
        [{ key: "l" }, { key: "L" }],
        () => {
            if (isActive) handleLike();
        }
    );
    useKeyboardShortcut(
        [{ key: "s" }, { key: "S" }],
        () => {
            if (isActive) handleSave();
        }
    );

    const hasMultipleImages = post.media_urls.length > 1;

    const prevImage = () =>
        setCurrentImageIndex((i) => Math.max(0, i - 1));
    const nextImage = () =>
        setCurrentImageIndex((i) =>
            Math.min(post.media_urls.length - 1, i + 1)
        );

    const timeAgo = timeAgoShort(post.created_at);

    return (
        <article
            ref={cardRef}
            className="p-4 hover:bg-muted/30 transition-colors border-b border-border"
        >
            <div className="flex gap-3">
                {/* Avatar */}
                <Link href={`/u/${post.author.username}`} className="shrink-0">
                    <Avatar size="default" className="w-10 h-10">
                        <AvatarImage
                            src={post.author.avatar_url || undefined}
                            alt={post.author.username}
                        />
                        <AvatarFallback>
                            {post.author.username[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Link>

                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <Link
                            href={`/u/${post.author.username}`}
                            className="font-semibold text-sm hover:underline truncate"
                        >
                            {post.author.full_name}
                        </Link>
                        <Link
                            href={`/u/${post.author.username}`}
                            className="text-muted-foreground text-sm hover:underline truncate"
                        >
                            @{post.author.username}
                        </Link>
                        <span className="text-muted-foreground text-sm">·</span>
                        <span className="text-muted-foreground text-sm">
                            {timeAgo}
                        </span>
                        <button className="ml-auto p-1 rounded-full hover:bg-muted transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Caption */}
                    {post.caption && (
                        <p className="mt-1.5 text-sm whitespace-pre-wrap leading-relaxed">
                            {post.caption}
                        </p>
                    )}

                    {/* Hashtags */}
                    {post.hashtags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                            {post.hashtags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-primary text-sm hover:underline cursor-pointer"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Media */}
                    {post.media_urls.length > 0 && (
                        <div
                            className="mt-3 rounded-xl overflow-hidden border border-border relative group"
                            onDoubleClick={handleDoubleClick}
                        >
                            <img
                                src={post.media_urls[currentImageIndex]}
                                alt="Post"
                                className="w-full object-cover max-h-125"
                                loading="lazy"
                            />

                            {/* Double-click heart animation */}
                            {showHeart && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <Heart
                                        className="w-20 h-20 text-red-500 fill-red-500 drop-shadow-lg"
                                        style={{
                                            animation: "heartBounce 0.8s ease-out forwards",
                                        }}
                                    />
                                    <style>{`
                                        @keyframes heartBounce {
                                            0% { transform: scale(0); opacity: 1; }
                                            15% { transform: scale(1.3); }
                                            30% { transform: scale(0.95); }
                                            45% { transform: scale(1.1); opacity: 1; }
                                            70% { transform: scale(1); opacity: 1; }
                                            100% { transform: scale(1); opacity: 0; }
                                        }
                                    `}</style>
                                </div>
                            )}

                            {/* Image navigation */}
                            {hasMultipleImages && (
                                <>
                                    {currentImageIndex > 0 && (
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                    )}
                                    {currentImageIndex <
                                        post.media_urls.length - 1 && (
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    )}
                                    {/* Dots indicator */}
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                        {post.media_urls.map((_, i) => (
                                            <span
                                                key={i}
                                                className={cn(
                                                    "w-1.5 h-1.5 rounded-full transition-all",
                                                    i === currentImageIndex
                                                        ? "bg-white w-3"
                                                        : "bg-white/50"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-3 max-w-md">
                        {/* Comment */}
                        <Link
                            href={`/posts/${post.post_id}`}
                            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group"
                        >
                            <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                            <span className="text-xs">
                                {post.comments_count > 0
                                    ? post.comments_count
                                    : ""}
                            </span>
                        </Link>

                        {/* Repost */}
                        <button
                            onClick={handleRepost}
                            className={cn(
                                "flex items-center gap-1.5 transition-colors group active:scale-95",
                                reposted
                                    ? "text-green-500"
                                    : "text-muted-foreground hover:text-green-500"
                            )}
                        >
                            <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                                <Repeat2 className="w-4 h-4" />
                            </div>
                            <span className="text-xs">
                                {repostsCount > 0 ? repostsCount : ""}
                            </span>
                        </button>

                        {/* Like */}
                        <button
                            onClick={handleLike}
                            className={cn(
                                "flex items-center gap-1.5 transition-colors group active:scale-95",
                                liked
                                    ? "text-pink-500"
                                    : "text-muted-foreground hover:text-pink-500"
                            )}
                        >
                            <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
                                <Heart
                                    className={cn(
                                        "w-4 h-4 transition-transform",
                                        liked && "fill-current scale-110"
                                    )}
                                />
                            </div>
                            <span className="text-xs">
                                {likesCount > 0 ? likesCount : ""}
                            </span>
                        </button>

                        {/* Save */}
                        <button
                            onClick={handleSave}
                            className={cn(
                                "flex items-center gap-1.5 transition-colors group active:scale-95",
                                saved
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-primary"
                            )}
                        >
                            <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                                <Bookmark
                                    className={cn(
                                        "w-4 h-4",
                                        saved && "fill-current"
                                    )}
                                />
                            </div>
                        </button>

                        {/* Share to Chat */}
                        <button
                            onClick={() => setShowShareDialog(true)}
                            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group active:scale-95"
                        >
                            <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                                <Send className="w-4 h-4" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <ShareToChatDialog
                open={showShareDialog}
                onOpenChange={setShowShareDialog}
                postId={post.post_id}
            />
        </article>
    );
}
