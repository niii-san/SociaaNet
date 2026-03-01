import { feedRepo } from "../repositories/feed.repository";
import { likesRepo, repostsRepo, savedItemsRepo } from "../repositories";
import {
    convertImageKeyToImageUrl,
    convertVideoKeyToVideoUrl,
    convertThumbnailKeytoThumbnailUrl
} from "../utils";

interface FeedAuthor {
    user_id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
    is_online: boolean;
}

function mapAuthor(author: any): FeedAuthor {
    return {
        user_id: author._id.toString(),
        username: author.username,
        full_name: author.full_name,
        avatar_url: author.avatar_key
            ? convertImageKeyToImageUrl(author.avatar_key)
            : null,
        is_online: author.is_online ?? false
    };
}

class FeedService {
    /**
     * Home feed: unseen posts first from followed users, then seen/older.
     * Falls back to trending public posts if user follows nobody.
     * Returns posts with engagement data and an "all caught up" boundary index.
     */
    async getHomeFeed(userId: string, page: number = 1, limit: number = 10) {
        const followingIds = await feedRepo.getFollowingIds(userId);
        const seenPostIds = await feedRepo.getSeenTargetIds(userId, "post");

        const {
            unseen,
            seen,
            total_unseen,
            total_seen,
            fallback,
            total_fallback
        } = await feedRepo.getFeedPosts(
            userId,
            followingIds,
            seenPostIds,
            page,
            limit
        );

        // ─── Fallback mode: user follows nobody ───
        if (followingIds.length === 0 && fallback.length > 0) {
            const fallbackItems = await Promise.all(
                fallback.map((post) =>
                    this.mapPostToFeedItem(post, userId, false)
                )
            );

            return {
                posts: fallbackItems,
                caught_up_at_index: null,
                show_caught_up_divider: false,
                is_fallback: true,
                page,
                limit,
                total: total_fallback,
                total_unseen: 0,
                has_more: page * limit < total_fallback
            };
        }

        // ─── Normal mode: followed users feed ───
        const unseenItems = await Promise.all(
            unseen.map((post) => this.mapPostToFeedItem(post, userId, false))
        );

        const seenItems = await Promise.all(
            seen.map((post) => this.mapPostToFeedItem(post, userId, true))
        );

        const allItems = [...unseenItems, ...seenItems];

        // Determine caught-up divider position
        // Strategy 1: Show between unseen and seen posts (view-based)
        // Strategy 2: If no seen posts exist, show after posts newer than 24 hours (time-based)
        let caught_up_at_index: number | null = null;
        let show_caught_up_divider = false;

        if (unseenItems.length > 0 && seenItems.length > 0) {
            // View-based: divider between unseen and seen
            caught_up_at_index = unseenItems.length;
            show_caught_up_divider = true;
        } else if (total_seen === 0 && allItems.length > 0) {
            // Time-based fallback: no posts have been viewed yet,
            // show divider after posts from last 24 hours
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const recentCount = allItems.filter(
                (item) => new Date(item.created_at) > oneDayAgo
            ).length;
            if (recentCount > 0 && recentCount < allItems.length) {
                caught_up_at_index = recentCount;
                show_caught_up_divider = true;
            }
        } else {
            // All unseen loaded and there are seen posts on later pages
            const all_unseen_loaded =
                (page - 1) * limit + unseenItems.length >= total_unseen &&
                total_unseen > 0;
            if (all_unseen_loaded && total_seen > 0) {
                caught_up_at_index = unseenItems.length > 0 ? unseenItems.length : null;
                show_caught_up_divider = caught_up_at_index !== null;
            }
        }

        return {
            posts: allItems,
            caught_up_at_index,
            show_caught_up_divider,
            is_fallback: false,
            page,
            limit,
            total: total_unseen + total_seen,
            total_unseen,
            has_more:
                page * limit < total_unseen + total_seen
        };
    }

    /**
     * Explore page: trending public posts + reels from users you DON'T follow.
     */
    async getExplore(userId: string, page: number = 1, limit: number = 20) {
        const followingIds = await feedRepo.getFollowingIds(userId);

        const [postsResult, reelsResult] = await Promise.all([
            feedRepo.getExplorePosts(
                userId,
                followingIds,
                page,
                Math.ceil(limit * 0.6) // 60% posts
            ),
            feedRepo.getExploreReels(
                userId,
                followingIds,
                page,
                Math.floor(limit * 0.4) // 40% reels
            )
        ]);

        const posts = await Promise.all(
            postsResult.posts.map((post) =>
                this.mapPostToExploreItem(post, userId)
            )
        );

        const reels = await Promise.all(
            reelsResult.reels.map((reel) =>
                this.mapReelToExploreItem(reel, userId)
            )
        );

        // Interleave: 2 posts, 1 reel, repeat
        const items: any[] = [];
        let pi = 0;
        let ri = 0;
        while (pi < posts.length || ri < reels.length) {
            if (pi < posts.length) items.push(posts[pi++]);
            if (pi < posts.length) items.push(posts[pi++]);
            if (ri < reels.length) items.push(reels[ri++]);
        }

        return {
            items,
            page,
            limit,
            total: postsResult.total + reelsResult.total,
            has_more:
                page * Math.ceil(limit * 0.6) < postsResult.total ||
                page * Math.floor(limit * 0.4) < reelsResult.total
        };
    }

