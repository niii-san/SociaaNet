"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Clapperboard, Loader2, ChevronUp, ChevronDown, ArrowUp, ArrowDown } from "lucide-react";
import { ReelViewer } from "@/components/reels/reel-viewer";
import { getReelsFeed, FeedReel } from "@/features/feed/feed.api";
import { cn } from "@/lib/utils";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

export default function ReelsPage() {
    const [reels, setReels] = useState<FeedReel[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const isScrollingRef = useRef(false);

    usePageTitle("Reels");

    const fetchReels = useCallback(async (pageNum: number) => {
        try {
            const data = await getReelsFeed(pageNum, 10);

            if (pageNum === 1) {
                setReels(data.reels);
            } else {
                setReels((prev) => {
                    const existingIds = new Set(prev.map((r) => r.reel_id));
                    const newReels = data.reels.filter(
                        (r) => !existingIds.has(r.reel_id)
                    );
                    return [...prev, ...newReels];
                });
            }

            setHasMore(data.has_more);
        } catch (err) {
            console.error("Failed to fetch reels:", err);
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchReels(1).finally(() => setLoading(false));
    }, [fetchReels]);

    // Preload more reels when near the end
    useEffect(() => {
        if (activeIndex >= reels.length - 3 && hasMore && reels.length > 0) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchReels(nextPage);
        }
    }, [activeIndex, reels.length, hasMore, page, fetchReels]);

    const scrollToReel = useCallback(
        (index: number) => {
            if (index < 0 || index >= reels.length) return;
            if (isScrollingRef.current) return;

            isScrollingRef.current = true;
            setActiveIndex(index);

            const container = containerRef.current;
            if (container) {
                const child = container.children[index] as HTMLElement;
                if (child) {
                    child.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }

            setTimeout(() => {
                isScrollingRef.current = false;
            }, 500);
        },
        [reels.length]
    );

    // Keyboard navigation
    useKeyboardShortcut(
        [{ key: "ArrowDown" }, { key: "j" }],
        (e) => {
            e.preventDefault();
            scrollToReel(activeIndex + 1);
        }
    );

    useKeyboardShortcut(
        [{ key: "ArrowUp" }, { key: "k" }],
        (e) => {
            e.preventDefault();
            scrollToReel(activeIndex - 1);
        }
    );

    useKeyboardShortcut(
        [{ key: "m" }],
        () => setIsMuted((prev) => !prev)
    );

    // Snap scroll detection
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let scrollTimeout: NodeJS.Timeout;

        const handleScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollTop = container.scrollTop;
                const itemHeight = container.clientHeight;
                const newIndex = Math.round(scrollTop / itemHeight);
                if (newIndex !== activeIndex && newIndex >= 0 && newIndex < reels.length) {
                    setActiveIndex(newIndex);
                }
            }, 100);
        };

        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            container.removeEventListener("scroll", handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, [activeIndex, reels.length]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-white" />
                <p className="text-white/60 text-sm mt-4">
                    Loading reels...
                </p>
            </div>
        );
    }

    if (reels.length === 0) {
        return (
            <div className="min-h-screen bg-background pb-12">
                <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Clapperboard className="w-6 h-6 text-primary" />
                            <h1 className="text-2xl font-bold">Reels</h1>
                        </div>
                        <Link href="/create-reel">
                            <Button size="sm" className="gap-2">
                                <Plus className="w-4 h-4" />
                                Create
                            </Button>
                        </Link>
                    </div>
                </header>
                <div className="container max-w-2xl mx-auto px-4 py-6">
                    <div className="text-center py-16">
                        <Clapperboard className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            No reels yet
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            Short videos from creators will appear here.
                        </p>
                        <Link href="/create-reel">
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                Create Your First Reel
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-screen bg-black">
            {/* Header overlay */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-linear-to-b from-black/60 to-transparent">
                <div className="flex items-center gap-2">
                    <Clapperboard className="w-5 h-5 text-white" />
                    <h1 className="text-lg font-bold text-white">Reels</h1>
                </div>
                <Link href="/create-reel">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20 gap-1.5"
                    >
                        <Plus className="w-4 h-4" />
                        Create
                    </Button>
                </Link>
            </div>

            {/* Mobile navigation hints (center, small) */}
            <div className="lg:hidden absolute left-1/2 -translate-x-1/2 top-16 z-20 flex flex-col items-center gap-1 opacity-60">
                {activeIndex > 0 && (
                    <button
                        onClick={() => scrollToReel(activeIndex - 1)}
                        className="text-white hover:opacity-100 transition-opacity"
                    >
                        <ChevronUp className="w-6 h-6" />
                    </button>
                )}
            </div>
            <div className="lg:hidden absolute left-1/2 -translate-x-1/2 bottom-4 z-20 flex flex-col items-center gap-1 opacity-60">
                {activeIndex < reels.length - 1 && (
                    <button
                        onClick={() => scrollToReel(activeIndex + 1)}
                        className="text-white hover:opacity-100 transition-opacity"
                    >
                        <ChevronDown className="w-6 h-6" />
                    </button>
                )}
            </div>

            {/* Desktop navigation arrows (right side, Instagram-style) */}
            <div className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-3">
                <button
                    onClick={() => scrollToReel(activeIndex - 1)}
                    disabled={activeIndex === 0}
                    className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                        "bg-white/10 backdrop-blur-md border border-white/20",
                        "hover:bg-white/25 hover:scale-105 active:scale-95",
                        activeIndex === 0 && "opacity-0 pointer-events-none"
                    )}
                    aria-label="Previous reel"
                >
                    <ArrowUp className="w-5 h-5 text-white" />
                </button>
                <button
                    onClick={() => scrollToReel(activeIndex + 1)}
                    disabled={activeIndex >= reels.length - 1}
                    className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                        "bg-white/10 backdrop-blur-md border border-white/20",
                        "hover:bg-white/25 hover:scale-105 active:scale-95",
                        activeIndex >= reels.length - 1 && "opacity-0 pointer-events-none"
                    )}
                    aria-label="Next reel"
                >
                    <ArrowDown className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Reels container — vertical snap scroll */}
            <div
                ref={containerRef}
                className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-none"
                style={{ scrollbarWidth: "none" }}
            >
                {reels.map((reel, index) => (
                    <div
                        key={reel.reel_id}
                        className="h-full w-full snap-start snap-always"
                    >
                        <ReelViewer
                            reel={reel}
                            isActive={index === activeIndex}
                            isMuted={isMuted}
                            onToggleMute={() => setIsMuted((p) => !p)}
                        />
                    </div>
                ))}
            </div>

            {/* Reel counter */}
            <div className="absolute bottom-4 right-3 z-20 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                {activeIndex + 1} / {reels.length}
            </div>
        </div>
    );
}
