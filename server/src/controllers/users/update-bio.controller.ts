import { asyncHandler, HttpSuccess } from "../../utils";
import { RequestWithUserContext } from "../../types";
import { Response } from "express";
import { usersService } from "../../services";
import { UpdateBioDto } from "../../dtos";

export const updateBioController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const bio = req.body?.bio;

        const dto = new UpdateBioDto(req.user._id.toString(), bio);

        const payload = await usersService.updateBio(dto);

        return res
            .status(200)
            .json(
                new HttpSuccess(true, 200, "Bio updated successfully", payload)
            );
    }
);
