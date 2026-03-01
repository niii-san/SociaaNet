"use client";

import { useEffect, useState, useCallback } from "react";
import { getCommentHistory, CommentHistoryItem, PaginatedResponse } from "@/features/activities/history.api";
import { MiniLoader } from "@/components/ui/mini-loader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Image, Film, Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getRelativeTime } from "@/components/ui/time-ago";

export default function CommentHistoryPage() {
    const [data, setData] = useState<PaginatedResponse<CommentHistoryItem> | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);

    const fetchComments = useCallback(async (pageNum: number, append = false) => {
        try {
            const result = await getCommentHistory(pageNum, 20);
            if (append && data) {
                setData({
                    ...result,
                    items: [...data.items, ...result.items],
                });
            } else {
                setData(result);
            }
        } catch (error: any) {
            console.error("Failed to fetch comment history:", error);
            toast.error(error?.response?.data?.message || "Failed to load comment history");
        }
    }, [data]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await fetchComments(1);
            setLoading(false);
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLoadMore = async () => {
        const nextPage = page + 1;
        setLoadingMore(true);
        await fetchComments(nextPage, true);
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
        <div className="min-h-screen bg-background pb-16 lg:pb-12">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
                <div className="flex items-center gap-3">
                    <Link href="/settings/activities" className="text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <MessageSquare className="w-6 h-6 text-blue-500" />
                    <h1 className="text-2xl font-bold">Comment History</h1>
                    {data && (
                        <span className="text-sm text-muted-foreground ml-auto">
                            {data.total} {data.total === 1 ? "comment" : "comments"}
                        </span>
                    )}
                </div>
            </header>

            <div className="container max-w-3xl mx-auto px-4 py-6 space-y-3">
                {!data || data.items.length === 0 ? (
                    <div className="text-center py-16">
                        <MessageSquare className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                        <p className="text-lg font-medium text-muted-foreground">No comments yet</p>
                        <p className="text-sm text-muted-foreground/70 mt-1">
                            Your comments on posts and reels will appear here
                        </p>
                    </div>
                ) : (
                    <>
                        {data.items.map((item, index) => (
                            <CommentHistoryCard key={`${item.comment_id}-${index}`} item={item} />
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

function CommentHistoryCard({ item }: { item: CommentHistoryItem }) {
    const isPost = item.target_type === "post";
    const href = isPost ? `/posts/${item.target_id}` : `/reels/${item.target_id}`;

    return (
        <Link href={href}>
            <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group">
                <div className="flex gap-4">
                    {/* Target thumbnail */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                        {item.target?.media_url ? (
                            <img
                                src={item.target.media_url}
                                alt={item.target.caption || "Media"}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Image className="w-6 h-6 text-muted-foreground/40" />
                            </div>
                        )}
                        {/* Type badge */}
                        <div className="absolute top-1 right-1 bg-black/60 rounded p-0.5">
                            {isPost ? (
                                <Image className="w-3 h-3 text-white" />
                            ) : (
                                <Film className="w-3 h-3 text-white" />
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{item.content}</p>
                        {item.target && (
                            <p className="text-xs text-muted-foreground truncate mt-1">
                                on: {item.target.caption || <span className="italic">No caption</span>}
                            </p>
                        )}
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3 text-pink-400" />
                                {item.likes_count}
                            </span>
                            <span>{getRelativeTime(item.created_at)}</span>
                        </div>
                    </div>

                    {/* Comment icon */}
                    <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                    </div>
                </div>
            </Card>
        </Link>
    );
}
