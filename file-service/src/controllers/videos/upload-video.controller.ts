import { Request, Response } from "express";
import { asyncHandler, HttpSuccess, HttpError } from "../../utils";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";

const getVideoDuration = (filePath: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) return reject(err);
            resolve(metadata.format.duration || 0);
        });
    });
};

const generateThumbnail = (
    videoPath: string,
    thumbnailPath: string
): Promise<void> => {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .screenshots({
                timestamps: ["1"],
                filename: path.basename(thumbnailPath),
                folder: path.dirname(thumbnailPath),
                size: "320x?"
            })
            .on("end", () => resolve())
            .on("error", reject);
    });
};

export const uploadVideoController = asyncHandler(
    async (req: Request, res: Response) => {
        const videoDir = path.join(process.cwd(), "storage/videos");
        const thumbDir = path.join(process.cwd(), "storage/thumbnails");

        if (!fs.existsSync(videoDir)) {
            fs.mkdirSync(videoDir, { recursive: true });
        }

        if (!fs.existsSync(thumbDir)) {
            fs.mkdirSync(thumbDir, { recursive: true });
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

        // Move uploaded file
        fs.writeFileSync(newFilePath, videoFile.buffer);

        // 1️⃣ Get duration
        const duration = await getVideoDuration(newFilePath);

        // 2️⃣ Generate thumbnail
        const thumbnailName = `${fileId}.jpg`;
        const thumbnailPath = path.join(thumbDir, thumbnailName);

        await generateThumbnail(newFilePath, thumbnailPath);

        return res.status(200).json(
            new HttpSuccess(true, 201, "Video uploaded successfully", {
                video_id: fileId,
                video_key: newFileName,
                duration,
                thumbnail_key: thumbnailName
            })
        );
    }
);
