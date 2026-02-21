import mongoose from "mongoose";
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
    isFollowRequestPending(
        followerId: string,
        followeeId: string
    ): Promise<boolean>;
    createFollowRequest(
        followerId: string,
        followeeId: string
    ): Promise<FollowDocument>;
    getFollowRequests(
        userId: string
    ): Promise<FollowDocument & { follower: UserDocument }[]>;
    getFollowingRequests(
        userId: string
    ): Promise<FollowDocument & { follower: UserDocument }[]>;
    getPendingFollowRequestByFollowerIdAndFolloweeId(
        followerId: string,
        followeeId: string
    ): Promise<FollowDocument | null>;
    acceptFollowRequestByFollowerIdAndFolloweeId(
        followerId: string,
        followeeId: string
    ): Promise<FollowDocument>;
    rejectFollowRequestByFollowerIdAndFolloweeId(
        followerId: string,
        followeeId: string
    ): Promise<FollowDocument>;
    deleteFollowRequestByFollowerIdAndFolloweeId(
        followerId: string,
        followeeId: string
    ): Promise<FollowDocument>;
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

    async isFollowRequestPending(
        followerId: string,
        followeeId: string
    ): Promise<boolean> {
        const followRequest = await Follow.findOne({
            follower: followerId,
            following: followeeId,
            status: "pending",
            is_removed: false
        });

        return !!followRequest;
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
                user_id: f.follower._id,
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
                user_id: f.following._id,
                username: f.following.username,
                fullname: f.following.full_name,
                avatar_url: f.following.avatar_key
                    ? convertImageKeyToImageUrl(f.following.avatar_key)
                    : null
            };
        });
    }

    async createFollowRequest(
        followerId: string,
        followeeId: string
    ): Promise<FollowDocument> {
        const followRequest = new Follow({
            follower: followerId,
            following: followeeId,
            status: "pending"
        });

        await followRequest.save();

        return followRequest;
    }

    async getFollowRequests(
        userId: string
    ): Promise<FollowDocument & { follower: UserDocument }[]> {
        const followRequests = await Follow.find({
            following: userId,
            status: "pending",
            is_removed: false
        })
            .populate<{ follower: UserDocument }>("follower")
            .lean();

        const result = followRequests.map((req) => {
            return {
                request_id: req._id,
                follower: {
                    user_id: req.follower._id,
                    username: req.follower.username,
                    fullname: req.follower.full_name,
                    avatar_url: req.follower.avatar_key
                        ? convertImageKeyToImageUrl(req.follower.avatar_key)
                        : null
                },
                following: req.following,
                status: req.status,
                followed_at: req.followed_at
            };
        });

        return result as unknown as FollowDocument &
            { follower: UserDocument }[];
    }

    async getFollowingRequests(
        userId: string
    ): Promise<FollowDocument & { follower: UserDocument }[]> {
        const followingRequests = await Follow.find({
            follower: userId,
            status: "pending",
            is_removed: false
        })
            .populate<{ follower: UserDocument }>("follower")
            .lean();

        const result = followingRequests.map((req) => {
            return {
                request_id: req._id,
                follower: {
                    user_id: req.follower._id,
                    username: req.follower.username,
                    fullname: req.follower.full_name,
                    avatar_url: req.follower.avatar_key
                        ? convertImageKeyToImageUrl(req.follower.avatar_key)
                        : null
                },
                following: req.following,
                status: req.status,
                followed_at: req.followed_at
            };
        });

        return result as unknown as FollowDocument &
            { follower: UserDocument }[];
    }

    async acceptFollowRequestByFollowerIdAndFolloweeId(
        followerId: string,
        followeeId: string
    ): Promise<FollowDocument> {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const followRequest = await Follow.findOneAndUpdate(
                {
                    follower: followerId,
                    following: followeeId,
                    status: "pending",
                    is_removed: false
                },
                {
                    status: "accepted",
                    accepted_at: new Date()
                },
                { session, new: true }
            );

            if (!followRequest) {
                throw new Error("Follow request not found");
            }

            await this.increaseFollowerCount(
                followRequest.following.toString(),
                session
            );
            await this.increaseFollowingCount(followerId, session);

            await session.commitTransaction();

            return followRequest;
        } finally {
            await session.endSession();
        }
    }

    async rejectFollowRequestByFollowerIdAndFolloweeId(
        followerId: string,
        followeeId: string
    ): Promise<FollowDocument> {
        const followRequest = await Follow.findOneAndUpdate(
            {
                follower: followerId,
                following: followeeId,
                status: "pending",
                is_removed: false
            },
            {
                status: "rejected",
                is_removed: true,
                rejected_at: new Date()
            },
            { new: true }
        );

        if (!followRequest) {
            throw new Error("Follow request not found");
        }

        return followRequest;
    }

    async getPendingFollowRequestByFollowerIdAndFolloweeId(
        followerId: string,
        followeeId: string
    ): Promise<FollowDocument | null> {
        const followRequest = await Follow.findOne({
            follower: followerId,
            following: followeeId,
            status: "pending",
            is_removed: false
        });

        return followRequest;
    }

    async deleteFollowRequestByFollowerIdAndFolloweeId(
        followerId: string,
        followeeId: string
    ): Promise<FollowDocument> {
        const followRequest = await Follow.findOneAndUpdate(
            {
                follower: followerId,
                following: followeeId,
                status: "pending",
                is_removed: false
            },
            {
                is_removed: true,
                removed_by: new mongoose.Types.ObjectId(followerId),
                removed_at: new Date()
            },
            { new: true }
        );

        if (!followRequest) {
            throw new Error("Follow request not found");
        }

        return followRequest;
    }
}

export const socialsRepo = new SocialsRepository();
