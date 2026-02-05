import { asyncHandler, HttpSuccess } from "../../utils";
import { RequestWithUserContext } from "../../types";
import { Response } from "express";
import { usersService } from "../../services";
import { UpdateFullNameDto } from "../../dtos";

export const updateFullNameController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const fullName = req.body?.full_name || "";

        const dto = new UpdateFullNameDto(req.user._id.toString(), fullName);

        const payload = await usersService.updateFullName(dto);

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "FullName updated successfully",
                    payload
                )
            );
    }
);
