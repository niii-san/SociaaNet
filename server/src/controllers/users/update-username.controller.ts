import { asyncHandler, HttpSuccess } from "../../utils";
import { RequestWithUserContext } from "../../types";
import { Response } from "express";
import { usersService } from "../../services";
import { UpdateUsernameDto } from "../../dtos";

export const updateUsernameController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const newUsername = req.body?.username;

        const dto = new UpdateUsernameDto(req.user._id.toString(), newUsername);

        const payload = await usersService.updateUsername(dto);

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    true,
                    200,
                    "Username updated successfully",
                    payload
                )
            );
    }
);
