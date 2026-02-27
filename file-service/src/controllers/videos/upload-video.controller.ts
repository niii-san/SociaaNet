import { Request, Response } from "express";
import { asyncHandler, HttpSuccess, HttpError } from "../../utils";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";

export const uploadVideoController = asyncHandler(
    async (req: Request, res: Response) => {
        const videoDir = path.join(process.cwd(), "storage/videos");

        if (!fs.existsSync(videoDir)) {
            fs.mkdirSync(videoDir, { recursive: true });
        }

        const videoFile = req.file;

        if (!videoFile) {
            throw new HttpError(
                400,
                false,
                "NO_FILE",
                "Video file is required"
            );
        }

        if (!videoFile.mimetype.startsWith("video/")) {
            throw new HttpError(
                400,
                false,
                "INVALID_FILE_TYPE",
                "Only video files are allowed"
            );
        }

        const fileId = uuid();
        const fileExtension = path.extname(videoFile.originalname);
        const newFileName = `${fileId}${fileExtension}`;
        const newFilePath = path.join(videoDir, newFileName);

        fs.renameSync(videoFile.path, newFilePath);

        return res.status(200).json(
            new HttpSuccess(true, 201, "Video uploaded successfully", {
                video_id: fileId,
                video_key: newFileName
            })
        );
    }
);
