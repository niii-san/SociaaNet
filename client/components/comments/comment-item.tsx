"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import {
    CommentData,
    likeComment,
    unlikeComment,
    deleteComment,
    replyToComment,
    getCommentReplies,
} from "@/features/comments/comments.api";
import { toast } from "sonner";

interface CommentItemProps {
    comment: CommentData;
    onDelete?: (commentId: string) => void;
    depth?: number;
}

const MAX_INDENT_DEPTH = 4;

export default function CommentItem({
    comment,
    onDelete,
    depth = 0,
}: CommentItemProps) {
    const [isLiked, setIsLiked] = useState(comment.is_liked_by_current_user);
    const [likesCount, setLikesCount] = useState(comment.likes_count);
    const [likingInProgress, setLikingInProgress] = useState(false);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [submittingReply, setSubmittingReply] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Replies state
    const [replies, setReplies] = useState<CommentData[]>(comment.replies || []);
    const [repliesCount, setRepliesCount] = useState(comment.replies_count || 0);
    const [showReplies, setShowReplies] = useState((comment.replies?.length || 0) > 0);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [repliesPage, setRepliesPage] = useState(1);
    const [hasMoreReplies, setHasMoreReplies] = useState(comment.has_more_replies || false);

    const handleLikeToggle = async () => {
        if (likingInProgress) return;

        setLikingInProgress(true);
        const prevLiked = isLiked;
        const prevCount = likesCount;
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

        try {
            if (prevLiked) {
                await unlikeComment(comment.comment_id);
            } else {
                await likeComment(comment.comment_id);
            }
        } catch (error: any) {
            setIsLiked(prevLiked);
            setLikesCount(prevCount);
            toast.error(error.response?.data?.message || "Failed to update like");
        } finally {
            setLikingInProgress(false);
        }
    };

    const handleSubmitReply = async () => {
        if (!replyContent.trim() || submittingReply) return;

        setSubmittingReply(true);
        try {
            const reply = await replyToComment(comment.comment_id, replyContent.trim());
            setReplies((prev) => [...prev, reply]);
            setRepliesCount((prev) => prev + 1);
            setShowReplies(true);
            setReplyContent("");
            setShowReplyInput(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to post reply");
        } finally {
            setSubmittingReply(false);
        }
    };

    const handleDelete = async () => {
        if (deleting) return;

        setDeleting(true);
        try {
            await deleteComment(comment.comment_id);
            onDelete?.(comment.comment_id);
            toast.success("Comment deleted");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete comment");
        } finally {
            setDeleting(false);
        }
    };

    const handleLoadMoreReplies = async () => {
        if (loadingReplies) return;

        setLoadingReplies(true);
        try {
            const nextPage = repliesPage + 1;
            const data = await getCommentReplies(comment.comment_id, nextPage, 10);
            setReplies((prev) => [...prev, ...data.replies]);
            setRepliesPage(nextPage);
            setHasMoreReplies(data.has_more);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to load replies");
        } finally {
            setLoadingReplies(false);
        }
    };

    const handleToggleReplies = async () => {
        if (showReplies) {
            setShowReplies(false);
            return;
        }

        // If we haven't loaded replies yet, load them
        if (replies.length === 0 && repliesCount > 0) {
            setLoadingReplies(true);
            try {
                const data = await getCommentReplies(comment.comment_id, 1, 10);
                setReplies(data.replies);
                setRepliesPage(1);
                setHasMoreReplies(data.has_more);
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Failed to load replies");
            } finally {
                setLoadingReplies(false);
            }
        }

        setShowReplies(true);
    };

    const handleDeleteReply = (replyId: string) => {
        setReplies((prev) => prev.filter((r) => r.comment_id !== replyId));
        setRepliesCount((prev) => Math.max(0, prev - 1));
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInSeconds = Math.floor(diffInMs / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInWeeks = Math.floor(diffInDays / 7);

        if (diffInSeconds < 60) return "just now";
        if (diffInMinutes < 60) return `${diffInMinutes}m`;
        if (diffInHours < 24) return `${diffInHours}h`;
        if (diffInDays < 7) return `${diffInDays}d`;
        if (diffInWeeks < 52) return `${diffInWeeks}w`;
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    // Cap visual indentation but still allow nesting
    const indentClass = depth > 0 && depth <= MAX_INDENT_DEPTH ? "ml-10" : depth > MAX_INDENT_DEPTH ? "ml-4" : "";

    return (
        <div className={indentClass}>
            <div className="flex gap-3 group">
                {/* Avatar */}
                <Avatar className="w-8 h-8 shrink-0">
                    <AvatarImage src={comment.author.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">
                        {comment.author.full_name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">
                            {comment.author.username}
                        </span>
                        {comment.is_author && (
                            <Badge
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0 h-4 font-medium"
                            >
                                Author
                            </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(comment.created_at)}
                        </span>
                    </div>

                    {/* Comment text */}
                    <p className="text-sm mt-0.5">
                        {comment.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-1.5">
                            {/* Like */}
                            <button
                                onClick={handleLikeToggle}
                                disabled={likingInProgress}
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                            >
                                <Heart
                                    className={`w-3.5 h-3.5 ${
                                        isLiked ? "fill-red-500 text-red-500" : ""
                                    }`}
                                />
                                {likesCount > 0 && (
                                    <span className={isLiked ? "text-red-500 font-medium" : ""}>
                                        {likesCount}
                                    </span>
                                )}
                            </button>

                            {/* Reply */}
                            <button
                                onClick={() => setShowReplyInput(!showReplyInput)}
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>Reply</span>
                            </button>

                            {/* Delete */}
                            {comment.is_comment_author && (
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                    {/* Reply input */}
                    {showReplyInput && (
                        <div className="mt-3 flex gap-2">
                            <input
                                type="text"
                                placeholder={`Reply to @${comment.author.username}...`}
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmitReply();
                                    }
                                }}
                                className="flex-1 bg-transparent text-sm border rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-ring"
                                autoFocus
                            />
                            <Button
                                size="sm"
                                onClick={handleSubmitReply}
                                disabled={!replyContent.trim() || submittingReply}
                                className="text-xs h-8"
                            >
                                {submittingReply ? "..." : "Reply"}
                            </Button>
                        </div>
                    )}

                    {/* View replies toggle */}
                    {repliesCount > 0 && (
                        <button
                            onClick={handleToggleReplies}
                            className="flex items-center gap-1 mt-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            <div className="w-6 h-px bg-muted-foreground/40" />
                            {loadingReplies ? (
                                <span>Loading...</span>
                            ) : showReplies ? (
                                <>
                                    <span>Hide replies</span>
                                    <ChevronUp className="w-3 h-3" />
                                </>
                            ) : (
                                <>
                                    <span>
                                        View {repliesCount}{" "}
                                        {repliesCount === 1 ? "reply" : "replies"}
                                    </span>
                                    <ChevronDown className="w-3 h-3" />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Replies list */}
            {showReplies && replies.length > 0 && (
                <div className="mt-3 space-y-3">
                    {replies.map((reply) => (
                        <CommentItem
                            key={reply.comment_id}
                            comment={reply}
                            onDelete={handleDeleteReply}
                            depth={depth + 1}
                        />
                    ))}

                    {hasMoreReplies && (
                        <button
                            onClick={handleLoadMoreReplies}
                            disabled={loadingReplies}
                            className="ml-10 flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                        >
                            <div className="w-6 h-px bg-muted-foreground/40" />
                            <span>{loadingReplies ? "Loading..." : "Load more replies"}</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
