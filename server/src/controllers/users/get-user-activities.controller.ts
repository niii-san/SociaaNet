import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { usersService } from "../../services";

export const getUserActivitiesController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id;

        const activities = await usersService.getUserActivities(
            userId.toString()
        );

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Activities retrieved successfully",
                    activities
                )
            );
    }
);
