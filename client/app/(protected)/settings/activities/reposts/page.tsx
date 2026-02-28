"use client";

import { useEffect, useState, useCallback } from "react";
import { getRepostHistory, RepostHistoryItem, PaginatedResponse } from "@/features/activities/history.api";
import { MiniLoader } from "@/components/ui/mini-loader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Repeat2, Image, Film, Heart, MessageCircle, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInSeconds < 60) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInWeeks < 52) return `${diffInWeeks}w ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function RepostHistoryPage() {
    const [data, setData] = useState<PaginatedResponse<RepostHistoryItem> | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);

    const fetchReposts = useCallback(async (pageNum: number, append = false) => {
        try {
            const result = await getRepostHistory(pageNum, 20);
            if (append && data) {
                setData({
                    ...result,
                    items: [...data.items, ...result.items],
                });
            } else {
                setData(result);
            }
        } catch (error: any) {
            console.error("Failed to fetch repost history:", error);
            toast.error(error?.response?.data?.message || "Failed to load repost history");
        }
    }, [data]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await fetchReposts(1);
            setLoading(false);
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLoadMore = async () => {
        const nextPage = page + 1;
        setLoadingMore(true);
        await fetchReposts(nextPage, true);
        setPage(nextPage);
        setLoadingMore(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <MiniLoader />
            </div>
        );
    }

    const hasMore = data ? page < data.total_pages : false;

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
                <div className="flex items-center gap-3">
                    <Link href="/settings/activities" className="text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <Repeat2 className="w-6 h-6 text-green-500" />
                    <h1 className="text-2xl font-bold">Repost History</h1>
                    {data && (
                        <span className="text-sm text-muted-foreground ml-auto">
                            {data.total} {data.total === 1 ? "repost" : "reposts"}
                        </span>
                    )}
                </div>
            </header>

            <div className="container max-w-3xl mx-auto px-4 py-6 space-y-3">
                {!data || data.items.length === 0 ? (
                    <div className="text-center py-16">
                        <Repeat2 className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                        <p className="text-lg font-medium text-muted-foreground">No reposts yet</p>
                        <p className="text-sm text-muted-foreground/70 mt-1">
                            Posts and reels you repost will appear here
                        </p>
                    </div>
                ) : (
                    <>
                        {data.items.map((item, index) => (
                            <RepostHistoryCard key={`${item.type}-${index}`} item={item} />
                        ))}

                        {hasMore && (
                            <div className="flex justify-center pt-4">
                                <Button
                                    variant="outline"
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="gap-2"
                                >
                                    {loadingMore ? <MiniLoader /> : "Load more"}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function RepostHistoryCard({ item }: { item: RepostHistoryItem }) {
    const isPost = item.type === "post" && item.post;
    const isReel = item.type === "reel" && item.reel;

    const href = isPost
        ? `/posts/${item.post!.post_id}`
        : isReel
            ? `/reels/${item.reel!.reel_id}`
            : "#";

    const caption = isPost ? item.post!.caption : isReel ? item.reel!.caption : "";
    const likesCount = isPost ? item.post!.likes_count : isReel ? item.reel!.likes_count : 0;
    const commentsCount = isPost ? item.post!.comments_count : isReel ? item.reel!.comments_count : 0;
    const mediaUrl = isPost ? item.post!.media_url : isReel ? item.reel!.thumbnail_url : null;

    return (
        <Link href={href}>
            <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group">
                <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                        {mediaUrl ? (
                            <img
                                src={mediaUrl}
                                alt={caption || "Media"}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Image className="w-6 h-6 text-muted-foreground/40" />
                            </div>
                        )}
                        {/* Type badge */}
                        <div className="absolute top-1 right-1 bg-black/60 rounded p-0.5">
                            {isReel ? (
                                <Film className="w-3 h-3 text-white" />
                            ) : (
                                <Image className="w-3 h-3 text-white" />
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                            {caption || <span className="text-muted-foreground italic">No caption</span>}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3 text-pink-400" />
                                {likesCount}
                            </span>
                            <span className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />
                                {commentsCount}
                            </span>
                            {isReel && (
                                <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {item.reel!.views_count}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                            Reposted {formatTimeAgo(item.reposted_at)}
                        </p>
                    </div>

                    {/* Repost icon */}
                    <div className="flex items-center">
                        <Repeat2 className="w-4 h-4 text-green-500" />
                    </div>
                </div>
            </Card>
        </Link>
    );
}
