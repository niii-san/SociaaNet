import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess, convertImageKeyToImageUrl } from "../../utils";
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

        const buffers = files.map((f) => f.buffer);
        const result = await fileServiceClient.uploadMultipleImages(buffers);

        const mediaData = result.data.images.map((img) => ({
            key: img.image_key,
            url: convertImageKeyToImageUrl(img.image_key)
        }));

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
