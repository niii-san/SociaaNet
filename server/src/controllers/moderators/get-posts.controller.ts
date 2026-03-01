import { Response } from "express";
import { asyncHandler, HttpSuccess } from "../../utils";
import { RequestWithUserContext } from "../../types";
import { moderatorService } from "../../services/moderator.service";

export const getModPostsController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const filter = req.query.filter as string | undefined;

        const result = await moderatorService.getPosts(page, limit, filter);
        return res
            .status(200)
            .json(
                new HttpSuccess(200, true, "Posts fetched", result.posts, {
                    pagination: result.pagination
                })
            );
    }
);
