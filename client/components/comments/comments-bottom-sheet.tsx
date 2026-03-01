"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, Loader2, MessageCircle, Send } from "lucide-react";
import {
    CommentData,
    getReelComments,
    addReelComment,
} from "@/features/comments/comments.api";
import CommentItem from "@/components/comments/comment-item";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CommentsBottomSheetProps {
    open: boolean;
    onClose: () => void;
    reelId: string;
    commentsCount: number;
    currentUser: {
        avatar_url?: string | null;
        full_name?: string;
    } | null;
    onCommentsCountChange?: (count: number) => void;
}

export function CommentsBottomSheet({
    open,
    onClose,
    reelId,
    commentsCount: initialCount,
    currentUser,
    onCommentsCountChange,
}: CommentsBottomSheetProps) {
    const [comments, setComments] = useState<CommentData[]>([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [totalComments, setTotalComments] = useState(initialCount);
    const [loadingMore, setLoadingMore] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [visible, setVisible] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);
    const dragStartY = useRef<number | null>(null);
    const [dragOffset, setDragOffset] = useState(0);

    // Animate in/out
    useEffect(() => {
        if (open) {
            // Prevent body scroll
            document.body.style.overflow = "hidden";
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setVisible(true));
            });
            // Reset and load
            setComments([]);
            setLoaded(false);
            setPage(1);
        } else {
            setVisible(false);
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    // Fetch comments
    const fetchComments = useCallback(
        async (pageNum: number) => {
            try {
                const data = await getReelComments(reelId, pageNum);
                if (pageNum === 1) {
                    setComments(data.comments);
                } else {
                    setComments((prev) => [...prev, ...data.comments]);
                }
                setTotalComments(data.total);
                setHasMore(data.has_more);
                setPage(pageNum);
                setLoaded(true);
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Failed to load comments");
            }
        },
        [reelId]
    );

    useEffect(() => {
        if (open && !loaded) {
            setLoading(true);
            fetchComments(1).finally(() => setLoading(false));
        }
    }, [open, loaded, fetchComments]);

    useEffect(() => {
        onCommentsCountChange?.(totalComments);
    }, [totalComments, onCommentsCountChange]);

    const handleLoadMore = async () => {
        if (loadingMore) return;
        setLoadingMore(true);
        await fetchComments(page + 1);
        setLoadingMore(false);
    };

    const handleSubmit = async () => {
        if (!commentText.trim() || submitting) return;
        setSubmitting(true);
        try {
            const newComment = await addReelComment(reelId, commentText.trim());
            const commentWithReplies: CommentData = {
                ...newComment,
                replies_count: 0,
                replies: [],
                has_more_replies: false,
            };
            setComments((prev) => [commentWithReplies, ...prev]);
            setTotalComments((prev) => prev + 1);
            setCommentText("");
            // Scroll to top to show new comment
            scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to post comment");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (commentId: string) => {
        setComments((prev) => prev.filter((c) => c.comment_id !== commentId));
        setTotalComments((prev) => Math.max(0, prev - 1));
    };

    // Drag to dismiss
    const handleTouchStart = (e: React.TouchEvent) => {
        const target = e.target as HTMLElement;
        // Only allow drag from the handle area
        if (target.closest("[data-drag-handle]")) {
            dragStartY.current = e.touches[0].clientY;
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (dragStartY.current === null) return;
        const diff = e.touches[0].clientY - dragStartY.current;
        if (diff > 0) {
            setDragOffset(diff);
        }
    };

    const handleTouchEnd = () => {
        if (dragStartY.current === null) return;
        if (dragOffset > 100) {
            onClose();
        }
        setDragOffset(0);
        dragStartY.current = null;
    };

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-50 bg-black/60 transition-opacity duration-300",
                    visible ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />

            {/* Sheet */}
            <div
                ref={sheetRef}
                className={cn(
                    "fixed inset-x-0 bottom-0 z-50 flex flex-col bg-background rounded-t-2xl transition-transform duration-300 ease-out",
                    visible ? "translate-y-0" : "translate-y-full"
                )}
                style={{
                    maxHeight: "75vh",
                    transform: visible
                        ? `translateY(${dragOffset}px)`
                        : "translateY(100%)",
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Drag Handle */}
                <div data-drag-handle className="flex flex-col items-center pt-2 pb-1 cursor-grab">
                    <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                    <h3 className="font-semibold text-base">
                        Comments {totalComments > 0 && `(${totalComments})`}
                    </h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Comments list */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-4 py-3">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : loaded && comments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <MessageCircle className="w-12 h-12 opacity-40 mb-3" />
                            <p className="font-medium">No comments yet</p>
                            <p className="text-sm mt-1">Be the first to comment</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <CommentItem
                                    key={comment.comment_id}
                                    comment={comment}
                                    onDelete={handleDelete}
                                />
                            ))}
                            {hasMore && (
                                <div className="flex justify-center py-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                        className="text-primary text-sm"
                                    >
                                        {loadingMore ? (
                                            <>
                                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                                Loading...
                                            </>
                                        ) : (
                                            "Load more comments"
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Comment input */}
                <div className="border-t border-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                    <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 shrink-0">
                            <AvatarImage src={currentUser?.avatar_url || undefined} />
                            <AvatarFallback className="text-xs">
                                {currentUser?.full_name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 relative">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Add a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleSubmit();
                                    }
                                }}
                                className="w-full bg-muted/50 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-ring pr-10"
                            />
                        </div>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleSubmit}
                            disabled={!commentText.trim() || submitting}
                            className="shrink-0 h-8 w-8"
                        >
                            {submitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4 text-primary" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
