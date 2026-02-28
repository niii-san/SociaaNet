import { Comment, CommentDocument } from "../models/comment.model";
import { Post } from "../models/post.model";
import { Reel } from "../models/reel.model";
import mongoose from "mongoose";

interface ICommentsRepository {
    createComment(
        authorId: string,
        targetId: string,
        targetType: "post" | "reel",
        content: string,
        parentCommentId?: string
    ): Promise<CommentDocument>;
    deleteComment(commentId: string): Promise<boolean>;
    getCommentById(commentId: string): Promise<CommentDocument | null>;
    getCommentsByTarget(
        targetId: string,
        targetType: "post" | "reel",
        page: number,
        limit: number
    ): Promise<CommentDocument[]>;
    getReplies(
        parentCommentId: string,
        page: number,
        limit: number
    ): Promise<CommentDocument[]>;
    getRepliesCount(parentCommentId: string): Promise<number>;
    getCommentsCount(
        targetId: string,
        targetType: "post" | "reel"
    ): Promise<number>;
}

class CommentsRepository implements ICommentsRepository {
    async createComment(
        authorId: string,
        targetId: string,
        targetType: "post" | "reel",
        content: string,
        parentCommentId?: string
    ): Promise<CommentDocument> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const commentData: any = {
                author: authorId,
                target_id: targetId,
                target_type: targetType,
                content
            };

            if (parentCommentId) {
                commentData.parent_comment_id = parentCommentId;
            }

            const comment = await Comment.create([commentData], { session });

            // Only increment the target's comments_count for top-level comments
            if (!parentCommentId) {
                if (targetType === "post") {
                    await Post.findByIdAndUpdate(
                        targetId,
                        { $inc: { comments_count: 1 } },
                        { session }
                    );
                } else {
                    await Reel.findByIdAndUpdate(
                        targetId,
                        { $inc: { comments_count: 1 } },
                        { session }
                    );
                }
            }

            await session.commitTransaction();
            return comment[0];
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async deleteComment(commentId: string): Promise<boolean> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const comment = await Comment.findById(commentId).session(session);

            if (!comment) {
                await session.abortTransaction();
                return false;
            }

            // Soft delete the comment
            comment.is_deleted = true;
            await comment.save({ session });

            // Recursively soft-delete all child replies
            await this.softDeleteChildren(commentId, session);

            // Decrement the target's comments_count only for top-level comments
            if (!comment.parent_comment_id) {
                if (comment.target_type === "post") {
                    await Post.findByIdAndUpdate(
                        comment.target_id,
                        { $inc: { comments_count: -1 } },
                        { session }
                    );
                } else {
                    await Reel.findByIdAndUpdate(
                        comment.target_id,
                        { $inc: { comments_count: -1 } },
                        { session }
                    );
                }
            }

            await session.commitTransaction();
            return true;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    private async softDeleteChildren(
        parentCommentId: string,
        session: mongoose.ClientSession
    ): Promise<void> {
        const children = await Comment.find({
            parent_comment_id: parentCommentId,
            is_deleted: false
        }).session(session);

        for (const child of children) {
            child.is_deleted = true;
            await child.save({ session });
            await this.softDeleteChildren(child._id.toString(), session);
        }
    }

    async getCommentById(commentId: string): Promise<CommentDocument | null> {
        return Comment.findById(commentId).populate(
            "author",
            "username full_name avatar_key"
        );
    }

    async getCommentsByTarget(
        targetId: string,
        targetType: "post" | "reel",
        page: number = 1,
        limit: number = 20
    ): Promise<CommentDocument[]> {
        const skip = (page - 1) * limit;

        return Comment.find({
            target_id: targetId,
            target_type: targetType,
            parent_comment_id: null,
            is_deleted: false
        })
            .populate("author", "username full_name avatar_key")
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit);
    }

    async getReplies(
        parentCommentId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<CommentDocument[]> {
        const skip = (page - 1) * limit;

        return Comment.find({
            parent_comment_id: parentCommentId,
            is_deleted: false
        })
            .populate("author", "username full_name avatar_key")
            .sort({ created_at: 1 })
            .skip(skip)
            .limit(limit);
    }

    async getRepliesCount(parentCommentId: string): Promise<number> {
        return Comment.countDocuments({
            parent_comment_id: parentCommentId,
            is_deleted: false
        });
    }

    async getCommentsCount(
        targetId: string,
        targetType: "post" | "reel"
    ): Promise<number> {
        return Comment.countDocuments({
            target_id: targetId,
            target_type: targetType,
            parent_comment_id: null,
            is_deleted: false
        });
    }
}

export const commentsRepo = new CommentsRepository();
