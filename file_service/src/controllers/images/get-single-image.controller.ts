import { asyncHandler, HttpError } from "../../utils";
import { Request, Response } from "express";
import path from "path";
import fs from "fs";

interface ReqWithParams extends Request {
    params: {
        imageKey: string;
    };
}

export const getSingleImageController = asyncHandler(
    async (req: ReqWithParams, res: Response) => {
        const { imageKey } = req.params;

        const IMAGE_DIR = path.join(process.cwd(), "storage/images");
        const imagePath = path.join(IMAGE_DIR, `${imageKey}`);

        if (!fs.existsSync(imagePath)) {
            throw new HttpError(404, false, "NOT_FOUND", "Image not found");
        }

        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Cache-Control", "private, max-age=3600");

        const stream = fs.createReadStream(imagePath);
        stream.pipe(res);
    }
);
