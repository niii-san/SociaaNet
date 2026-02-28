import { Request, Response } from "express";
import { asyncHandler, HttpSuccess } from "../../utils";
import { feedService } from "../../services/feed.service";

export const getExploreController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = (req as any).userId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = Math.min(
            parseInt(req.query.limit as string) || 20,
            40
        );

        const explore = await feedService.getExplore(userId, page, limit);

        return res
            .status(200)
            .json(
                new HttpSuccess(200, true, "Explore content fetched", explore)
            );
    }
);
