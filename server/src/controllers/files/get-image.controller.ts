import { Response } from "express";
import { fileServiceClient } from "../../clients";
import { GetImageDto } from "../../dtos";
import { filesService } from "../../services";
import { asyncHandler } from "../../utils";

interface ReqWithParams extends Request {
    params: {
        imageKey: string;
    };
}
export const getImageController = asyncHandler(
    async (req: ReqWithParams, res: Response) => {
        const { imageKey } = req.params;

        const dto = new GetImageDto(imageKey);

        const image = await filesService.getImage(dto);

        const response = await fileServiceClient.getImageStream(
            image.image_key
        );

        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Cache-Control", "private, max-age=3600");

        response.data.pipe(res);
    }
);
