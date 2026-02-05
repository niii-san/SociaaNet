// upload-avatar.controller.ts
import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { UploadAvatarDto } from "../../dtos";
import { usersService } from "../../services";

export const uploadAvatarController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const uploadAvatarDto = new UploadAvatarDto({
            user_id: req.user._id
        });
        const data = await usersService.uploadAvatar(
            uploadAvatarDto,
            req.file || null
        );

        res.status(200).json(
            new HttpSuccess(200, true, "Avatar uploaded successfully", data)
        );
    }
);
