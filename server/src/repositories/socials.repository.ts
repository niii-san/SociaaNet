import mongoose from "mongoose";
import { ErrorCodes } from "../constants/error-code";
import { Follow, FollowDocument, User, UserDocument } from "../models";

interface ISocialsRepository {
    followUser(followerId: string, followeeId: string): Promise<FollowDocument>;
    unfollowUser(
        followerId: string,
        followeeId: string
    ): Promise<{ followerId: string; followeeId: string }>;
    isFollowing(followerId: string, followeeId: string): Promise<boolean>;
}

class SocialsRepository implements ISocialsRepository {
    private increaseFollowerCount(
        userId: string,
        session: mongoose.ClientSession
    ) {
        return User.findByIdAndUpdate(
            userId,
            { $inc: { followers_count: 1 } },
            { session, new: true }
        );
    }
    private decreaseFollowerCount(
        userId: string,
        session: mongoose.ClientSession
    ) {
        return User.findByIdAndUpdate(
            userId,
            { $inc: { followers_count: -1 } },
            { session, new: true }
        );
    }

    private increaseFollowingCount(
        userId: string,
        session: mongoose.ClientSession
    ) {
        return User.findByIdAndUpdate(
            userId,
            { $inc: { following_count: 1 } },
            { session, new: true }
        );
    }
    private decreaseFollowingCount(
        userId: string,
        session: mongoose.ClientSession
    ) {
        return User.findByIdAndUpdate(
            userId,
            { $inc: { following_count: -1 } },
            { session, new: true }
        );
    }

    async isFollowing(
        followerId: string,
        followeeId: string
    ): Promise<boolean> {
        const follow = await Follow.findOne({
            follower: followerId,
            following: followeeId,
            status: "accepted",
            is_removed: false
        });

        return !!follow;
    }

    async followUser(
        followerId: string,
        followeeId: string
    ): Promise<FollowDocument> {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const follow = new Follow({
                follower: followerId,
                following: followeeId,
                status: "accepted",
                accepted_at: new Date()
            });

            await follow.save({ session });

            await this.increaseFollowerCount(followeeId, session);
            await this.increaseFollowingCount(followerId, session);

            await session.commitTransaction();
            return follow;
        } finally {
            await session.endSession();
        }
    }

    async unfollowUser(
        followerId: string,
        followeeId: string
    ): Promise<{ followerId: string; followeeId: string }> {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            await Follow.findOneAndUpdate(
                {
                    follower: followerId,
                    following: followeeId,
                    status: "accepted"
                },
                {
                    is_removed: true,
                    removed_at: new Date(),
                    removed_by: new mongoose.Types.ObjectId(followerId)
                },
                { session, new: true }
            );

            await this.decreaseFollowerCount(followeeId, session);
            await this.decreaseFollowingCount(followerId, session);

            await session.commitTransaction();

            return { followerId, followeeId };
        } finally {
            await session.endSession();
        }
    }
}

export const socialsRepo = new SocialsRepository();
