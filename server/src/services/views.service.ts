import { isValidObjectId } from "mongoose";
import { ErrorCodes } from "../constants/error-code";
import { filesRepo, viewsRepo } from "../repositories";
import {
    HttpError,
    convertImageKeyToImageUrl,
    convertThumbnailKeytoThumbnailUrl
} from "../utils";

class ViewsService {
    async viewPost(postId: string, userId: string) {
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

        const { created } = await viewsRepo.recordView(
            userId,
            postId,
            "post"
        );

        return {
            target_id: postId,
            target_type: "post" as const,
            is_new_view: created
        };
    }

    async viewReel(reelId: string, userId: string) {
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

        const { created } = await viewsRepo.recordView(
            userId,
            reelId,
            "reel"
        );

        return {
            target_id: reelId,
            target_type: "reel" as const,
            is_new_view: created,
            views_count: created ? reel.views_count + 1 : reel.views_count
        };
    }

    async getWatchHistory(userId: string, page: number, limit: number) {
        const { entries, total } = await viewsRepo.getWatchHistoryByUser(
            userId,
            page,
            limit
        );

        const items = [];

        for (const entry of entries) {
            const targetId = entry.target_id.toString();

            if (entry.target_type === "post") {
                const post = await filesRepo.getPostById(targetId);
                if (!post) continue;

                items.push({
                    type: "post" as const,
                    viewed_at: entry.created_at,
                    post: {
                        post_id: post._id.toString(),
                        caption: post.caption,
                        media_url:
                            post.media_keys.length > 0
                                ? convertImageKeyToImageUrl(post.media_keys[0])
                                : null,
                        likes_count: post.likes_count,
                        comments_count: post.comments_count
                    }
                });
            } else if (entry.target_type === "reel") {
                const reel = await filesRepo.getReelById(targetId);
                if (!reel) continue;

                items.push({
                    type: "reel" as const,
                    viewed_at: entry.created_at,
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

export const viewsService = new ViewsService();
