import { Response } from "express";
import { asyncHandler, HttpSuccess } from "../../utils";
import { RequestWithUserContext } from "../../types";
import { moderatorService } from "../../services/moderator.service";

export const getModAllUsersController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const search = req.query.search as string | undefined;
        const filter = req.query.filter as string | undefined;

        const result = await moderatorService.getAllUsers(page, limit, search, filter);
        return res
            .status(200)
            .json(new HttpSuccess(200, true, "Users fetched", result.users, { pagination: result.pagination }));
    }
);
