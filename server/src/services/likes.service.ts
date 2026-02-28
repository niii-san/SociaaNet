import { isValidObjectId } from "mongoose";
import { ErrorCodes } from "../constants/error-code";
import { filesRepo } from "../repositories";
import { likesRepo } from "../repositories/likes.repository";
import { HttpError } from "../utils";
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
}

export const likesService = new LikesService();
