import { asyncHandler, HttpError } from "../../utils";
import { Request, Response } from "express";
import path from "path";
import fs from "fs";

interface ReqWithParams extends Request {
    params: {
        videoKey: string;
    };
}

export const getVideoController = asyncHandler(
    async (req: ReqWithParams, res: Response) => {
        const { videoKey } = req.params;

        const videoDir = path.join(process.cwd(), "storage/videos");
        const videoPath = path.join(videoDir, videoKey);


        if (!fs.existsSync(videoPath)) {
            throw new HttpError(
                404,
                false,
                "VIDEO_NOT_FOUND",
                "The requested video does not exist"
            );
        }

        res.setHeader("Content-Type", `video/${path.extname(videoPath).slice(1)}`);
        res.setHeader("Content-Disposition", `inline; filename="${videoKey}"`);
        res.setHeader("Cache-Control", "public, max-age=31536000");
        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Content-Length", fs.statSync(videoPath).size);
        res.status(200);
        
        const stream = fs.createReadStream(videoPath);
        stream.pipe(res);
    }
);
