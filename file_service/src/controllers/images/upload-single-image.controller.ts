import { Request, Response } from "express";
import { asyncHandler, HttpError, HttpSuccess } from "../../utils";
import path from "path";
import fs from "fs";
import { v4 as uuid } from "uuid";
import sharp from "sharp";

export const uploadSingleImageController = asyncHandler(
    async (req: Request, res: Response) => {
        const IMAGE_DIR = path.join(process.cwd(), "storage/images");

        if (!fs.existsSync(IMAGE_DIR)) {
            fs.mkdirSync(IMAGE_DIR, { recursive: true });
        }

        if (!req.file || !req.file.mimetype.startsWith("image/")) {
            throw new HttpError(
                400,
                false,
                "INVALID_FILE",
                "Invalid image type"
            );
        }

        const fileId = uuid();
        const filename = `${fileId}.jpg`;
        const filepath = path.join(IMAGE_DIR, filename);

        await sharp(req.file.buffer).jpeg({ quality: 100 }).toFile(filepath);

        return res.status(201).json(
            new HttpSuccess(true, 201, "Image uploaded", {
                image_key: filename,
                image_id: fileId
            })
        );
    }
);
