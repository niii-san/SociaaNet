import { Response } from "express";
import { fileServiceClient } from "../../clients";
import { asyncHandler } from "../../utils";

interface ReqWithParams extends Request {
    params: {
        thumbnailKey: string;
    };
}
export const getThumbnailController = asyncHandler(
    async (req: ReqWithParams, res: Response) => {
        const { thumbnailKey } = req.params;

        const response =
            await fileServiceClient.getThumbnailStream(thumbnailKey);

        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Cache-Control", "private, max-age=3600");

        response.data.pipe(res);
    }
);
