import mongoose from "mongoose";
import { Post, PostDocument } from "../models/post.model";
import { Reel, ReelDocument } from "../models/reel.model";
import { Follow } from "../models";
import { WatchHistory } from "../models/watch-history.model";

class FeedRepository {
    /**
     * Get IDs of users that the current user follows (accepted follows only).
     */
    async getFollowingIds(userId: string): Promise<string[]> {
        const follows = await Follow.find({
            follower: userId,
            status: "accepted",
            is_removed: false
        }).select("following").lean();

        return follows.map((f) => f.following.toString());
    }

    /**
     * Get IDs of posts/reels that user has already seen.
     */
    async getSeenTargetIds(
        userId: string,
        targetType: "post" | "reel"
    ): Promise<string[]> {
        const views = await WatchHistory.find({
            user: userId,
            target_type: targetType
        })
            .select("target_id")
            .lean();

        return views.map((v) => v.target_id.toString());
    }

    /**
     * Get feed posts: unseen posts from followed users first, then seen/older posts.
     * Respects visibility rules. Excludes deleted/removed content.
     */
    async getFeedPosts(
        userId: string,
        followingIds: string[],
        seenPostIds: string[],
        page: number,
        limit: number
    ): Promise<{
        unseen: PostDocument[];
        seen: PostDocument[];
        total_unseen: number;
        total_seen: number;
    }> {
        const authorFilter = followingIds.length > 0
            ? followingIds.map((id) => new mongoose.Types.ObjectId(id))
            : [];

        // Include own posts + followed users' posts
        const allAuthorIds = [
            new mongoose.Types.ObjectId(userId),
            ...authorFilter
        ];

        const seenObjectIds = seenPostIds.map(
            (id) => new mongoose.Types.ObjectId(id)
        );

        const baseMatch = {
            author: { $in: allAuthorIds },
            is_deleted: false,
            is_removed_by_moderator: false,
            visibility: { $ne: "private" }
        };

        // Count unseen
        const total_unseen = await Post.countDocuments({
            ...baseMatch,
            _id: { $nin: seenObjectIds }
        });

        // Count seen
        const total_seen = await Post.countDocuments({
            ...baseMatch,
            _id: { $in: seenObjectIds }
        });

        // Calculate skip offsets
        const unseenSkip = (page - 1) * limit;

        // Fetch unseen posts (sorted by engagement score + recency)
        let unseen: PostDocument[] = [];
        if (unseenSkip < total_unseen) {
            unseen = await Post.find({
                ...baseMatch,
                _id: { $nin: seenObjectIds }
            })
                .sort({ created_at: -1 })
                .skip(unseenSkip)
                .limit(limit)
                .populate("author", "username full_name avatar_key is_online")
                .lean<PostDocument[]>();
        }

        // If unseen didn't fill the page, fill remaining with seen
        let seen: PostDocument[] = [];
        const remaining = limit - unseen.length;
        if (remaining > 0 && unseen.length < limit) {
            const seenSkip = Math.max(
                0,
                (page - 1) * limit - total_unseen
            );
            seen = await Post.find({
                ...baseMatch,
                _id: { $in: seenObjectIds }
            })
                .sort({ created_at: -1 })
                .skip(seenSkip)
                .limit(remaining)
                .populate(
                    "author",
                    "username full_name avatar_key is_online"
                )
                .lean<PostDocument[]>();
        }

        return { unseen, seen, total_unseen, total_seen };
    }

