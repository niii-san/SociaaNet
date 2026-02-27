import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { UploadReelDto } from "../../dtos";
import { filesService } from "../../services";

export const uploadReelController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const dtoParams = {
            userId: req.user._id.toString(),
            file: (req.file as Express.Multer.File) || null,
            caption: req.body?.caption ?? "",
            visibility: req.body?.visibility ?? ""
        };

        const dto = new UploadReelDto(dtoParams);
        const result = await filesService.uploadReel(dto);

        return res
            .status(201)
            .json(
                new HttpSuccess(201, true, "Reel uploaded successfully", result)
            );
    }
);
