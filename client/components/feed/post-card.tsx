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
    Send,
    Flag
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
import { TimeAgo } from "@/components/ui/time-ago";
import { ReportDialog } from "@/components/report/report-dialog";

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
    const [showFullCaption, setShowFullCaption] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showReportDialog, setShowReportDialog] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const heartTimeout = useRef<NodeJS.Timeout | null>(null);

    // Close dropdown menu when clicking outside
    useEffect(() => {
        if (!showMenu) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showMenu]);

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
    const touchStart = useRef<number | null>(null);

    const prevImage = () =>
        setCurrentImageIndex((i) => Math.max(0, i - 1));
    const nextImage = () =>
        setCurrentImageIndex((i) =>
            Math.min(post.media_urls.length - 1, i + 1)
        );

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStart.current = e.touches[0].clientX;
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (touchStart.current === null) return;
        const diff = touchStart.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextImage();
            else prevImage();
        }
        touchStart.current = null;
    }, []);

    return (
        <article
            ref={cardRef}
            className="p-4 hover:bg-muted/30 transition-colors border-b border-border"
        >
            <div className="flex gap-3">
                {/* Avatar */}
                <Link href={`/u/${post.author.username}`} className="shrink-0 relative">
                    <Avatar size="default" className="w-10 h-10">
                        <AvatarImage
                            src={post.author.avatar_url || undefined}
                            alt={post.author.username}
                        />
                        <AvatarFallback>
                            {post.author.username[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    {post.author.is_online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
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
                        <TimeAgo date={post.created_at} />
                        <div className="ml-auto relative" ref={menuRef}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(!showMenu);
                                }}
                                className="p-1 rounded-full hover:bg-muted transition-colors"
                            >
                                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 top-8 z-50 bg-background border border-border rounded-lg shadow-lg py-1 min-w-35">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowMenu(false);
                                            setShowReportDialog(true);
                                        }}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted text-left text-red-500"
                                    >
                                        <Flag className="w-4 h-4" />
                                        Report
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Caption */}
                    {post.caption && (
                        <div className="mt-1.5">
                            {post.caption.length > 150 && !showFullCaption ? (
                                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                    {post.caption.slice(0, 150).trimEnd()}
                                    <span>... </span>
                                    <button
                                        onClick={() => setShowFullCaption(true)}
                                        className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                                    >
                                        more
                                    </button>
                                </p>
                            ) : (
                                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                    {post.caption}
                                </p>
                            )}
                        </div>
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
                            onTouchStart={hasMultipleImages ? handleTouchStart : undefined}
                            onTouchEnd={hasMultipleImages ? handleTouchEnd : undefined}
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
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                    )}
                                    {currentImageIndex <
                                        post.media_urls.length - 1 && (
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
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

            <ReportDialog
                targetId={post.post_id}
                targetType="post"
                open={showReportDialog}
                onClose={() => setShowReportDialog(false)}
            />
        </article>
    );
}
