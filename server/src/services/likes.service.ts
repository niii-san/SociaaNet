import { isValidObjectId } from "mongoose";
import { ErrorCodes } from "../constants/error-code";
import { filesRepo } from "../repositories";
import { likesRepo } from "../repositories/likes.repository";
import {
    HttpError,
    convertImageKeyToImageUrl,
    convertVideoKeyToVideoUrl,
    convertThumbnailKeytoThumbnailUrl
} from "../utils";
import { activityRepo } from "../repositories";
import { ActivityVerb } from "../types";
import { Types } from "mongoose";

class LikesService {
    async likePost(postId: string, userId: string) {
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

        const alreadyLiked = await likesRepo.isLikedByUser(
            userId,
            postId,
            "post"
        );

        if (alreadyLiked) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.DUPLICATE,
                "You have already liked this post"
            );
        }

        const like = await likesRepo.likeTarget(userId, postId, "post");

        await activityRepo.createActivity({
            verb: ActivityVerb.post_liked,
            actor: {
                user_id: new Types.ObjectId(userId)
            },
            target: {
                post_id: post._id
            },
            visibility: "public"
        });

        return {
            like_id: like._id.toString(),
            target_id: postId,
            target_type: "post",
            likes_count: post.likes_count + 1
        };
    }

    async unlikePost(postId: string, userId: string) {
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

        const isLiked = await likesRepo.isLikedByUser(
            userId,
            postId,
            "post"
        );

        if (!isLiked) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "You have not liked this post"
            );
        }

        await likesRepo.unlikeTarget(userId, postId, "post");

        await activityRepo.createActivity({
            verb: ActivityVerb.post_unliked,
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
            target_type: "post",
            likes_count: Math.max(0, post.likes_count - 1)
        };
    }

    async likeReel(reelId: string, userId: string) {
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

        const alreadyLiked = await likesRepo.isLikedByUser(
            userId,
            reelId,
            "reel"
        );

        if (alreadyLiked) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.DUPLICATE,
                "You have already liked this reel"
            );
        }

        const like = await likesRepo.likeTarget(userId, reelId, "reel");

        await activityRepo.createActivity({
            verb: ActivityVerb.post_liked,
            actor: {
                user_id: new Types.ObjectId(userId)
            },
            target: {
                reel_id: reel._id
            },
            visibility: "public"
        });

        return {
            like_id: like._id.toString(),
            target_id: reelId,
            target_type: "reel",
            likes_count: reel.likes_count + 1
        };
    }

    async unlikeReel(reelId: string, userId: string) {
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

        const isLiked = await likesRepo.isLikedByUser(
            userId,
            reelId,
            "reel"
        );

        if (!isLiked) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "You have not liked this reel"
            );
        }

        await likesRepo.unlikeTarget(userId, reelId, "reel");

        await activityRepo.createActivity({
            verb: ActivityVerb.post_unliked,
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
            target_type: "reel",
            likes_count: Math.max(0, reel.likes_count - 1)
        };
    }

    async getLikeHistory(userId: string, page: number, limit: number) {
        const { likes, total } = await likesRepo.getLikesByUser(
            userId,
            page,
            limit
        );

        const items = [];

        for (const like of likes) {
            const targetId = like.target_id.toString();

            if (like.target_type === "post") {
                const post = await filesRepo.getPostById(targetId);
                if (!post) continue;

                items.push({
                    type: "post" as const,
                    liked_at: like.created_at,
                    post: {
                        post_id: post._id.toString(),
                        caption: post.caption,
                        media_url: post.media_keys.length > 0
                            ? convertImageKeyToImageUrl(post.media_keys[0])
                            : null,
                        likes_count: post.likes_count,
                        comments_count: post.comments_count
                    }
                });
            } else if (like.target_type === "reel") {
                const reel = await filesRepo.getReelById(targetId);
                if (!reel) continue;

                items.push({
                    type: "reel" as const,
                    liked_at: like.created_at,
                    reel: {
                        reel_id: reel._id.toString(),
                        caption: reel.caption,
                        thumbnail_url: convertThumbnailKeytoThumbnailUrl(
                            reel.thumbnail_key
                        ),
                        likes_count: reel.likes_count,
                        comments_count: reel.comments_count,
                        views_count: reel.views_count
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
}

export const likesService = new LikesService();
