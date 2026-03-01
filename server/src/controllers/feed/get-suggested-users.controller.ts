import { Response } from "express";
import { asyncHandler, HttpSuccess } from "../../utils";
import { feedService } from "../../services/feed.service";
import { RequestWithUserContext } from "../../types";

export const getSuggestedUsersController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();
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
