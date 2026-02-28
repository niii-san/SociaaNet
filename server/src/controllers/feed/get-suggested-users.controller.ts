import { Request, Response } from "express";
import { asyncHandler, HttpSuccess } from "../../utils";
import { feedService } from "../../services/feed.service";

export const getSuggestedUsersController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = (req as any).userId;
        const limit = Math.min(
            parseInt(req.query.limit as string) || 5,
            20
        );

        const users = await feedService.getSuggestedUsers(userId, limit);

        return res
            .status(200)
            .json(
                new HttpSuccess(200, true, "Suggested users fetched", users)
            );
    }
);
