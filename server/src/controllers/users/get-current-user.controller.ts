import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { GetUserByIdDto } from "../../dtos";
import { usersService } from "../../services";

export const getCurrentUserController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const dto = new GetUserByIdDto(req.user._id as unknown as string);

        const user = await usersService.getUserById(dto);

        return res
            .status(200)
            .json(
                new HttpSuccess(200, true, "User fetched successfully", user)
            );
    }
);
