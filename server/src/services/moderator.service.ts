import { moderatorRepo } from "../repositories/moderator.repository";
import {
    HttpError,
    convertImageKeyToImageUrl,
    convertVideoKeyToVideoUrl,
    convertThumbnailKeytoThumbnailUrl
} from "../utils";
import { ErrorCodes } from "../constants/error-code";
import { notificationService } from "./notification.service";
import { Post } from "../models/post.model";
import { Reel } from "../models/reel.model";

class ModeratorService {
    // ─── Dashboard ─────────────────────────────────────────────

    async getDashboardStats() {
        return moderatorRepo.getDashboardStats();
    }

    // ─── User Management ───────────────────────────────────────

    async getAllUsers(page: number, limit: number, search?: string, filter?: string) {
        return moderatorRepo.getAllUsers(page, limit, search, filter);
    }

    async disableUser(userId: string, moderatorId: string) {
        const user = await moderatorRepo.getUserDetails(userId);
        if (!user) {
            throw new HttpError(404, false, ErrorCodes.NOT_FOUND, "User not found");
        }

        if (user.role === "moderator" || user.role === "system_admin") {
            throw new HttpError(
                403,
                false,
                ErrorCodes.FORBIDDEN,
                "Cannot disable a moderator or admin account"
            );
        }

        if (userId === moderatorId) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Cannot disable your own account"
            );
        }

        const disabled = await moderatorRepo.disableUser(userId);
        if (!disabled) {
            throw new HttpError(404, false, ErrorCodes.NOT_FOUND, "User not found");
        }

        // Notify the user
        await notificationService.notify({
            recipientId: userId,
            senderId: moderatorId,
            type: "mod_account_disabled",
            targetType: "user",
            content: "Your account has been disabled by a moderator for violating community guidelines."
        });

        return { message: "User account disabled successfully" };
    }

    async enableUser(userId: string, moderatorId: string) {
        const user = await moderatorRepo.getUserDetails(userId);
        if (!user) {
            throw new HttpError(404, false, ErrorCodes.NOT_FOUND, "User not found");
        }

        const enabled = await moderatorRepo.enableUser(userId);
        if (!enabled) {
            throw new HttpError(404, false, ErrorCodes.NOT_FOUND, "User not found");
        }

        // Notify the user
        await notificationService.notify({
            recipientId: userId,
            senderId: moderatorId,
            type: "mod_account_enabled",
            targetType: "user",
            content: "Your account has been re-enabled."
        });

        return { message: "User account enabled successfully" };
    }

    async getUserDetails(userId: string) {
        const user = await moderatorRepo.getUserDetails(userId);
        if (!user) {
            throw new HttpError(404, false, ErrorCodes.NOT_FOUND, "User not found");
        }

        return {
            ...user,
            user_id: user._id,
            avatar_url: user.avatar_key
                ? convertImageKeyToImageUrl(user.avatar_key)
                : null
        };
    }

    // ─── Content Moderation ────────────────────────────────────

    async getPosts(page: number, limit: number, filter?: string) {
        const result = await moderatorRepo.getPosts(page, limit, filter);

        const posts = result.posts.map((post: any) => {
            const author = post.author;
            return {
                post_id: post._id,
                caption: post.caption,
                media_keys: post.media_keys,
                hashtags: post.hashtags,
                likes_count: post.likes_count,
                comments_count: post.comments_count,
                is_removed_by_moderator: post.is_removed_by_moderator,
                visibility: post.visibility,
                created_at: post.created_at,
                author: author
                    ? {
                          user_id: author._id,
                          username: author.username,
                          full_name: author.full_name,
                          avatar_url: author.avatar_key
                              ? convertImageKeyToImageUrl(author.avatar_key)
                              : null
                      }
                    : null
            };
        });

        return { posts, pagination: result.pagination };
    }

    async removePost(postId: string, moderatorId: string) {
        // Get post first to know the author
        const postDoc = await Post.findById(postId);
        if (!postDoc) {
            throw new HttpError(404, false, ErrorCodes.NOT_FOUND, "Post not found");
        }

        const post = await moderatorRepo.removePost(postId);
        if (!post) {
            throw new HttpError(404, false, ErrorCodes.NOT_FOUND, "Post not found");
        }

        // Notify the post author
        await notificationService.notify({
            recipientId: postDoc.author.toString(),
            senderId: moderatorId,
            type: "mod_post_removed",
            targetId: postId,
            targetType: "post",
            content: "Your post has been removed by a moderator for violating community guidelines."
        });

        return { message: "Post removed successfully" };
    }

    async restorePost(postId: string) {
        const post = await moderatorRepo.restorePost(postId);
        if (!post) {
            throw new HttpError(404, false, ErrorCodes.NOT_FOUND, "Post not found");
        }
        return { message: "Post restored successfully" };
    }

    async getReels(page: number, limit: number, filter?: string) {
        const result = await moderatorRepo.getReels(page, limit, filter);

        const reels = result.reels.map((reel: any) => {
            const author = reel.author;
            return {
                reel_id: reel._id,
                caption: reel.caption,
                media_key: reel.media_key,
                thumbnail_key: reel.thumbnail_key,
                thumbnail_url: reel.thumbnail_key
                    ? convertThumbnailKeytoThumbnailUrl(reel.thumbnail_key)
                    : null,
                hashtags: reel.hashtags,
                likes_count: reel.likes_count,
                comments_count: reel.comments_count,
                views_count: reel.views_count,
                is_removed_by_moderator: reel.is_removed_by_moderator,
                visibility: reel.visibility,
                duration_seconds: reel.duration_seconds,
                created_at: reel.created_at,
                author: author
                    ? {
                          user_id: author._id,
                          username: author.username,
                          full_name: author.full_name,
                          avatar_url: author.avatar_key
                              ? convertImageKeyToImageUrl(author.avatar_key)
                              : null
                      }
                    : null
            };
        });

        return { reels, pagination: result.pagination };
    }

    async removeReel(reelId: string, moderatorId: string) {
        // Get reel first to know the author
        const reelDoc = await Reel.findById(reelId);
        if (!reelDoc) {
            throw new HttpError(404, false, ErrorCodes.NOT_FOUND, "Reel not found");
        }

        const reel = await moderatorRepo.removeReel(reelId);
        if (!reel) {
            throw new HttpError(404, false, ErrorCodes.NOT_FOUND, "Reel not found");
        }

        // Notify the reel author
        await notificationService.notify({
            recipientId: reelDoc.author.toString(),
            senderId: moderatorId,
            type: "mod_reel_removed",
            targetId: reelId,
            targetType: "reel",
            content: "Your reel has been removed by a moderator for violating community guidelines."
        });

        return { message: "Reel removed successfully" };
    }

    async restoreReel(reelId: string) {
        const reel = await moderatorRepo.restoreReel(reelId);
        if (!reel) {
            throw new HttpError(404, false, ErrorCodes.NOT_FOUND, "Reel not found");
        }
        return { message: "Reel restored successfully" };
    }

    async removeComment(commentId: string) {
        const comment = await moderatorRepo.removeComment(commentId);
        if (!comment) {
            throw new HttpError(404, false, ErrorCodes.NOT_FOUND, "Comment not found");
        }
        return { message: "Comment removed successfully" };
    }
}

export const moderatorService = new ModeratorService();
