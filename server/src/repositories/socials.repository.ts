import mongoose from "mongoose";
import { ErrorCodes } from "../constants/error-code";
import { Follow, FollowDocument, User, UserDocument } from "../models";
import { convertImageKeyToImageUrl } from "../utils";

interface ISocialsRepository {
    followUser(followerId: string, followeeId: string): Promise<FollowDocument>;
    unfollowUser(
        followerId: string,
        followeeId: string
    ): Promise<{ followerId: string; followeeId: string }>;
    isFollowing(followerId: string, followeeId: string): Promise<boolean>;
    getAllFollowers(userId: string): Promise<Partial<UserDocument>[]>;
    getAllFollowings(userId: string): Promise<Partial<UserDocument>[]>;
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
                    status: "accepted",
                    is_removed: false
                },
                {
                    is_removed: true,
                    removed_at: new Date(),
                    removed_by: new mongoose.Types.ObjectId(followerId)
                },
                { session }
            );

            await this.decreaseFollowerCount(followeeId, session);
            await this.decreaseFollowingCount(followerId, session);

            await session.commitTransaction();

            return { followerId, followeeId };
        } finally {
            await session.endSession();
        }
    }

    async getAllFollowers(userId: string): Promise<Partial<UserDocument>[]> {
        const followers = await Follow.find({
            following: userId,
            status: "accepted",
            is_removed: false
        }).populate<{ follower: UserDocument }>("follower");

        return followers.map((f) => {
            return {
                _id: f.follower._id,
                username: f.follower.username,
                fullname: f.follower.full_name,
                avatar_url: f.follower.avatar_key
                    ? convertImageKeyToImageUrl(f.follower.avatar_key)
                    : null
            };
        });
    }

    async getAllFollowings(userId: string): Promise<Partial<UserDocument>[]> {
        const followings = await Follow.find({
            follower: userId,
            status: "accepted",
            is_removed: false
        }).populate<{ following: UserDocument }>("following");

        return followings.map((f) => {
            return {
                _id: f.following._id,
                username: f.following.username,
                fullname: f.following.full_name,
                avatar_url: f.following.avatar_key
                    ? convertImageKeyToImageUrl(f.following.avatar_key)
                    : null
            };
        });
    }
}

export const socialsRepo = new SocialsRepository();
