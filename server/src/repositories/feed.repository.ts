import mongoose from "mongoose";
import { Post, PostDocument } from "../models/post.model";
import { Reel, ReelDocument } from "../models/reel.model";
import { Follow } from "../models";
import { User } from "../models/user.model";
import { WatchHistory } from "../models/watch-history.model";

class FeedRepository {
    /**
     * Get IDs of users with moderator or system_admin role.
     * Used to exclude their content from public feeds.
     */
    async getModeratorAndAdminIds(): Promise<mongoose.Types.ObjectId[]> {
        const users = await User.find({
            role: { $in: ["moderator", "system_admin"] }
        })
            .select("_id")
            .lean();

        return users.map((u) => u._id as mongoose.Types.ObjectId);
    }

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
     * Get IDs of users that the current user has any follow relationship with
     * (accepted, pending, or rejected — not removed). Used for excluding from suggestions.
     */
    async getAllFollowTargetIds(userId: string): Promise<string[]> {
        const follows = await Follow.find({
            follower: userId,
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
     * Get feed posts: unseen posts from followed users first (ranked by engagement+recency),
     * then seen/older posts. When user follows nobody, falls back to trending public posts.
     */
    async getFeedPosts(
        userId: string,
        followingIds: string[],
        seenPostIds: string[],
        page: number,
        limit: number,
        modAdminIds: mongoose.Types.ObjectId[] = []
    ): Promise<{
        unseen: PostDocument[];
        seen: PostDocument[];
        total_unseen: number;
        total_seen: number;
        fallback: PostDocument[];
        total_fallback: number;
    }> {
        const seenObjectIds = seenPostIds.map(
            (id) => new mongoose.Types.ObjectId(id)
        );

        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Engagement+recency scoring pipeline stages
        const scoringStages = [
            {
                $addFields: {
                    engagement_score: {
                        $add: [
                            { $multiply: ["$likes_count", 3] },
                            { $multiply: ["$comments_count", 5] },
                            { $multiply: ["$reposts_count", 4] }
                        ]
                    },
                    recency_hours: {
                        $divide: [
                            { $subtract: [new Date(), "$created_at"] },
                            1000 * 60 * 60
                        ]
                    }
                }
            },
            {
                $addFields: {
                    // Decay: score / (1 + hours_old)^1.2  — newer posts rank higher
                    feed_score: {
                        $divide: [
                            { $add: ["$engagement_score", 1] },
                            {
                                $pow: [
                                    { $add: [1, "$recency_hours"] },
                                    1.2
                                ]
                            }
                        ]
                    }
                }
            }
        ];

        const lookupAuthor = [
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
        ];

        // If user follows people, show their content
        if (followingIds.length > 0) {
            const authorFilter = followingIds
                .map((id) => new mongoose.Types.ObjectId(id))
                .filter((id) => !modAdminIds.some((mid) => mid.equals(id)));
            const allAuthorIds = [userObjectId, ...authorFilter];

            const baseMatch = {
                author: { $in: allAuthorIds },
                is_deleted: false,
                is_removed_by_moderator: false,
                visibility: { $ne: "private" }
            };

            // Count unseen & seen
            const [total_unseen, total_seen] = await Promise.all([
                Post.countDocuments({
                    ...baseMatch,
                    _id: { $nin: seenObjectIds }
                }),
                Post.countDocuments({
                    ...baseMatch,
                    _id: { $in: seenObjectIds }
                })
            ]);

            const unseenSkip = (page - 1) * limit;

            // Fetch unseen posts ranked by engagement+recency
            let unseen: PostDocument[] = [];
            if (unseenSkip < total_unseen) {
                unseen = (await Post.aggregate([
                    {
                        $match: {
                            ...baseMatch,
                            _id: { $nin: seenObjectIds }
                        }
                    },
                    ...scoringStages,
                    { $sort: { feed_score: -1, created_at: -1 } },
                    { $skip: unseenSkip },
                    { $limit: limit },
                    ...lookupAuthor
                ])) as PostDocument[];
            }

            // Fill remaining with seen posts
            let seen: PostDocument[] = [];
            const remaining = limit - unseen.length;
            if (remaining > 0 && unseen.length < limit) {
                const seenSkip = Math.max(
                    0,
                    (page - 1) * limit - total_unseen
                );
                seen = (await Post.aggregate([
                    {
                        $match: {
                            ...baseMatch,
                            _id: { $in: seenObjectIds }
                        }
                    },
                    ...scoringStages,
                    { $sort: { feed_score: -1, created_at: -1 } },
                    { $skip: seenSkip },
                    { $limit: remaining },
                    ...lookupAuthor
                ])) as PostDocument[];
            }

            return {
                unseen,
                seen,
                total_unseen,
                total_seen,
                fallback: [],
                total_fallback: 0
            };
        }

        // ─── Fallback: user follows nobody → show trending public posts ───
        const fallbackExcludeIds = [userObjectId, ...modAdminIds];
        const fallbackMatch = {
            author: { $nin: fallbackExcludeIds },
            is_deleted: false,
            is_removed_by_moderator: false,
            visibility: "public",
            is_sensitive_content: { $ne: true }
        };

        const skip = (page - 1) * limit;
        const [fallback, total_fallback] = await Promise.all([
            Post.aggregate([
                { $match: fallbackMatch },
                ...scoringStages,
                { $sort: { feed_score: -1, created_at: -1 } },
                { $skip: skip },
                { $limit: limit },
                ...lookupAuthor
            ]),
            Post.countDocuments(fallbackMatch)
        ]);

        return {
            unseen: [],
            seen: [],
            total_unseen: 0,
            total_seen: 0,
            fallback: fallback as PostDocument[],
            total_fallback
        };
    }

    /**
     * Get reels for the home feed — mix of followed + public, prioritizing unseen.
     * Used to intersperse reels into the home feed like Instagram.
     */
    async getHomeFeedReels(
        userId: string,
        followingIds: string[],
        seenReelIds: string[],
        limit: number = 3,
        modAdminIds: mongoose.Types.ObjectId[] = []
    ): Promise<ReelDocument[]> {
        const followingObjectIds = followingIds.map(
            (id) => new mongoose.Types.ObjectId(id)
        );
        const seenObjectIds = seenReelIds.map(
            (id) => new mongoose.Types.ObjectId(id)
        );
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const excludeAuthors = [userObjectId, ...modAdminIds];

        const baseMatch = {
            is_deleted: false,
            is_removed_by_moderator: false,
            is_sensitive_content: { $ne: true },
            author: { $nin: excludeAuthors },
            $or: [
                { visibility: "public" },
                {
                    visibility: "followers",
                    author: { $in: followingObjectIds }
                }
            ]
        };

        const reels = await Reel.aggregate([
            { $match: baseMatch },
            {
                $addFields: {
                    is_unseen: {
                        $cond: [{ $in: ["$_id", seenObjectIds] }, 0, 1]
                    },
                    is_from_following: {
                        $cond: [{ $in: ["$author", followingObjectIds] }, 1, 0]
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
                $addFields: {
                    reel_score: {
                        $add: [
                            { $multiply: ["$is_unseen", 10000] },
                            { $multiply: ["$is_from_following", 500] },
                            "$engagement_score"
                        ]
                    }
                }
            },
            { $sort: { reel_score: -1, created_at: -1 } },
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

        return reels as ReelDocument[];
    }

    /**
     * Get suggested (non-followed) public posts for the home feed.
     * Shows trending content from users the current user doesn't follow.
     */
    async getSuggestedPosts(
        userId: string,
        followingIds: string[],
        limit: number = 3,
        modAdminIds: mongoose.Types.ObjectId[] = []
    ): Promise<PostDocument[]> {
        const excludeAuthorIds = [
            new mongoose.Types.ObjectId(userId),
            ...followingIds.map((id) => new mongoose.Types.ObjectId(id)),
            ...modAdminIds
        ];

        const match = {
            author: { $nin: excludeAuthorIds },
            is_deleted: false,
            is_removed_by_moderator: false,
            visibility: "public",
            is_sensitive_content: { $ne: true }
        };

        const posts = await Post.aggregate([
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
                                            { $subtract: [new Date(), "$created_at"] },
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
                            { $multiply: ["$recency_score", 100] }
                        ]
                    }
                }
            },
            { $sort: { trending_score: -1, created_at: -1 } },
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

        return posts as PostDocument[];
    }

    /**
     * Get trending/explore posts: public posts with highest engagement, recent first.
     * Excludes posts from users the current user already follows (discover new content).
     */
    async getExplorePosts(
        userId: string,
        followingIds: string[],
        page: number,
        limit: number,
        modAdminIds: mongoose.Types.ObjectId[] = []
    ): Promise<{ posts: PostDocument[]; total: number }> {
        const excludeAuthorIds = [
            new mongoose.Types.ObjectId(userId),
            ...followingIds.map((id) => new mongoose.Types.ObjectId(id)),
            ...modAdminIds
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
        limit: number,
        modAdminIds: mongoose.Types.ObjectId[] = []
    ): Promise<{ reels: ReelDocument[]; total: number }> {
        const excludeAuthorIds = [
            new mongoose.Types.ObjectId(userId),
            ...followingIds.map((id) => new mongoose.Types.ObjectId(id)),
            ...modAdminIds
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
     * Ranked by engagement+recency with author diversification.
     */
    async getReelsFeed(
        userId: string,
        followingIds: string[],
        seenReelIds: string[],
        page: number,
        limit: number,
        modAdminIds: mongoose.Types.ObjectId[] = []
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
        const excludeAuthors = [userObjectId, ...modAdminIds];

        // Reels from followed users (followers visibility) + public reels from anyone
        const baseMatch = {
            is_deleted: false,
            is_removed_by_moderator: false,
            is_sensitive_content: { $ne: true },
            author: { $nin: excludeAuthors },
            $or: [
                { visibility: "public" },
                {
                    visibility: "followers",
                    author: { $in: followingObjectIds }
                }
            ]
        };

        const skip = (page - 1) * limit;

        // Engagement + recency decay scoring with unseen priority
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
                    is_from_following: {
                        $cond: [
                            { $in: ["$author", followingObjectIds] },
                            1,
                            0
                        ]
                    },
                    engagement_score: {
                        $add: [
                            { $multiply: ["$likes_count", 3] },
                            { $multiply: ["$comments_count", 5] },
                            { $multiply: ["$reposts_count", 4] },
                            "$views_count"
                        ]
                    },
                    recency_hours: {
                        $divide: [
                            { $subtract: [new Date(), "$created_at"] },
                            1000 * 60 * 60
                        ]
                    }
                }
            },
            {
                $addFields: {
                    // Combined score: engagement decayed by time,
                    // boosted for followed users, prioritized if unseen
                    reel_score: {
                        $add: [
                            {
                                $multiply: [
                                    "$is_unseen",
                                    10000 // Unseen reels get massive priority
                                ]
                            },
                            {
                                $multiply: [
                                    "$is_from_following",
                                    500 // Boost reels from followed users
                                ]
                            },
                            {
                                $divide: [
                                    { $add: ["$engagement_score", 1] },
                                    {
                                        $pow: [
                                            {
                                                $add: [
                                                    1,
                                                    "$recency_hours"
                                                ]
                                            },
                                            1.2
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            },
            { $sort: { reel_score: -1, created_at: -1 } },
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
     * Excludes users with ANY follow relationship (accepted, pending, rejected).
     */
    async getSuggestedUsers(
        userId: string,
        allFollowTargetIds: string[],
        limit: number = 5,
        modAdminIds: mongoose.Types.ObjectId[] = []
    ) {
        const excludeIds = [
            new mongoose.Types.ObjectId(userId),
            ...allFollowTargetIds.map((id) => new mongoose.Types.ObjectId(id)),
            ...modAdminIds
        ];

        const users = await User.find({
            _id: { $nin: excludeIds },
            is_disabled: { $ne: true },
            role: { $nin: ["moderator", "system_admin"] }
        })
            .sort({ followers_count: -1, created_at: -1 })
            .limit(limit)
            .select("username full_name avatar_key followers_count bio")
            .lean();

        return users;
    }
}

export const feedRepo = new FeedRepository();
