import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import {
    asyncHandler,
    HttpSuccess,
    convertImageKeyToImageUrl,
    convertVideoKeyToVideoUrl
} from "../../utils";
import { fileServiceClient } from "../../clients";

// POST /api/v1/chat/upload
export const uploadChatMediaController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res
                .status(400)
                .json(new HttpSuccess(400, false, "No files provided", null));
        }

        const imageFiles = files.filter((f) =>
            f.mimetype.startsWith("image/")
        );
        const videoFiles = files.filter((f) =>
            f.mimetype.startsWith("video/")
        );

        const mediaData: { key: string; url: string; type: "image" | "video" }[] = [];

        // Upload images
        if (imageFiles.length > 0) {
            const buffers = imageFiles.map((f) => f.buffer);
            const result =
                await fileServiceClient.uploadMultipleImages(buffers);
            for (const img of result.data.images) {
                mediaData.push({
                    key: img.image_key,
                    url: convertImageKeyToImageUrl(img.image_key),
                    type: "image"
                });
            }
        }

        // Upload videos one by one
        for (const videoFile of videoFiles) {
            const result = await fileServiceClient.uploadVideo(
                videoFile.buffer,
                videoFile.originalname
            );
            mediaData.push({
                key: result.data.video_key,
                url: convertVideoKeyToVideoUrl(result.data.video_key),
                type: "video"
            });
        }

        return res
            .status(200)
            .json(
                new HttpSuccess(200, true, "Media uploaded", {
                    media: mediaData,
                    keys: mediaData.map((m) => m.key),
                    urls: mediaData.map((m) => m.url)
                })
            );
    }
);
