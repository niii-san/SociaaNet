"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
    Heart,
    MessageSquare,
    Repeat2,
    Bookmark,
    Share2,
    Volume2,
    VolumeX,
    Play,
    Pause
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

interface ReelViewerProps {
    reel: FeedReel;
    isActive: boolean;
    isMuted: boolean;
    onToggleMute: () => void;
}

export function ReelViewer({
    reel,
    isActive,
    isMuted,
    onToggleMute
}: ReelViewerProps) {
    const [liked, setLiked] = useState(reel.is_liked);
    const [likesCount, setLikesCount] = useState(reel.likes_count);
    const [reposted, setReposted] = useState(reel.is_reposted);
    const [repostsCount, setRepostsCount] = useState(reel.reposts_count);
    const [saved, setSaved] = useState(reel.is_saved);
    const [paused, setPaused] = useState(false);
    const [showHeart, setShowHeart] = useState(false);
    const [progress, setProgress] = useState(0);
    const [viewed, setViewed] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const heartTimeout = useRef<NodeJS.Timeout | null>(null);
    const progressInterval = useRef<NodeJS.Timeout | null>(null);

    // Play/pause based on active state
    useEffect(() => {
        if (!videoRef.current) return;

        if (isActive) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => {});
            setPaused(false);

            // Track view after 2 seconds
            if (!viewed) {
                const viewTimer = setTimeout(() => {
                    viewReel(reel.reel_id).catch(() => {});
                    setViewed(true);
                }, 2000);
                return () => clearTimeout(viewTimer);
            }
        } else {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setPaused(false);
        }
    }, [isActive, reel.reel_id, viewed]);

    // Mute state
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted]);

    // Progress tracking
    useEffect(() => {
        if (isActive && !paused) {
            progressInterval.current = setInterval(() => {
                if (videoRef.current) {
                    const p =
                        (videoRef.current.currentTime /
                            videoRef.current.duration) *
                        100;
                    setProgress(isNaN(p) ? 0 : p);
                }
            }, 100);
        } else {
            if (progressInterval.current)
                clearInterval(progressInterval.current);
        }

        return () => {
            if (progressInterval.current)
                clearInterval(progressInterval.current);
        };
    }, [isActive, paused]);

    const togglePlayPause = useCallback(() => {
        if (!videoRef.current) return;
        if (paused) {
            videoRef.current.play().catch(() => {});
            setPaused(false);
        } else {
            videoRef.current.pause();
            setPaused(true);
        }
    }, [paused]);

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
        <div className="relative w-full h-full bg-black flex items-center justify-center snap-start snap-always">
            {/* Video */}
            <video
                ref={videoRef}
                src={reel.video_url}
                className="w-full h-full object-contain"
                loop
                playsInline
                muted={isMuted}
                preload="metadata"
                poster={reel.thumbnail_url}
                onClick={togglePlayPause}
                onDoubleClick={handleDoubleClick}
            />

            {/* Pause overlay */}
            {paused && isActive && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
                    onClick={togglePlayPause}
                >
                    <Play className="w-16 h-16 text-white/80 fill-white/80" />
                </div>
            )}

            {/* Double-click heart animation */}
            {showHeart && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <Heart
                        className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-lg"
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

            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20 z-10">
                <div
                    className="h-full bg-white transition-[width] duration-100"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Right side action buttons */}
            <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 z-10">
                {/* Like */}
                <button
                    onClick={handleLike}
                    className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
                >
                    <div
                        className={cn(
                            "w-11 h-11 rounded-full flex items-center justify-center",
                            "bg-black/30 backdrop-blur-sm"
                        )}
                    >
                        <Heart
                            className={cn(
                                "w-6 h-6",
                                liked
                                    ? "text-pink-500 fill-pink-500"
                                    : "text-white"
                            )}
                        />
                    </div>
                    <span className="text-white text-xs font-medium">
                        {formatCount(likesCount)}
                    </span>
                </button>

                {/* Comment */}
                <Link
                    href={`/reels?id=${reel.reel_id}`}
                    className="flex flex-col items-center gap-1"
                >
                    <div className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white text-xs font-medium">
                        {formatCount(reel.comments_count)}
                    </span>
                </Link>

                {/* Repost */}
                <button
                    onClick={handleRepost}
                    className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
                >
                    <div
                        className={cn(
                            "w-11 h-11 rounded-full flex items-center justify-center",
                            "bg-black/30 backdrop-blur-sm"
                        )}
                    >
                        <Repeat2
                            className={cn(
                                "w-6 h-6",
                                reposted ? "text-green-500" : "text-white"
                            )}
                        />
                    </div>
                    <span className="text-white text-xs font-medium">
                        {formatCount(repostsCount)}
                    </span>
                </button>

                {/* Save */}
                <button
                    onClick={handleSave}
                    className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
                >
                    <div className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        <Bookmark
                            className={cn(
                                "w-6 h-6",
                                saved
                                    ? "text-primary fill-primary"
                                    : "text-white"
                            )}
                        />
                    </div>
                </button>

                {/* Share to Chat */}
                <button
                    onClick={() => setShowShareDialog(true)}
                    className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
                >
                    <div className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        <Share2 className="w-6 h-6 text-white" />
                    </div>
                </button>

                {/* Mute */}
                <button
                    onClick={onToggleMute}
                    className="flex flex-col items-center active:scale-90 transition-transform"
                >
                    <div className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        {isMuted ? (
                            <VolumeX className="w-5 h-5 text-white" />
                        ) : (
                            <Volume2 className="w-5 h-5 text-white" />
                        )}
                    </div>
                </button>
            </div>

            {/* Bottom info overlay */}
            <div className="absolute bottom-4 left-3 right-16 z-10">
                {/* Author */}
                <Link
                    href={`/u/${reel.author.username}`}
                    className="flex items-center gap-2.5 mb-2"
                >
                    <Avatar className="w-9 h-9 ring-2 ring-white/30">
                        <AvatarImage
                            src={reel.author.avatar_url || undefined}
                            alt={reel.author.username}
                        />
                        <AvatarFallback className="text-xs">
                            {reel.author.username[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-white font-semibold text-sm drop-shadow-md">
                        {reel.author.username}
                    </span>
                    {reel.author.is_online && (
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                    )}
                </Link>

                {/* Caption */}
                {reel.caption && (
                    <p className="text-white text-sm drop-shadow-md line-clamp-2 mb-1">
                        {reel.caption}
                    </p>
                )}

                {/* Hashtags */}
                {reel.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {reel.hashtags.slice(0, 5).map((tag) => (
                            <span
                                key={tag}
                                className="text-white/80 text-xs drop-shadow-md"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Views */}
                <p className="text-white/60 text-xs mt-1.5">
                    {formatCount(reel.views_count)} views
                </p>
            </div>

            <ShareToChatDialog
                open={showShareDialog}
                onOpenChange={setShowShareDialog}
                reelId={reel.reel_id}
            />
        </div>
    );
}

function formatCount(count: number): string {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count.toString();
}
