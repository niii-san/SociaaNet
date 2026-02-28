"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getReelById, updateReelVisibility, ReelDetail, likeReel, unlikeReel, viewReel, repostReel, unrepostReel, saveReel, unsaveReel } from "@/features/posts/posts.api";
import { useAuth } from "@/contexts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MiniLoader } from "@/components/ui/mini-loader";
import {
    Heart,
    MessageCircle,
    Send,
    Bookmark,
    MoreHorizontal,
    Globe,
    Lock,
    Users,
    Play,
    Pause,
    Volume2,
    VolumeX,
    Eye,
    Repeat2,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import CommentSection from "@/components/comments/comment-section";
import Link from "next/link";

export default function ReelDetailPage() {
    const { reelId } = useParams<{ reelId: string }>();
    const router = useRouter();
    const { data: currentUser } = useAuth();
    const videoRef = useRef<HTMLVideoElement>(null);

    const [reel, setReel] = useState<ReelDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingVisibility, setUpdatingVisibility] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [likingInProgress, setLikingInProgress] = useState(false);
    const [commentsCount, setCommentsCount] = useState(0);
    const [viewsCount, setViewsCount] = useState(0);
    const [isReposted, setIsReposted] = useState(false);
    const [repostsCount, setRepostsCount] = useState(0);
    const [repostingInProgress, setRepostingInProgress] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [savingInProgress, setSavingInProgress] = useState(false);

    useEffect(() => {
        const fetchReel = async () => {
            if (!reelId) return;

            setLoading(true);
            try {
                const data = await getReelById(reelId);
                setReel(data);
                setIsLiked(data.is_reel_liked_by_current_user);
                setLikesCount(data.likes_count);
                setCommentsCount(data.comments_count);
                setViewsCount(data.views_count);
                setIsReposted(data.is_reel_reposted_by_current_user);
                setRepostsCount(data.reposts_count);
                setIsSaved(data.is_reel_saved_by_current_user);

                // Record view and update count
                try {
                    const viewResult = await viewReel(reelId);
                    if (viewResult.data?.views_count !== undefined) {
                        setViewsCount(viewResult.data.views_count);
                    }
                } catch {
                    // View tracking failure is non-critical
                }
            } catch (error: any) {
                console.error("Error fetching reel:", error);
                toast.error(error.response?.data?.message || "Failed to load reel");
            } finally {
                setLoading(false);
            }
        };

        fetchReel();
    }, [reelId]);

    // Auto-play video when loaded
    useEffect(() => {
        if (videoRef.current && reel) {
            videoRef.current.play()
                .then(() => {
                    setIsPlaying(true);
                })
                .catch((error) => {
                    console.log("Autoplay prevented:", error);
                    // Autoplay was prevented, user needs to click play
                });
        }
    }, [reel]);

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVisibilityChange = async (newVisibility: "public" | "private" | "followers") => {
        if (!reel) return;

        setUpdatingVisibility(true);
        try {
            await updateReelVisibility(reel.reel_id, newVisibility);
            setReel({ ...reel, visibility: newVisibility });
            toast.success("Visibility updated successfully");
        } catch (error: any) {
            console.error("Error updating visibility:", error);
            toast.error(error.response?.data?.message || "Failed to update visibility");
        } finally {
            setUpdatingVisibility(false);
        }
    };

    const handleLikeToggle = async () => {
        if (!reel || likingInProgress) return;

        setLikingInProgress(true);
        // Optimistic update
        const previousIsLiked = isLiked;
        const previousLikesCount = likesCount;
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

        try {
            if (previousIsLiked) {
                await unlikeReel(reel.reel_id);
            } else {
                await likeReel(reel.reel_id);
            }
        } catch (error: any) {
            // Revert on failure
            setIsLiked(previousIsLiked);
            setLikesCount(previousLikesCount);
            toast.error(error.response?.data?.message || "Failed to update like");
        } finally {
            setLikingInProgress(false);
        }
    };

    const handleRepostToggle = async () => {
        if (!reel || repostingInProgress) return;

        setRepostingInProgress(true);
        // Optimistic update
        const previousIsReposted = isReposted;
        const previousRepostsCount = repostsCount;
        setIsReposted(!isReposted);
        setRepostsCount(isReposted ? repostsCount - 1 : repostsCount + 1);

        try {
            if (previousIsReposted) {
                await unrepostReel(reel.reel_id);
            } else {
                await repostReel(reel.reel_id);
            }
        } catch (error: any) {
            // Revert on failure
            setIsReposted(previousIsReposted);
            setRepostsCount(previousRepostsCount);
            toast.error(error.response?.data?.message || "Failed to update repost");
        } finally {
            setRepostingInProgress(false);
        }
    };

    const handleSaveToggle = async () => {
        if (!reel || savingInProgress) return;

        setSavingInProgress(true);
        const previousIsSaved = isSaved;
        setIsSaved(!isSaved);

        try {
            if (previousIsSaved) {
                await unsaveReel(reel.reel_id);
            } else {
                await saveReel(reel.reel_id);
            }
        } catch (error: any) {
            setIsSaved(previousIsSaved);
            toast.error(error.response?.data?.message || "Failed to update save");
        } finally {
            setSavingInProgress(false);
        }
    };

    const getVisibilityIcon = (visibility: string) => {
        switch (visibility) {
            case "public":
                return <Globe className="w-4 h-4" />;
            case "followers":
                return <Users className="w-4 h-4" />;
            case "private":
                return <Lock className="w-4 h-4" />;
            default:
                return <Globe className="w-4 h-4" />;
        }
    };

    const getVisibilityText = (visibility: string) => {
        switch (visibility) {
            case "public":
                return "Public";
            case "followers":
                return "Followers";
            case "private":
                return "Private";
            default:
                return visibility;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            return `${diffInMinutes}m ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays}d ago`;
        } else {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
            });
        }
    };

    const formatViews = (views: number): string => {
        if (views >= 1000000) {
            return `${(views / 1000000).toFixed(1)}M`;
        } else if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}K`;
        }
        return views.toString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <MiniLoader />
            </div>
        );
    }

    if (!reel) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold">Reel Not Found</h2>
                <p className="text-muted-foreground">This reel may have been deleted or is not available.</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    // Get visibility options based on account type
    const isPrivateAccount = currentUser?.is_private_account;
    const visibilityOptions: Array<"public" | "private" | "followers"> = isPrivateAccount
        ? ["followers", "private"]
        : ["public", "private"];

    return (
        <div className="min-h-screen bg-background pb-12">
            <div className="container max-w-4xl mx-auto px-4 py-8">
                {/* Reel Card */}
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center gap-3">
                                <Link href={`/u/${reel.author.username}`}>
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={reel.author.avatar_url || undefined} />
                                        <AvatarFallback>
                                            {reel.author.full_name?.charAt(0).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link href={`/u/${reel.author.username}`} className="font-semibold text-sm hover:underline">
                                        {reel.author.username}
                                    </Link>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>{formatDate(reel.created_at)}</span>
                                        <span>•</span>
                                        <div className="flex items-center gap-1">
                                            {getVisibilityIcon(reel.visibility)}
                                            <span className="capitalize">{getVisibilityText(reel.visibility)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {reel.is_reel_author && (
                                        <>
                                            {visibilityOptions.map((vis) => (
                                                <DropdownMenuItem
                                                    key={vis}
                                                    onClick={() => handleVisibilityChange(vis)}
                                                    disabled={updatingVisibility || reel.visibility === vis}
                                                    className="gap-2"
                                                >
                                                    {getVisibilityIcon(vis)}
                                                    <span>Make {getVisibilityText(vis)}</span>
                                                </DropdownMenuItem>
                                            ))}
                                            <Separator className="my-1" />
                                        </>
                                    )}
                                    <DropdownMenuItem className="text-destructive">
                                        Report
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Video */}
                        <div className="relative bg-black aspect-9/16 w-full max-w-md mx-auto">
                            <video
                                ref={videoRef}
                                src={reel.video_url}
                                className="w-full h-full object-contain"
                                loop
                                playsInline
                                onClick={togglePlayPause}
                            />

                            {/* Video Controls Overlay */}
                            <div className="absolute inset-0 pointer-events-none">
                                {/* Play/Pause button */}
                                {!isPlaying && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-black/50 rounded-full p-4 pointer-events-auto cursor-pointer" onClick={togglePlayPause}>
                                            <Play className="w-12 h-12 text-white fill-white" />
                                        </div>
                                    </div>
                                )}

                                {/* Mute button */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full pointer-events-auto"
                                    onClick={toggleMute}
                                >
                                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                </Button>

                                {/* Views count */}
                                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                                    <Eye className="w-4 h-4" />
                                    {formatViews(viewsCount)}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hover:text-pink-500"
                                        onClick={handleLikeToggle}
                                        disabled={likingInProgress}
                                    >
                                        <Heart
                                            className={`w-7 h-7 transition-colors ${
                                                isLiked
                                                    ? "fill-pink-500 text-pink-500"
                                                    : ""
                                            }`}
                                        />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <MessageCircle className="w-7 h-7" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Send className="w-7 h-7" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hover:text-green-500"
                                        onClick={handleRepostToggle}
                                        disabled={repostingInProgress || reel.is_reel_author}
                                        title={reel.is_reel_author ? "You can't repost your own reel" : isReposted ? "Remove repost" : "Repost"}
                                    >
                                        <Repeat2
                                            className={`w-7 h-7 transition-colors ${
                                                isReposted
                                                    ? "text-green-500"
                                                    : ""
                                            }`}
                                        />
                                    </Button>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:text-amber-500"
                                    onClick={handleSaveToggle}
                                    disabled={savingInProgress}
                                    title={isSaved ? "Remove from saved" : "Save reel"}
                                >
                                    <Bookmark
                                        className={`w-6 h-6 transition-colors ${
                                            isSaved
                                                ? "fill-amber-500 text-amber-500"
                                                : ""
                                        }`}
                                    />
                                </Button>
                            </div>

                            {/* Likes, reposts and Views count */}
                            <div className="flex items-center gap-4 text-sm">
                                <p className="font-semibold">
                                    {likesCount} {likesCount === 1 ? "like" : "likes"}
                                </p>
                                {repostsCount > 0 && (
                                    <>
                                        <span className="text-muted-foreground">•</span>
                                        <p className="text-muted-foreground">
                                            {repostsCount} {repostsCount === 1 ? "repost" : "reposts"}
                                        </p>
                                    </>
                                )}
                                <span className="text-muted-foreground">•</span>
                                <p className="text-muted-foreground">
                                    {formatViews(viewsCount)} views
                                </p>
                            </div>

                            {/* Caption */}
                            {reel.caption && (
                                <div>
                                    <p className="text-sm">
                                        <Link href={`/u/${reel.author.username}`} className="font-semibold mr-2 hover:underline">
                                            {reel.author.username}
                                        </Link>
                                        {reel.caption}
                                    </p>
                                    {reel.hashtags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {reel.hashtags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="text-sm text-primary cursor-pointer hover:underline"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Comments Section */}
                <CommentSection
                    targetId={reel.reel_id}
                    targetType="reel"
                    commentsCount={commentsCount}
                    currentUser={currentUser}
                    onCommentsCountChange={setCommentsCount}
                />
            </div>
        </div>
    );
}
