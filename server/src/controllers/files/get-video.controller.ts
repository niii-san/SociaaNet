import { Response } from "express";
import { fileServiceClient } from "../../clients";
import { GetImageDto } from "../../dtos";
import { filesService } from "../../services";
import { asyncHandler } from "../../utils";
import { RequestWithUserContext } from "../../types";

interface ReqWithParams extends RequestWithUserContext {
    params: {
        videoKey: string;
    };
}
export const getVideoController = asyncHandler(
    async (req: ReqWithParams, res: Response) => {
        const userId = req.user._id.toString();
        const { videoKey } = req.params;

        const reel = await filesService.getReelVideo(videoKey, userId);

        const videoStream = await fileServiceClient.getVideoStream(
            reel.video_key
        );

        res.setHeader("Content-Type", "video/mp4");
        videoStream.data.pipe(res);
    }
);
