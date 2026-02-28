"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Compass, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchDialog } from "@/components/explore/search-dialog";
import { ExploreCard } from "@/components/explore/explore-card";
import { getExplore, ExploreItem } from "@/features/feed/feed.api";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

export default function ExplorePage() {
    const [searchOpen, setSearchOpen] = useState(false);
    const [items, setItems] = useState<ExploreItem[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement>(null);

    usePageTitle("Explore");

    useKeyboardShortcut(
        [{ key: "k", ctrl: true }, { key: "/" }],
        (e) => {
            e.preventDefault();
            setSearchOpen(true);
        }
    );

    const fetchExplore = useCallback(async (pageNum: number) => {
        try {
            const data = await getExplore(pageNum, 20);

            if (pageNum === 1) {
                setItems(data.items);
            } else {
                setItems((prev) => {
                    const existingIds = new Set(
                        prev.map((item) =>
                            item.type === "post" ? item.post_id : item.reel_id
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
            }

            setHasMore(data.has_more);
        } catch (err) {
            console.error("Failed to fetch explore:", err);
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchExplore(1).finally(() => setLoading(false));
    }, [fetchExplore]);

    useEffect(() => {
        if (!hasMore || loadingMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loadingMore && hasMore) {
                    setLoadingMore(true);
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchExplore(nextPage).finally(() =>
                        setLoadingMore(false)
                    );
                }
            },
            { threshold: 0.1 }
        );

        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [hasMore, loadingMore, page, fetchExplore]);

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
                <div className="flex items-center gap-3 mb-3">
                    <Compass className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-bold">Explore</h1>
                </div>

                <div
                    className="relative cursor-pointer"
                    onClick={() => setSearchOpen(true)}
                >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="Search users, posts, reels..."
                        className="pl-10 pr-16 cursor-pointer"
                        readOnly
                    />
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>
            </header>

            <div className="px-4 py-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-muted-foreground text-sm mt-3">
                            Discovering content...
                        </p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Compass className="w-16 h-16 text-muted-foreground/40 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            Nothing to explore yet
                        </h3>
                        <p className="text-muted-foreground text-sm text-center">
                            Content from new creators will appear here as the community grows.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Masonry Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 auto-rows-auto">
                            {items.map((item, index) => (
                                <ExploreCard
                                    key={
                                        item.type === "post"
                                            ? item.post_id
                                            : item.reel_id
                                    }
                                    item={item}
                                    size={
                                        index % 7 === 0
                                            ? "large"
                                            : "normal"
                                    }
                                />
                            ))}
                        </div>

                        <div
                            ref={loaderRef}
                            className="py-6 flex justify-center"
                        >
                            {loadingMore && (
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            )}
                            {!hasMore && items.length > 0 && (
                                <p className="text-muted-foreground text-sm">
                                    You&apos;ve reached the end
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>

            <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
        </div>
    );
}
