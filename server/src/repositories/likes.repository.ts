import { Like, LikeDocument } from "../models/like.model";
import { Post } from "../models/post.model";
import { Reel } from "../models/reel.model";
import { Comment } from "../models/comment.model";
import mongoose from "mongoose";

interface ILikesRepository {
    likeTarget(
        userId: string,
        targetId: string,
        targetType: "post" | "reel" | "comment"
    ): Promise<LikeDocument>;
    unlikeTarget(
        userId: string,
        targetId: string,
        targetType: "post" | "reel" | "comment"
    ): Promise<boolean>;
    isLikedByUser(
        userId: string,
        targetId: string,
        targetType: "post" | "reel" | "comment"
    ): Promise<boolean>;
    getLikesCount(
        targetId: string,
        targetType: "post" | "reel" | "comment"
    ): Promise<number>;
}

class LikesRepository implements ILikesRepository {
    async likeTarget(
        userId: string,
        targetId: string,
        targetType: "post" | "reel" | "comment"
    ): Promise<LikeDocument> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const like = await Like.create(
                [
                    {
                        user: userId,
                        target_id: targetId,
                        target_type: targetType
                    }
                ],
                { session }
            );

            if (targetType === "post") {
                await Post.findByIdAndUpdate(
                    targetId,
                    { $inc: { likes_count: 1 } },
                    { session }
                );
            } else if (targetType === "reel") {
                await Reel.findByIdAndUpdate(
                    targetId,
                    { $inc: { likes_count: 1 } },
                    { session }
                );
            } else {
                await Comment.findByIdAndUpdate(
                    targetId,
                    { $inc: { likes_count: 1 } },
                    { session }
                );
            }

            await session.commitTransaction();
            return like[0];
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async unlikeTarget(
        userId: string,
        targetId: string,
        targetType: "post" | "reel" | "comment"
    ): Promise<boolean> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const result = await Like.findOneAndDelete(
                {
                    user: userId,
                    target_id: targetId,
                    target_type: targetType
                },
                { session }
            );

            if (!result) {
                await session.abortTransaction();
                return false;
            }

            if (targetType === "post") {
                await Post.findByIdAndUpdate(
                    targetId,
                    { $inc: { likes_count: -1 } },
                    { session }
                );
            } else if (targetType === "reel") {
                await Reel.findByIdAndUpdate(
                    targetId,
                    { $inc: { likes_count: -1 } },
                    { session }
                );
            } else {
                await Comment.findByIdAndUpdate(
                    targetId,
                    { $inc: { likes_count: -1 } },
                    { session }
                );
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

    async isLikedByUser(
        userId: string,
        targetId: string,
        targetType: "post" | "reel" | "comment"
    ): Promise<boolean> {
        const like = await Like.exists({
            user: userId,
            target_id: targetId,
            target_type: targetType
        });

        return !!like;
    }

    async getLikesCount(
        targetId: string,
        targetType: "post" | "reel" | "comment"
    ): Promise<number> {
        const count = await Like.countDocuments({
            target_id: targetId,
            target_type: targetType
        });

        return count;
    }

    async getLikesByUser(
        userId: string,
        page: number = 1,
        limit: number = 20
    ): Promise<{ likes: LikeDocument[]; total: number }> {
        const skip = (page - 1) * limit;

        const [likes, total] = await Promise.all([
            Like.find({
                user: userId,
                target_type: { $in: ["post", "reel"] }
            })
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit),
            Like.countDocuments({
                user: userId,
                target_type: { $in: ["post", "reel"] }
            })
        ]);

        return { likes, total };
    }
}

export const likesRepo = new LikesRepository();
