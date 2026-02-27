import { asyncHandler, HttpError } from "../../utils";
import { Request, Response } from "express";
import path from "path";
import fs from "fs";

interface ReqWithParams extends Request {
    params: {
        thumbnailKey: string;
    };
}

export const getThumbnailController = asyncHandler(
    async (req: ReqWithParams, res: Response) => {
        const { thumbnailKey } = req.params;

        const thumbDir = path.join(process.cwd(), "storage/thumbnails");
        const thumbnailPath = path.join(thumbDir, thumbnailKey);

        if (!fs.existsSync(thumbnailPath)) {
            throw new HttpError(
                404,
                false,
                "THUMBNAIL_NOT_FOUND",
                "The requested thumbnail does not exist"
            );
        }

        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Cache-Control", "private, max-age=3600");

        const stream = fs.createReadStream(thumbnailPath);
        stream.pipe(res);
    }
);
