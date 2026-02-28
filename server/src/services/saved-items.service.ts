import { isValidObjectId } from "mongoose";
import { ErrorCodes } from "../constants/error-code";
import { filesRepo, savedItemsRepo } from "../repositories";
import {
    HttpError,
    convertImageKeyToImageUrl,
    convertThumbnailKeytoThumbnailUrl,
    convertVideoKeyToVideoUrl
} from "../utils";

class SavedItemsService {
    async savePost(postId: string, userId: string) {
        if (!isValidObjectId(postId)) {
            throw new HttpError(400, false, ErrorCodes.INVALID_INPUT, "Invalid post ID");
        }

        const post = await filesRepo.getPostById(postId);
        if (!post) {
            throw new HttpError(404, false, ErrorCodes.NOT_FOUND, "Post not found");
        }

        const alreadySaved = await savedItemsRepo.isSavedByUser(userId, postId, "post");
        if (alreadySaved) {
            throw new HttpError(409, false, ErrorCodes.DUPLICATE, "Post already saved");
        }

        const savedItem = await savedItemsRepo.saveItem(userId, postId, "post");

        return {
            saved_item_id: savedItem._id.toString(),
            target_id: postId,
            target_type: "post" as const
        };
    }

    async unsavePost(postId: string, userId: string) {
        if (!isValidObjectId(postId)) {
            throw new HttpError(400, false, ErrorCodes.INVALID_INPUT, "Invalid post ID");
        }

        const removed = await savedItemsRepo.unsaveItem(userId, postId, "post");
        if (!removed) {
            throw new HttpError(404, false, ErrorCodes.NOT_FOUND, "Post not in saved items");
        }

        return {
            target_id: postId,
            target_type: "post" as const
        };
    }

    async saveReel(reelId: string, userId: string) {
        if (!isValidObjectId(reelId)) {
            throw new HttpError(400, false, ErrorCodes.INVALID_INPUT, "Invalid reel ID");
        }

        const reel = await filesRepo.getReelById(reelId);
        if (!reel) {
            throw new HttpError(404, false, ErrorCodes.NOT_FOUND, "Reel not found");
        }

        const alreadySaved = await savedItemsRepo.isSavedByUser(userId, reelId, "reel");
        if (alreadySaved) {
            throw new HttpError(409, false, ErrorCodes.DUPLICATE, "Reel already saved");
        }

        const savedItem = await savedItemsRepo.saveItem(userId, reelId, "reel");

        return {
            saved_item_id: savedItem._id.toString(),
            target_id: reelId,
            target_type: "reel" as const
        };
    }

    async unsaveReel(reelId: string, userId: string) {
        if (!isValidObjectId(reelId)) {
            throw new HttpError(400, false, ErrorCodes.INVALID_INPUT, "Invalid reel ID");
        }

        const removed = await savedItemsRepo.unsaveItem(userId, reelId, "reel");
        if (!removed) {
            throw new HttpError(404, false, ErrorCodes.NOT_FOUND, "Reel not in saved items");
        }

        return {
            target_id: reelId,
            target_type: "reel" as const
        };
    }

    async getSavedItems(userId: string, page: number = 1, limit: number = 20) {
        const { items, total } = await savedItemsRepo.getSavedByUser(userId, page, limit);

        const resolvedItems = await Promise.all(
            items.map(async (item) => {
                if (item.target_type === "post") {
                    const post = await filesRepo.getPostById(item.target_id.toString());
                    if (!post) return null;

                    return {
                        type: "post" as const,
                        saved_at: item.created_at,
                        post: {
                            post_id: post._id.toString(),
                            caption: post.caption,
                            media_url: post.media_keys.length > 0
                                ? convertImageKeyToImageUrl(post.media_keys[0])
                                : null,
                            likes_count: post.likes_count,
                            comments_count: post.comments_count
                        }
                    };
                } else {
                    const reel = await filesRepo.getReelById(item.target_id.toString());
                    if (!reel) return null;

                    return {
                        type: "reel" as const,
                        saved_at: item.created_at,
                        reel: {
                            reel_id: reel._id.toString(),
                            caption: reel.caption,
                            thumbnail_url: convertThumbnailKeytoThumbnailUrl(reel.thumbnail_key),
                            likes_count: reel.likes_count,
                            comments_count: reel.comments_count,
                            views_count: reel.views_count
                        }
                    };
                }
            })
        );

        const filtered = resolvedItems.filter(Boolean);
        const totalPages = Math.ceil(total / limit);

        return {
            items: filtered,
            total,
            page,
            limit,
            total_pages: totalPages
        };
    }
}

export const savedItemsService = new SavedItemsService();
