import { Response } from "express";
import { fileServiceClient } from "../../clients";
import { asyncHandler } from "../../utils";

interface ReqWithParams extends Request {
    params: {
        imageKey: string;
    };
}
export const getImageController = asyncHandler(
    async (req: ReqWithParams, res: Response) => {
        const { imageKey } = req.params;

        const response = await fileServiceClient.getImageStream(imageKey);

        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Cache-Control", "private, max-age=3600");

        response.data.pipe(res);
    }
);
