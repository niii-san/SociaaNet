import { Request, Response } from "express";
import { asyncHandler } from "../../utils";
import path from "path";
import fs from "fs";
import env from "../../config/env";
import uuid from "uuid";
import sharp from "sharp";

export const uploadSingleImageController = asyncHandler(
    async (req: Request, res: Response) => {
        const IMAGE_DIR = path.join(process.cwd(), "storage/images");

        if (!fs.existsSync(IMAGE_DIR)) {
            fs.mkdirSync(IMAGE_DIR, { recursive: true });
        }

        //OPTIM: use middleware
        if (req.headers["x-internal-api-key"] !== env.internalApiKey) {
            return res.status(403).json({
                message: "Forbidden",
                status: "error"
            });
        }

        if (!req.file || !req.file.mimetype.startsWith("image/")) {
            return res.status(400).json({
                message: "Invalid image file",
                status: "error"
            });
        }

        const filename = `${uuid.v4()}.jpg`;
        const filepath = path.join(IMAGE_DIR, filename);

        await sharp(req.file.buffer).jpeg({ quality: 100 }).toFile(filepath);

        res.json({
            imageKey: filename
        });
    }
);