    /**
     * Get trending/explore posts: public posts with highest engagement, recent first.
     * Excludes posts from users the current user already follows (discover new content).
     */
    async getExplorePosts(
        userId: string,
        followingIds: string[],
        page: number,
        limit: number
    ): Promise<{ posts: PostDocument[]; total: number }> {
        const excludeAuthorIds = [
            new mongoose.Types.ObjectId(userId),
            ...followingIds.map((id) => new mongoose.Types.ObjectId(id))
        ];

        const match = {
            author: { $nin: excludeAuthorIds },
            is_deleted: false,
            is_removed_by_moderator: false,
            visibility: "public",
            is_sensitive_content: { $ne: true }
        };

        const skip = (page - 1) * limit;

        const [posts, total] = await Promise.all([
            Post.aggregate([
                { $match: match },
                {
                    $addFields: {
                        engagement_score: {
                            $add: [
                                { $multiply: ["$likes_count", 3] },
                                { $multiply: ["$comments_count", 5] },
                                { $multiply: ["$reposts_count", 4] }
                            ]
                        },
                        recency_score: {
                            $divide: [
                                1,
                                {
                                    $add: [
                                        1,
                                        {
                                            $divide: [
                                                {
                                                    $subtract: [
                                                        new Date(),
                                                        "$created_at"
                                                    ]
                                                },
                                                1000 * 60 * 60 // hours
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                },
                {
                    $addFields: {
                        trending_score: {
                            $add: [
                                "$engagement_score",
                                {
                                    $multiply: [
                                        "$recency_score",
                                        100
                                    ]
                                }
                            ]
                        }
                    }
                },
                { $sort: { trending_score: -1, created_at: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "users",
                        localField: "author",
                        foreignField: "_id",
                        as: "author",
                        pipeline: [
                            {
                                $project: {
                                    username: 1,
                                    full_name: 1,
                                    avatar_key: 1,
                                    is_online: 1
                                }
                            }
                        ]
                    }
                },
                { $unwind: "$author" }
            ]),
            Post.countDocuments(match)
        ]);

        return { posts: posts as PostDocument[], total };
    }

    /**
     * Get explore reels: public reels with highest engagement.
     */
    async getExploreReels(
        userId: string,
        followingIds: string[],
        page: number,
        limit: number
    ): Promise<{ reels: ReelDocument[]; total: number }> {
        const excludeAuthorIds = [
            new mongoose.Types.ObjectId(userId),
            ...followingIds.map((id) => new mongoose.Types.ObjectId(id))
        ];

        const match = {
            author: { $nin: excludeAuthorIds },
            is_deleted: false,
            is_removed_by_moderator: false,
            visibility: "public",
            is_sensitive_content: { $ne: true }
        };

        const skip = (page - 1) * limit;

        const [reels, total] = await Promise.all([
            Reel.aggregate([
                { $match: match },
                {
                    $addFields: {
                        engagement_score: {
                            $add: [
                                { $multiply: ["$likes_count", 3] },
                                { $multiply: ["$comments_count", 5] },
                                { $multiply: ["$reposts_count", 4] },
                                "$views_count"
                            ]
                        },
                        recency_score: {
                            $divide: [
                                1,
                                {
                                    $add: [
                                        1,
                                        {
                                            $divide: [
                                                {
                                                    $subtract: [
                                                        new Date(),
                                                        "$created_at"
                                                    ]
                                                },
                                                1000 * 60 * 60
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                },
                {
                    $addFields: {
                        trending_score: {
                            $add: [
                                "$engagement_score",
                                {
                                    $multiply: [
                                        "$recency_score",
                                        100
                                    ]
                                }
                            ]
                        }
                    }
                },
                { $sort: { trending_score: -1, created_at: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "users",
                        localField: "author",
                        foreignField: "_id",
                        as: "author",
                        pipeline: [
                            {
                                $project: {
                                    username: 1,
                                    full_name: 1,
                                    avatar_key: 1,
                                    is_online: 1
                                }
                            }
                        ]
                    }
                },
                { $unwind: "$author" }
            ]),
            Reel.countDocuments(match)
        ]);

        return { reels: reels as ReelDocument[], total };
    }

    /**
     * Get reels feed: unseen reels first (from followed + public), then seen ones.
     */
    async getReelsFeed(
        userId: string,
        followingIds: string[],
        seenReelIds: string[],
        page: number,
        limit: number
    ): Promise<{
        reels: ReelDocument[];
        total: number;
        unseen_count: number;
    }> {
        const followingObjectIds = followingIds.map(
            (id) => new mongoose.Types.ObjectId(id)
        );
        const seenObjectIds = seenReelIds.map(
            (id) => new mongoose.Types.ObjectId(id)
        );
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Reels from followed users (followers visibility) + public reels from anyone
        const baseMatch = {
            is_deleted: false,
            is_removed_by_moderator: false,
            is_sensitive_content: { $ne: true },
            author: { $ne: userObjectId }, // Exclude own reels from feed
            $or: [
                { visibility: "public" },
                {
                    visibility: "followers",
                    author: { $in: followingObjectIds }
                }
            ]
        };

        const skip = (page - 1) * limit;

        // Unseen reels first, then seen — both sorted by engagement
        const reels = await Reel.aggregate([
            { $match: baseMatch },
            {
                $addFields: {
                    is_unseen: {
                        $cond: [
                            { $in: ["$_id", seenObjectIds] },
                            0,
                            1
                        ]
                    },
                    engagement_score: {
                        $add: [
                            { $multiply: ["$likes_count", 3] },
                            { $multiply: ["$comments_count", 5] },
                            { $multiply: ["$reposts_count", 4] },
                            "$views_count"
                        ]
                    }
                }
            },
            {
                $sort: {
                    is_unseen: -1,
                    engagement_score: -1,
                    created_at: -1
                }
            },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author",
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                full_name: 1,
                                avatar_key: 1,
                                is_online: 1
                            }
                        }
                    ]
                }
            },
            { $unwind: "$author" }
        ]);

        const total = await Reel.countDocuments(baseMatch);

        const unseen_count = await Reel.countDocuments({
            ...baseMatch,
            _id: { $nin: seenObjectIds }
        });

        return {
            reels: reels as ReelDocument[],
            total,
            unseen_count
        };
    }

    /**
     * Get suggested users to follow (for sidebar).
     * Users who the current user does NOT follow, sorted by followers count.
     */
    async getSuggestedUsers(
        userId: string,
        followingIds: string[],
        limit: number = 5
    ) {
        const { User } = await import("../models");
        const excludeIds = [
            new mongoose.Types.ObjectId(userId),
            ...followingIds.map((id) => new mongoose.Types.ObjectId(id))
        ];

        const users = await User.find({
            _id: { $nin: excludeIds },
            is_disabled: false
        })
            .sort({ followers_count: -1, created_at: -1 })
            .limit(limit)
            .select("username full_name avatar_key followers_count bio")
            .lean();

        return users;
    }
}

export const feedRepo = new FeedRepository();
