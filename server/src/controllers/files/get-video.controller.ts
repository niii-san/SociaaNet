import { Response } from "express";
import { fileServiceClient } from "../../clients";
import { asyncHandler } from "../../utils";

interface ReqWithParams extends Request {
    params: {
        videoKey: string;
    };
}
export const getVideoController = asyncHandler(
    async (req: ReqWithParams, res: Response) => {
        const { videoKey } = req.params;

        const videoStream = await fileServiceClient.getVideoStream(videoKey);

        res.setHeader("Content-Type", "video/mp4");
        res.setHeader("Cache-Control", "private, max-age=3600");

        videoStream.data.pipe(res);
    }
);
