import { Repost, RepostDocument } from "../models/repost.model";
import { Post } from "../models/post.model";
import { Reel } from "../models/reel.model";
import mongoose from "mongoose";

interface IRepostsRepository {
    repostTarget(
        userId: string,
        targetId: string,
        targetType: "post" | "reel"
    ): Promise<RepostDocument>;
    unrepostTarget(
        userId: string,
        targetId: string,
        targetType: "post" | "reel"
    ): Promise<boolean>;
    isRepostedByUser(
        userId: string,
        targetId: string,
        targetType: "post" | "reel"
    ): Promise<boolean>;
    getRepostsByUser(
        userId: string,
        page: number,
        limit: number
    ): Promise<{ reposts: RepostDocument[]; total: number }>;
    getRepostsCount(
        targetId: string,
        targetType: "post" | "reel"
    ): Promise<number>;
}

class RepostsRepository implements IRepostsRepository {
    async repostTarget(
        userId: string,
        targetId: string,
        targetType: "post" | "reel"
    ): Promise<RepostDocument> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const repost = await Repost.create(
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
                    { $inc: { reposts_count: 1 } },
                    { session }
                );
            } else {
                await Reel.findByIdAndUpdate(
                    targetId,
                    { $inc: { reposts_count: 1 } },
                    { session }
                );
            }

            await session.commitTransaction();
            return repost[0];
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async unrepostTarget(
        userId: string,
        targetId: string,
        targetType: "post" | "reel"
    ): Promise<boolean> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const result = await Repost.findOneAndDelete(
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
                    { $inc: { reposts_count: -1 } },
                    { session }
                );
            } else {
                await Reel.findByIdAndUpdate(
                    targetId,
                    { $inc: { reposts_count: -1 } },
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

    async isRepostedByUser(
        userId: string,
        targetId: string,
        targetType: "post" | "reel"
    ): Promise<boolean> {
        const repost = await Repost.exists({
            user: userId,
            target_id: targetId,
            target_type: targetType
        });

        return !!repost;
    }

    async getRepostsByUser(
        userId: string,
        page: number = 1,
        limit: number = 20
    ): Promise<{ reposts: RepostDocument[]; total: number }> {
        const skip = (page - 1) * limit;

        const [reposts, total] = await Promise.all([
            Repost.find({ user: userId })
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit),
            Repost.countDocuments({ user: userId })
        ]);

        return { reposts, total };
    }

    async getRepostsCount(
        targetId: string,
        targetType: "post" | "reel"
    ): Promise<number> {
        return Repost.countDocuments({
            target_id: targetId,
            target_type: targetType
        });
    }

    async getAllRepostsByUser(userId: string): Promise<RepostDocument[]> {
        return Repost.find({ user: userId }).sort({ created_at: -1 });
    }
}

export const repostsRepo = new RepostsRepository();
