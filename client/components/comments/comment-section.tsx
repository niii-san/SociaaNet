"use client";

import { useEffect, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Loader2 } from "lucide-react";
import {
    CommentData,
    getPostComments,
    getReelComments,
    addPostComment,
    addReelComment,
} from "@/features/comments/comments.api";
import CommentItem from "@/components/comments/comment-item";
import { toast } from "sonner";

interface CommentSectionProps {
    targetId: string;
    targetType: "post" | "reel";
    commentsCount: number;
    currentUser: {
        avatar_url?: string | null;
        full_name?: string;
    } | null;
    onCommentsCountChange?: (newCount: number) => void;
}

export default function CommentSection({
    targetId,
    targetType,
    commentsCount: initialCommentsCount,
    currentUser,
    onCommentsCountChange,
}: CommentSectionProps) {
    const [comments, setComments] = useState<CommentData[]>([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [totalComments, setTotalComments] = useState(initialCommentsCount);
    const [loadingMore, setLoadingMore] = useState(false);

    const [commentText, setCommentText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Sync totalComments to parent via effect (avoids setState-during-render)
    useEffect(() => {
        onCommentsCountChange?.(totalComments);
    }, [totalComments, onCommentsCountChange]);

    const fetchComments = useCallback(
        async (pageNum: number = 1) => {
            try {
                const data =
                    targetType === "post"
                        ? await getPostComments(targetId, pageNum)
                        : await getReelComments(targetId, pageNum);

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
                toast.error(
                    error.response?.data?.message || "Failed to load comments"
                );
            }
        },
        [targetId, targetType]
    );

    // Load comments on mount
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await fetchComments(1);
            setLoading(false);
        };
        load();
    }, [fetchComments]);

    const handleLoadMore = async () => {
        if (loadingMore) return;
        setLoadingMore(true);
        await fetchComments(page + 1);
        setLoadingMore(false);
    };

    const handleSubmitComment = async () => {
        if (!commentText.trim() || submitting) return;

        setSubmitting(true);
        try {
            const newComment =
                targetType === "post"
                    ? await addPostComment(targetId, commentText.trim())
                    : await addReelComment(targetId, commentText.trim());

            // Add to top of list with empty replies
            const commentWithReplies: CommentData = {
                ...newComment,
                replies_count: 0,
                replies: [],
                has_more_replies: false,
            };

            setComments((prev) => [commentWithReplies, ...prev]);
            setTotalComments((prev) => prev + 1);
            setCommentText("");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Failed to post comment"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = (commentId: string) => {
        setComments((prev) => prev.filter((c) => c.comment_id !== commentId));
        setTotalComments((prev) => Math.max(0, prev - 1));
    };

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">
                Comments ({totalComments})
            </h3>

            {/* Add Comment */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                            <AvatarImage
                                src={currentUser?.avatar_url || undefined}
                            />
                            <AvatarFallback>
                                {currentUser?.full_name
                                    ?.charAt(0)
                                    .toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <textarea
                                placeholder="Add a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && e.metaKey) {
                                        e.preventDefault();
                                        handleSubmitComment();
                                    }
                                }}
                                className="w-full bg-transparent outline-none text-sm resize-none min-h-12 border rounded-lg p-3 focus:ring-1 focus:ring-ring"
                                rows={2}
                            />
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-muted-foreground">
                                    {commentText.length > 0 && `${commentText.length}/2200`}
                                </span>
                                <Button
                                    size="sm"
                                    className="font-semibold"
                                    onClick={handleSubmitComment}
                                    disabled={!commentText.trim() || submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                            Posting...
                                        </>
                                    ) : (
                                        "Post Comment"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Comments List */}
            {loading ? (
                <Card>
                    <CardContent className="p-8">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm">Loading comments...</span>
                        </div>
                    </CardContent>
                </Card>
            ) : loaded && comments.length === 0 ? (
                <Card>
                    <CardContent className="p-12">
                        <div className="text-center text-muted-foreground space-y-2">
                            <MessageCircle className="w-12 h-12 mx-auto opacity-50" />
                            <p className="font-medium">No comments yet</p>
                            <p className="text-sm">
                                Be the first to comment on this{" "}
                                {targetType}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="p-4">
                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <CommentItem
                                    key={comment.comment_id}
                                    comment={comment}
                                    onDelete={handleDeleteComment}
                                />
                            ))}
                        </div>

                        {/* Load more */}
                        {hasMore && (
                            <div className="mt-4 flex justify-center">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="text-primary"
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
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
