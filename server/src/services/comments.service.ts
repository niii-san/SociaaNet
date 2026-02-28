import { isValidObjectId, Types } from "mongoose";
import { ErrorCodes } from "../constants/error-code";
import { commentsRepo } from "../repositories/comments.repository";
import { likesRepo } from "../repositories/likes.repository";
import { filesRepo, activityRepo } from "../repositories";
import { ActivityVerb } from "../types";
import {
    HttpError,
    convertImageKeyToImageUrl,
    convertThumbnailKeytoThumbnailUrl
} from "../utils";
import { notificationService } from "./notification.service";

class CommentsService {
    async addComment(
        targetId: string,
        targetType: "post" | "reel",
        content: string,
        userId: string
    ) {
        if (!isValidObjectId(targetId)) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                `Invalid ${targetType} ID`
            );
        }

        if (!content || content.trim().length === 0) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Comment content is required"
            );
        }

        if (content.length > 2200) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Comment cannot exceed 2200 characters"
            );
        }

        // Verify the target exists
        const target =
            targetType === "post"
                ? await filesRepo.getPostById(targetId)
                : await filesRepo.getReelById(targetId);

        if (!target) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                `${targetType === "post" ? "Post" : "Reel"} not found`
            );
        }

        const comment = await commentsRepo.createComment(
            userId,
            targetId,
            targetType,
            content.trim()
        );

        await activityRepo.createActivity({
            verb: ActivityVerb.comment_created,
            actor: {
                user_id: new Types.ObjectId(userId)
            },
            target: {
                ...(targetType === "post"
                    ? { post_id: new Types.ObjectId(targetId) }
                    : { reel_id: new Types.ObjectId(targetId) }),
                comment_id: comment._id
            },
            visibility: "public"
        });

        // Return populated comment
        const populated = await commentsRepo.getCommentById(
            comment._id.toString()
        );

        // Notify the post/reel author about the comment
        await notificationService.notify({
            recipientId: target.author.toString(),
            senderId: userId,
            type: targetType === "post" ? "comment_post" : "comment_reel",
            targetId: targetId,
            targetType: targetType
        });

        return this.formatCommentWithReplies(
            populated!,
            target.author.toString(),
            userId
        );
    }

    async replyToComment(
        commentId: string,
        content: string,
        userId: string
    ) {
        if (!isValidObjectId(commentId)) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid comment ID"
            );
        }

        if (!content || content.trim().length === 0) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Reply content is required"
            );
        }

        if (content.length > 2200) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Reply cannot exceed 2200 characters"
            );
        }

        const parentComment = await commentsRepo.getCommentById(commentId);

        if (!parentComment) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Comment not found"
            );
        }

        if (parentComment.is_deleted) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Cannot reply to a deleted comment"
            );
        }

        const reply = await commentsRepo.createComment(
            userId,
            parentComment.target_id.toString(),
            parentComment.target_type,
            content.trim(),
            commentId
        );

        await activityRepo.createActivity({
            verb: ActivityVerb.comment_created,
            actor: {
                user_id: new Types.ObjectId(userId)
            },
            target: {
                comment_id: reply._id
            },
            visibility: "public"
        });

        const populated = await commentsRepo.getCommentById(
            reply._id.toString()
        );

        // Notify the parent comment author about the reply
        await notificationService.notify({
            recipientId: parentComment.author.toString(),
            senderId: userId,
            type: "reply_comment",
            targetId: parentComment.target_id.toString(),
            targetType: parentComment.target_type
        });

        // Get target author for author label
        const target =
            parentComment.target_type === "post"
                ? await filesRepo.getPostById(
                      parentComment.target_id.toString()
                  )
                : await filesRepo.getReelById(
                      parentComment.target_id.toString()
                  );

        const targetAuthorId = target?.author.toString() || "";

        return this.formatCommentWithReplies(
            populated!,
            targetAuthorId,
            userId
        );
    }

    async deleteComment(commentId: string, userId: string) {
        if (!isValidObjectId(commentId)) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid comment ID"
            );
        }

        const comment = await commentsRepo.getCommentById(commentId);

        if (!comment) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Comment not found"
            );
        }

        if (comment.is_deleted) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Comment is already deleted"
            );
        }

        // Only the comment author or the target author can delete
        const target =
            comment.target_type === "post"
                ? await filesRepo.getPostById(comment.target_id.toString())
                : await filesRepo.getReelById(comment.target_id.toString());

        const isCommentAuthor = comment.author._id
            ? comment.author._id.toString() === userId
            : comment.author.toString() === userId;

        const isTargetAuthor = target?.author.toString() === userId;

        if (!isCommentAuthor && !isTargetAuthor) {
            throw new HttpError(
                403,
                false,
                ErrorCodes.FORBIDDEN,
                "You do not have permission to delete this comment"
            );
        }

        await commentsRepo.deleteComment(commentId);

        await activityRepo.createActivity({
            verb: ActivityVerb.comment_deleted,
            actor: {
                user_id: new Types.ObjectId(userId)
            },
            target: {
                comment_id: new Types.ObjectId(commentId)
            },
            visibility: "private"
        });

        return { comment_id: commentId };
    }

    async getComments(
        targetId: string,
        targetType: "post" | "reel",
        userId: string,
        page: number = 1,
        limit: number = 20
    ) {
        if (!isValidObjectId(targetId)) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                `Invalid ${targetType} ID`
            );
        }

        const target =
            targetType === "post"
                ? await filesRepo.getPostById(targetId)
                : await filesRepo.getReelById(targetId);

        if (!target) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                `${targetType === "post" ? "Post" : "Reel"} not found`
            );
        }

        const targetAuthorId = target.author.toString();

        const comments = await commentsRepo.getCommentsByTarget(
            targetId,
            targetType,
            page,
            limit
        );

        const totalComments = await commentsRepo.getCommentsCount(
            targetId,
            targetType
        );

        const formattedComments = await Promise.all(
            comments.map(async (comment) => {
                const formatted = await this.formatCommentWithReplies(
                    comment,
                    targetAuthorId,
                    userId
                );
                return formatted;
            })
        );

        return {
            comments: formattedComments,
            total: totalComments,
            page,
            limit,
            has_more: page * limit < totalComments
        };
    }

    async getReplies(
        commentId: string,
        userId: string,
        page: number = 1,
        limit: number = 10
    ) {
        if (!isValidObjectId(commentId)) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid comment ID"
            );
        }

        const parentComment = await commentsRepo.getCommentById(commentId);

        if (!parentComment) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Comment not found"
            );
        }

        const target =
            parentComment.target_type === "post"
                ? await filesRepo.getPostById(
                      parentComment.target_id.toString()
                  )
                : await filesRepo.getReelById(
                      parentComment.target_id.toString()
                  );

        const targetAuthorId = target?.author.toString() || "";

        const replies = await commentsRepo.getReplies(commentId, page, limit);
        const totalReplies = await commentsRepo.getRepliesCount(commentId);

        const formattedReplies = await Promise.all(
            replies.map(async (reply) => {
                return this.formatCommentWithReplies(
                    reply,
                    targetAuthorId,
                    userId
                );
            })
        );

        return {
            replies: formattedReplies,
            total: totalReplies,
            page,
            limit,
            has_more: page * limit < totalReplies
        };
    }

    async likeComment(commentId: string, userId: string) {
        if (!isValidObjectId(commentId)) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid comment ID"
            );
        }

        const comment = await commentsRepo.getCommentById(commentId);

        if (!comment) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Comment not found"
            );
        }

        if (comment.is_deleted) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Cannot like a deleted comment"
            );
        }

        const alreadyLiked = await likesRepo.isLikedByUser(
            userId,
            commentId,
            "comment"
        );

        if (alreadyLiked) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.DUPLICATE,
                "You have already liked this comment"
            );
        }

        const like = await likesRepo.likeTarget(userId, commentId, "comment");

        // Notify comment author
        await notificationService.notify({
            recipientId: comment.author.toString(),
            senderId: userId,
            type: "like_comment",
            targetId: comment.target_id.toString(),
            targetType: comment.target_type
        });

        return {
            like_id: like._id.toString(),
            comment_id: commentId,
            likes_count: comment.likes_count + 1
        };
    }

    async unlikeComment(commentId: string, userId: string) {
        if (!isValidObjectId(commentId)) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid comment ID"
            );
        }

        const comment = await commentsRepo.getCommentById(commentId);

        if (!comment) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Comment not found"
            );
        }

        const isLiked = await likesRepo.isLikedByUser(
            userId,
            commentId,
            "comment"
        );

        if (!isLiked) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "You have not liked this comment"
            );
        }

        await likesRepo.unlikeTarget(userId, commentId, "comment");

        // Remove like notification
        await notificationService.removeNotification({
            senderId: userId,
            recipientId: comment.author.toString(),
            type: "like_comment",
            targetId: comment.target_id.toString()
        });

        return {
            comment_id: commentId,
            likes_count: Math.max(0, comment.likes_count - 1)
        };
    }

    async getCommentHistory(userId: string, page: number, limit: number) {
        const { comments, total } = await commentsRepo.getCommentsByUser(
            userId,
            page,
            limit
        );

        const items = [];

        for (const comment of comments) {
            const targetId = comment.target_id.toString();
            let target: {
                caption: string;
                media_url: string | null;
            } | null = null;

            if (comment.target_type === "post") {
                const post = await filesRepo.getPostById(targetId);
                if (post) {
                    target = {
                        caption: post.caption,
                        media_url:
                            post.media_keys.length > 0
                                ? convertImageKeyToImageUrl(post.media_keys[0])
                                : null
                    };
                }
            } else if (comment.target_type === "reel") {
                const reel = await filesRepo.getReelById(targetId);
                if (reel) {
                    target = {
                        caption: reel.caption,
                        media_url: convertThumbnailKeytoThumbnailUrl(
                            reel.thumbnail_key
                        )
                    };
                }
            }

            items.push({
                comment_id: comment._id.toString(),
                content: comment.content,
                target_type: comment.target_type,
                target_id: targetId,
                likes_count: comment.likes_count,
                created_at: comment.created_at,
                target
            });
        }

        return {
            items,
            total,
            page,
            limit,
            total_pages: Math.ceil(total / limit)
        };
    }

    // Private helpers

    private async formatComment(
        comment: any,
        targetAuthorId: string,
        currentUserId: string
    ) {
        const authorData = comment.author;
        const authorId = authorData._id
            ? authorData._id.toString()
            : authorData.toString();

        const isAuthor = authorId === targetAuthorId;
        const isCommentAuthor = authorId === currentUserId;

        const isLikedByCurrentUser = await likesRepo.isLikedByUser(
            currentUserId,
            comment._id.toString(),
            "comment"
        );

        return {
            comment_id: comment._id.toString(),
            author: {
                user_id: authorId,
                username: authorData.username || "",
                full_name: authorData.full_name || "",
                avatar_url: authorData.avatar_key
                    ? convertImageKeyToImageUrl(authorData.avatar_key)
                    : null
            },
            content: comment.content,
            is_author: isAuthor,
            is_comment_author: isCommentAuthor,
            likes_count: comment.likes_count,
            is_liked_by_current_user: isLikedByCurrentUser,
            created_at: comment.created_at
        };
    }

    private async formatCommentWithReplies(
        comment: any,
        targetAuthorId: string,
        currentUserId: string
    ) {
        const formatted = await this.formatComment(
            comment,
            targetAuthorId,
            currentUserId
        );

        const repliesCount = await commentsRepo.getRepliesCount(
            comment._id.toString()
        );

        // Load the first few replies
        let replies: any[] = [];
        if (repliesCount > 0) {
            const replyDocs = await commentsRepo.getReplies(
                comment._id.toString(),
                1,
                3
            );
            // Recursively format each reply with its own children
            replies = await Promise.all(
                replyDocs.map((reply) =>
                    this.formatCommentWithReplies(
                        reply,
                        targetAuthorId,
                        currentUserId
                    )
                )
            );
        }

        return {
            ...formatted,
            replies_count: repliesCount,
            replies,
            has_more_replies: repliesCount > 3
        };
    }
}

export const commentsService = new CommentsService();
