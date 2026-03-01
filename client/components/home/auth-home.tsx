"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, TrendingUp } from "lucide-react";
import { getHomeFeed, FeedItem } from "@/features/feed/feed.api";
import { PostCard } from "@/components/feed/post-card";
import { FeedReelCard } from "@/components/feed/feed-reel-card";
import { CaughtUpDivider } from "@/components/feed/caught-up-divider";
import { usePageTitle } from "@/hooks/usePageTitle";

export function AuthHome() {
    const [items, setItems] = useState<FeedItem[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [caughtUpIndex, setCaughtUpIndex] = useState<number | null>(null);
    const [showCaughtUp, setShowCaughtUp] = useState(false);
    const [isFallback, setIsFallback] = useState(false);
    const loaderRef = useRef<HTMLDivElement>(null);

    usePageTitle("Home");

    const fetchFeed = useCallback(
        async (pageNum: number) => {
            try {
                const data = await getHomeFeed(pageNum, 10);

                if (pageNum === 1) {
                    setItems(data.items);
                    setCaughtUpIndex(data.caught_up_at_index);
                    setShowCaughtUp(data.show_caught_up_divider);
                    setIsFallback(data.is_fallback);
                } else {
                    setItems((prev) => {
                        const existingIds = new Set(
                            prev.map((item) =>
                                item.type === "post"
                                    ? item.post_id
                                    : item.reel_id
                            )
                        );
                        const newItems = data.items.filter((item) => {
                            const id =
                                item.type === "post"
                                    ? item.post_id
                                    : item.reel_id;
                            return !existingIds.has(id);
                        });
                        return [...prev, ...newItems];
                    });

                    if (
                        data.show_caught_up_divider &&
                        data.caught_up_at_index !== null &&
                        !showCaughtUp
                    ) {
                        setCaughtUpIndex(
                            items.length + (data.caught_up_at_index ?? 0)
                        );
                        setShowCaughtUp(true);
                    }
                }

                setHasMore(data.has_more);
            } catch (err) {
                console.error("Failed to fetch feed:", err);
            }
        },
        [items.length, showCaughtUp]
    );

    // Initial load
    useEffect(() => {
        setLoading(true);
        fetchFeed(1).finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Infinite scroll
    useEffect(() => {
        if (!hasMore || loadingMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loadingMore && hasMore) {
                    setLoadingMore(true);
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchFeed(nextPage).finally(() => setLoadingMore(false));
                }
            },
            { threshold: 0.1 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loadingMore, page, fetchFeed]);

    return (
        <>
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
                <h1 className="text-xl font-bold">Home</h1>
            </header>

            {/* Feed */}
            <div className="min-h-screen">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-muted-foreground text-sm mt-3">
                            Loading your feed...
                        </p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-lg font-semibold mb-2">
                            Your feed is empty
                        </h3>
                        <p className="text-muted-foreground text-sm text-center max-w-sm">
                            Follow some people to see their posts here, or
                            create your first post!
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Fallback banner when showing trending posts */}
                        {isFallback && (
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/30">
                                <TrendingUp className="w-5 h-5 text-primary shrink-0" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Trending posts
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Follow people to personalize your feed
                                    </p>
                                </div>
                            </div>
                        )}

                        {items.map((item, index) => {
                            const key =
                                item.type === "post"
                                    ? item.post_id
                                    : item.reel_id;

                            return (
                                <div key={key}>
                                    {/* Suggested label for suggested posts */}
                                    {item.type === "post" &&
                                        item.is_suggested && (
                                            <div className="px-4 pt-3 pb-1">
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    Suggested for you
                                                </p>
                                            </div>
                                        )}

                                    {item.type === "post" ? (
                                        <PostCard post={item} />
                                    ) : (
                                        <FeedReelCard reel={item} />
                                    )}

                                    {showCaughtUp &&
                                        caughtUpIndex !== null &&
                                        index === caughtUpIndex - 1 && (
                                            <CaughtUpDivider />
                                        )}
                                </div>
                            );
                        })}

                        {/* Infinite scroll trigger */}
                        <div ref={loaderRef} className="py-6 flex justify-center">
                            {loadingMore && (
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            )}
                            {!hasMore && items.length > 0 && (
                                <p className="text-muted-foreground text-sm">
                                    No more posts to show
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
