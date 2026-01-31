// upload-avatar.controller.ts
import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler } from "../../utils";
import { UploadAvatarDto } from "../../dtos";
import { usersService } from "../../services";

export const uploadAvatarController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const uploadAvatarDto = new UploadAvatarDto({
            user_id: req.user._id
        });
        await usersService.uploadAvatar(uploadAvatarDto, req.file || null);

        // TODO:
        res.status(200).json({
            message: "Avatar uploaded successfully (simulated)."
        });
    }
);
