import mongoose from "mongoose";
import { ErrorCodes } from "../constants/error-code";
import { Follow, FollowDocument, User, UserDocument } from "../models";

interface ISocialsRepository {
    followUser(followerId: string, followeeId: string): Promise<FollowDocument>;
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

    async doesUserAlreadyFollows(followerId: string, followeeId: string) {
        const existingFollow = await Follow.findOne({
            follower: followerId,
            following: followeeId
        });

        return !!existingFollow;
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
}

export const socialsRepo = new SocialsRepository();
