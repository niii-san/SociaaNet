import { isValidObjectId, Types } from "mongoose";
import { ErrorCodes } from "../constants/error-code";
import { filesRepo, activityRepo, repostsRepo } from "../repositories";
import {
    HttpError,
    convertImageKeyToImageUrl,
    convertThumbnailKeytoThumbnailUrl,
    convertVideoKeyToVideoUrl
} from "../utils";
import { ActivityVerb } from "../types";

class RepostsService {
    async repostPost(postId: string, userId: string) {
        if (!isValidObjectId(postId)) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid post ID"
            );
        }

        const post = await filesRepo.getPostById(postId);

        if (!post) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Post not found"
            );
        }

        if (post.author.toString() === userId) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "You cannot repost your own post"
            );
        }

        const alreadyReposted = await repostsRepo.isRepostedByUser(
            userId,
            postId,
            "post"
        );

        if (alreadyReposted) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.DUPLICATE,
                "You have already reposted this post"
            );
        }

        const repost = await repostsRepo.repostTarget(userId, postId, "post");

        await activityRepo.createActivity({
            verb: ActivityVerb.repost_created,
            actor: {
                user_id: new Types.ObjectId(userId)
            },
            target: {
                post_id: post._id
            },
            visibility: "public"
        });

        return {
            repost_id: repost._id.toString(),
            target_id: postId,
            target_type: "post" as const,
            reposts_count: post.reposts_count + 1
        };
    }

    async unrepostPost(postId: string, userId: string) {
        if (!isValidObjectId(postId)) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid post ID"
            );
        }

        const post = await filesRepo.getPostById(postId);

        if (!post) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Post not found"
            );
        }

        const isReposted = await repostsRepo.isRepostedByUser(
            userId,
            postId,
            "post"
        );

        if (!isReposted) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "You have not reposted this post"
            );
        }

        await repostsRepo.unrepostTarget(userId, postId, "post");

        await activityRepo.createActivity({
            verb: ActivityVerb.repost_deleted,
            actor: {
                user_id: new Types.ObjectId(userId)
            },
            target: {
                post_id: post._id
            },
            visibility: "private"
        });

        return {
            target_id: postId,
            target_type: "post" as const,
            reposts_count: Math.max(0, post.reposts_count - 1)
        };
    }

    async repostReel(reelId: string, userId: string) {
        if (!isValidObjectId(reelId)) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid reel ID"
            );
        }

        const reel = await filesRepo.getReelById(reelId);

        if (!reel) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Reel not found"
            );
        }

        if (reel.author.toString() === userId) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "You cannot repost your own reel"
            );
        }

        const alreadyReposted = await repostsRepo.isRepostedByUser(
            userId,
            reelId,
            "reel"
        );

        if (alreadyReposted) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.DUPLICATE,
                "You have already reposted this reel"
            );
        }

        const repost = await repostsRepo.repostTarget(userId, reelId, "reel");

        await activityRepo.createActivity({
            verb: ActivityVerb.repost_created,
            actor: {
                user_id: new Types.ObjectId(userId)
            },
            target: {
                reel_id: reel._id
            },
            visibility: "public"
        });

        return {
            repost_id: repost._id.toString(),
            target_id: reelId,
            target_type: "reel" as const,
            reposts_count: reel.reposts_count + 1
        };
    }

    async unrepostReel(reelId: string, userId: string) {
        if (!isValidObjectId(reelId)) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid reel ID"
            );
        }

        const reel = await filesRepo.getReelById(reelId);

        if (!reel) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Reel not found"
            );
        }

        const isReposted = await repostsRepo.isRepostedByUser(
            userId,
            reelId,
            "reel"
        );

        if (!isReposted) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "You have not reposted this reel"
            );
        }

        await repostsRepo.unrepostTarget(userId, reelId, "reel");

        await activityRepo.createActivity({
            verb: ActivityVerb.repost_deleted,
            actor: {
                user_id: new Types.ObjectId(userId)
            },
            target: {
                reel_id: reel._id
            },
            visibility: "private"
        });

        return {
            target_id: reelId,
            target_type: "reel" as const,
            reposts_count: Math.max(0, reel.reposts_count - 1)
        };
    }

    async getRepostHistory(userId: string, page: number, limit: number) {
        const { reposts, total } = await repostsRepo.getRepostsByUser(
            userId,
            page,
            limit
        );

        const items = [];

        for (const repost of reposts) {
            const targetId = repost.target_id.toString();

            if (repost.target_type === "post") {
                const post = await filesRepo.getPostById(targetId);
                if (!post) continue;

                items.push({
                    type: "post" as const,
                    reposted_at: repost.created_at,
                    post: {
                        post_id: post._id.toString(),
                        caption: post.caption,
                        media_url:
                            post.media_keys.length > 0
                                ? convertImageKeyToImageUrl(post.media_keys[0])
                                : null,
                        likes_count: post.likes_count,
                        comments_count: post.comments_count,
                        reposts_count: post.reposts_count
                    }
                });
            } else if (repost.target_type === "reel") {
                const reel = await filesRepo.getReelById(targetId);
                if (!reel) continue;

                items.push({
                    type: "reel" as const,
                    reposted_at: repost.created_at,
                    reel: {
                        reel_id: reel._id.toString(),
                        caption: reel.caption,
                        thumbnail_url: convertThumbnailKeytoThumbnailUrl(
                            reel.thumbnail_key
                        ),
                        likes_count: reel.likes_count,
                        comments_count: reel.comments_count,
                        views_count: reel.views_count,
                        reposts_count: reel.reposts_count
                    }
                });
            }
        }

        return {
            items,
            total,
            page,
            limit,
            total_pages: Math.ceil(total / limit)
        };
    }

    async getUserRepostsForProfile(userId: string) {
        const reposts = await repostsRepo.getAllRepostsByUser(userId);
        const items = [];

        for (const repost of reposts) {
            const targetId = repost.target_id.toString();

            if (repost.target_type === "post") {
                const post = await filesRepo.getPostById(targetId);
                if (!post || post.is_deleted) continue;

                items.push({
                    repost_id: repost._id.toString(),
                    type: "post" as const,
                    reposted_at: repost.created_at,
                    post: {
                        post_id: post._id.toString(),
                        caption: post.caption,
                        media_urls: post.media_keys.map((key) =>
                            convertImageKeyToImageUrl(key)
                        ),
                        likes_count: post.likes_count,
                        comments_count: post.comments_count,
                        reposts_count: post.reposts_count
                    }
                });
            } else if (repost.target_type === "reel") {
                const reel = await filesRepo.getReelById(targetId);
                if (!reel || reel.is_deleted) continue;

                items.push({
                    repost_id: repost._id.toString(),
                    type: "reel" as const,
                    reposted_at: repost.created_at,
                    reel: {
                        reel_id: reel._id.toString(),
                        caption: reel.caption,
                        thumbnail_url: convertThumbnailKeytoThumbnailUrl(
                            reel.thumbnail_key
                        ),
                        media_url: convertVideoKeyToVideoUrl(reel.media_key),
                        likes_count: reel.likes_count,
                        comments_count: reel.comments_count,
                        views_count: reel.views_count,
                        reposts_count: reel.reposts_count,
                        duration_seconds: reel.duration_seconds
                    }
                });
            }
        }

        return items;
    }
}

export const repostsService = new RepostsService();
