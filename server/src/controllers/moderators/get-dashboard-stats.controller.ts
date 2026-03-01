import { Response } from "express";
import { asyncHandler, HttpSuccess } from "../../utils";
import { RequestWithUserContext } from "../../types";
import { moderatorService } from "../../services/moderator.service";

export const getDashboardStatsController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const stats = await moderatorService.getDashboardStats();
        return res
            .status(200)
            .json(new HttpSuccess(200, true, "Dashboard stats fetched", stats));
    }
);
