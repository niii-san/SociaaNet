"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
    Heart,
    MessageSquare,
    Repeat2,
    Bookmark,
    Play,
    Volume2,
    VolumeX,
    Send,
    Eye
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { FeedReel } from "@/features/feed/feed.api";
import {
    likeReel,
    unlikeReel,
    repostReel,
    unrepostReel,
    saveReel,
    unsaveReel,
    viewReel
} from "@/features/posts/posts.api";
import { ShareToChatDialog } from "@/components/chat/share-to-chat-dialog";
import { TimeAgo } from "@/components/ui/time-ago";

function formatCount(count: number): string {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count.toString();
}

interface FeedReelCardProps {
    reel: FeedReel;
}

export function FeedReelCard({ reel }: FeedReelCardProps) {
    const [liked, setLiked] = useState(reel.is_liked);
    const [likesCount, setLikesCount] = useState(reel.likes_count);
    const [reposted, setReposted] = useState(reel.is_reposted);
    const [repostsCount, setRepostsCount] = useState(reel.reposts_count);
    const [saved, setSaved] = useState(reel.is_saved);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [showHeart, setShowHeart] = useState(false);
    const [viewed, setViewed] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [showFullCaption, setShowFullCaption] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const heartTimeout = useRef<NodeJS.Timeout | null>(null);

    // Auto-play when visible, pause when not
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        videoRef.current?.play().catch(() => {});
                        setIsPlaying(true);

                        // Track view after 2 seconds
                        if (!viewed) {
                            const timer = setTimeout(() => {
                                viewReel(reel.reel_id).catch(() => {});
                                setViewed(true);
                            }, 2000);
                            return () => clearTimeout(timer);
                        }
                    } else {
                        videoRef.current?.pause();
                        setIsPlaying(false);
                    }
                });
            },
            { threshold: 0.6 }
        );

        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, [reel.reel_id, viewed]);

    const togglePlay = useCallback(() => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
        }
    }, [isPlaying]);

    const handleLike = useCallback(async () => {
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
    }, [liked, reel.reel_id]);

    const handleRepost = useCallback(async () => {
        const newReposted = !reposted;
        setReposted(newReposted);
        setRepostsCount((c) => c + (newReposted ? 1 : -1));
        try {
            if (newReposted) await repostReel(reel.reel_id);
            else await unrepostReel(reel.reel_id);
        } catch {
            setReposted(!newReposted);
            setRepostsCount((c) => c + (newReposted ? -1 : 1));
        }
    }, [reposted, reel.reel_id]);

    const handleSave = useCallback(async () => {
        const newSaved = !saved;
        setSaved(newSaved);
        try {
            if (newSaved) await saveReel(reel.reel_id);
            else await unsaveReel(reel.reel_id);
        } catch {
            setSaved(!newSaved);
        }
    }, [saved, reel.reel_id]);

    const handleDoubleClick = useCallback(() => {
        if (!liked) handleLike();
        setShowHeart(true);
        if (heartTimeout.current) clearTimeout(heartTimeout.current);
        heartTimeout.current = setTimeout(() => setShowHeart(false), 800);
    }, [liked, handleLike]);

    return (
        <article
            ref={cardRef}
            className="border-b border-border hover:bg-muted/30 transition-colors"
        >
            {/* Suggested label */}
            {reel.is_suggested && (
                <div className="px-4 pt-3 pb-1">
                    <p className="text-xs font-medium text-muted-foreground">
                        Suggested for you
                    </p>
                </div>
            )}

            <div className="p-4">
                <div className="flex gap-3">
                    {/* Avatar */}
                    <Link href={`/u/${reel.author.username}`} className="shrink-0 relative">
                        <Avatar className="w-10 h-10">
                            <AvatarImage
                                src={reel.author.avatar_url || undefined}
                                alt={reel.author.username}
                            />
                            <AvatarFallback>
                                {reel.author.username[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {reel.author.is_online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                        )}
                    </Link>

                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <Link
                                href={`/u/${reel.author.username}`}
                                className="font-semibold text-sm hover:underline truncate"
                            >
                                {reel.author.full_name}
                            </Link>
                            <Link
                                href={`/u/${reel.author.username}`}
                                className="text-muted-foreground text-sm hover:underline truncate"
                            >
                                @{reel.author.username}
                            </Link>
                            <span className="text-muted-foreground text-sm">·</span>
                            <TimeAgo date={reel.created_at} />
                        </div>

                        {/* Caption */}
                        {reel.caption && (
                            <p className="mt-1.5 text-sm whitespace-pre-wrap leading-relaxed">
                                {!showFullCaption && reel.caption.length > 120 ? (
                                    <>
                                        {reel.caption.slice(0, 120).trimEnd()}
                                        {"... "}
                                        <button
                                            onClick={() => setShowFullCaption(true)}
                                            className="text-muted-foreground hover:text-foreground font-medium"
                                        >
                                            more
                                        </button>
                                    </>
                                ) : (
                                    reel.caption
                                )}
                            </p>
                        )}

                        {/* Hashtags */}
                        {reel.hashtags.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                                {reel.hashtags.slice(0, 5).map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-primary text-sm hover:underline cursor-pointer"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Video */}
                        <Link href={`/reels/${reel.reel_id}`}>
                            <div
                                className="mt-3 rounded-xl overflow-hidden border border-border relative group bg-black cursor-pointer"
                                style={{ maxHeight: "500px" }}
                                onDoubleClick={(e) => {
                                    e.preventDefault();
                                    handleDoubleClick();
                                }}
                            >
                                <video
                                    ref={videoRef}
                                    src={reel.video_url}
                                    poster={reel.thumbnail_url}
                                    className="w-full object-contain max-h-125"
                                    loop
                                    playsInline
                                    muted={isMuted}
                                    preload="metadata"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        togglePlay();
                                    }}
                                />

                                {/* Play overlay */}
                                {!isPlaying && (
                                    <div
                                        className="absolute inset-0 flex items-center justify-center bg-black/20"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            togglePlay();
                                        }}
                                    >
                                        <Play className="w-12 h-12 text-white/80 fill-white/80" />
                                    </div>
                                )}

                                {/* Double-click heart */}
                                {showHeart && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
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

                                {/* Mute button */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsMuted((m) => !m);
                                    }}
                                    className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    {isMuted ? (
                                        <VolumeX className="w-4 h-4" />
                                    ) : (
                                        <Volume2 className="w-4 h-4" />
                                    )}
                                </button>

                                {/* Views count badge */}
                                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                                    <Eye className="w-3 h-3" />
                                    {formatCount(reel.views_count)}
                                </div>

                                {/* Reel badge */}
                                <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm font-medium">
                                    Reel
                                </div>
                            </div>
                        </Link>

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-3 max-w-md">
                            {/* Comment */}
                            <Link
                                href={`/reels/${reel.reel_id}`}
                                className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group"
                            >
                                <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                <span className="text-xs">
                                    {reel.comments_count > 0 ? reel.comments_count : ""}
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

                            {/* Share */}
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
            </div>

            <ShareToChatDialog
                open={showShareDialog}
                onOpenChange={setShowShareDialog}
                reelId={reel.reel_id}
            />
        </article>
    );
}
