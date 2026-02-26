import { Request, Response } from "express";
import { asyncHandler, HttpError, HttpSuccess } from "../../utils";
import path from "path";
import fs from "fs";
import { v4 as uuid } from "uuid";
import sharp from "sharp";

export const uploadMultipleImagesController = asyncHandler(
    async (req: Request, res: Response) => {
        const IMAGE_DIR = path.join(process.cwd(), "storage/images");

        if (!fs.existsSync(IMAGE_DIR)) {
            fs.mkdirSync(IMAGE_DIR, { recursive: true });
        }

        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw new HttpError(400, false, "NO_FILES", "No images uploaded");
        }

        const areAllImages = req.files.every((file) =>
            file.mimetype.startsWith("image/")
        );
        if (!areAllImages) {
            throw new HttpError(
                400,
                false,
                "INVALID_FILE_TYPE",
                "All uploaded files must be images"
            );
        }

        const uploadedImages: { image_key: string; image_id: string }[] = [];

        for (const file of req.files) {
            const fileId = uuid();
            const filename = `${fileId}.jpg`;
            const filepath = path.join(IMAGE_DIR, filename);

            await sharp(file.buffer).jpeg({ quality: 100 }).toFile(filepath);
            uploadedImages.push({
                image_key: filename,
                image_id: fileId
            });
        }

        return res.status(201).json(
            new HttpSuccess(true, 201, "Images uploaded", {
                images: uploadedImages
            })
        );
    }
);
