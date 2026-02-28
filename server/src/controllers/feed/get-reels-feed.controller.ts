import { Request, Response } from "express";
import { asyncHandler, HttpSuccess } from "../../utils";
import { feedService } from "../../services/feed.service";

export const getReelsFeedController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = (req as any).userId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = Math.min(
            parseInt(req.query.limit as string) || 10,
            20
        );

        const reelsFeed = await feedService.getReelsFeed(
            userId,
            page,
            limit
        );

        return res
            .status(200)
            .json(
                new HttpSuccess(200, true, "Reels feed fetched", reelsFeed)
            );
    }
);
