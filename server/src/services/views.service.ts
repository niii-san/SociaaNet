import { isValidObjectId } from "mongoose";
import { ErrorCodes } from "../constants/error-code";
import { filesRepo, viewsRepo } from "../repositories";
import { HttpError } from "../utils";

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
}

export const viewsService = new ViewsService();
