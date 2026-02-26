import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { UploadPostDto } from "../../dtos";
import { filesService } from "../../services";

export const uploadPostController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const dtoParams = {
            userId: req.user._id.toString(),
            files: req.files as Express.Multer.File[],
            caption: req.body?.caption ?? "",
            visibility: req.body?.visibility ?? ""
        };

        const dto = new UploadPostDto(dtoParams);
        const result = await filesService.uploadPost(dto);

        return res
            .status(200)
            .json(
                new HttpSuccess(200, true, "Post uploaded successfully", result)
            );
    }
);