    /**
     * Reels feed: unseen reels first, then popular, for vertical scroll.
     */
    async getReelsFeed(userId: string, page: number = 1, limit: number = 10) {
        const followingIds = await feedRepo.getFollowingIds(userId);
        const seenReelIds = await feedRepo.getSeenTargetIds(userId, "reel");

        const { reels, total, unseen_count } = await feedRepo.getReelsFeed(
            userId,
            followingIds,
            seenReelIds,
            page,
            limit
        );

        const items = await Promise.all(
            reels.map((reel) => this.mapReelToFeedItem(reel, userId))
        );

        return {
            reels: items,
            page,
            limit,
            total,
            unseen_count,
            has_more: page * limit < total
        };
    }

    /**
     * Suggested users for the sidebar widget.
     */
    async getSuggestedUsers(userId: string, limit: number = 5) {
        const allFollowTargetIds = await feedRepo.getAllFollowTargetIds(userId);
        const users = await feedRepo.getSuggestedUsers(
            userId,
            allFollowTargetIds,
            limit
        );

        return users.map((u: any) => ({
            user_id: u._id.toString(),
            username: u.username,
            full_name: u.full_name,
            avatar_url: u.avatar_key
                ? convertImageKeyToImageUrl(u.avatar_key)
                : null,
            bio: u.bio || "",
            followers_count: u.followers_count
        }));
    }

    // ─── Private mappers ──────────────────────────────────

    private async mapPostToFeedItem(
        post: any,
        currentUserId: string,
        is_seen: boolean
    ) {
        const postId = post._id.toString();

        const [is_liked, is_reposted, is_saved] = await Promise.all([
            likesRepo.isLikedByUser(currentUserId, postId, "post"),
            repostsRepo.isRepostedByUser(currentUserId, postId, "post"),
            savedItemsRepo.isSavedByUser(currentUserId, postId, "post")
        ]);

        return {
            type: "post" as const,
            post_id: postId,
            author: mapAuthor(post.author),
            media_urls: (post.media_keys || []).map((key: string) =>
                convertImageKeyToImageUrl(key)
            ),
            caption: post.caption,
            hashtags: post.hashtags,
            likes_count: post.likes_count,
            comments_count: post.comments_count,
            reposts_count: post.reposts_count,
            is_liked,
            is_reposted,
            is_saved,
            is_seen,
            is_own_post: post.author._id.toString() === currentUserId,
            visibility: post.visibility,
            created_at: post.created_at
        };
    }

    private async mapPostToExploreItem(post: any, currentUserId: string) {
        const postId = post._id.toString();

        const [is_liked, is_saved] = await Promise.all([
            likesRepo.isLikedByUser(currentUserId, postId, "post"),
            savedItemsRepo.isSavedByUser(currentUserId, postId, "post")
        ]);

        return {
            type: "post" as const,
            post_id: postId,
            author: mapAuthor(post.author),
            media_urls: (post.media_keys || []).map((key: string) =>
                convertImageKeyToImageUrl(key)
            ),
            caption: post.caption,
            hashtags: post.hashtags,
            likes_count: post.likes_count,
            comments_count: post.comments_count,
            reposts_count: post.reposts_count,
            is_liked,
            is_saved,
            visibility: post.visibility,
            created_at: post.created_at
        };
    }

    private async mapReelToExploreItem(reel: any, currentUserId: string) {
        const reelId = reel._id.toString();

        const [is_liked, is_saved] = await Promise.all([
            likesRepo.isLikedByUser(currentUserId, reelId, "reel"),
            savedItemsRepo.isSavedByUser(currentUserId, reelId, "reel")
        ]);

        return {
            type: "reel" as const,
            reel_id: reelId,
            author: mapAuthor(reel.author),
            thumbnail_url: convertThumbnailKeytoThumbnailUrl(
                reel.thumbnail_key
            ),
            video_url: convertVideoKeyToVideoUrl(reel.media_key),
            caption: reel.caption,
            hashtags: reel.hashtags,
            likes_count: reel.likes_count,
            comments_count: reel.comments_count,
            reposts_count: reel.reposts_count,
            views_count: reel.views_count,
            duration_seconds: reel.duration_seconds,
            is_liked,
            is_saved,
            created_at: reel.created_at
        };
    }

    private async mapReelToFeedItem(reel: any, currentUserId: string) {
        const reelId = reel._id.toString();

        const [is_liked, is_reposted, is_saved] = await Promise.all([
            likesRepo.isLikedByUser(currentUserId, reelId, "reel"),
            repostsRepo.isRepostedByUser(currentUserId, reelId, "reel"),
            savedItemsRepo.isSavedByUser(currentUserId, reelId, "reel")
        ]);

        return {
            type: "reel" as const,
            reel_id: reelId,
            author: mapAuthor(reel.author),
            video_url: convertVideoKeyToVideoUrl(reel.media_key),
            thumbnail_url: convertThumbnailKeytoThumbnailUrl(
                reel.thumbnail_key
            ),
            caption: reel.caption,
            hashtags: reel.hashtags,
            likes_count: reel.likes_count,
            comments_count: reel.comments_count,
            reposts_count: reel.reposts_count,
            views_count: reel.views_count,
            duration_seconds: reel.duration_seconds,
            is_liked,
            is_reposted,
            is_saved,
            is_own_reel: reel.author._id.toString() === currentUserId,
            visibility: reel.visibility,
            created_at: reel.created_at
        };
    }
}

export const feedService = new FeedService();
