import { fileServiceClient } from "../clients";
import { ErrorCodes } from "../constants/error-code";
import { GetImageDto, UploadPostDto, UploadReelDto } from "../dtos";
import { filesRepo, userRepo } from "../repositories";
import {
    convertImageKeyToImageUrl,
    convertVideoKeytoVideoUrl,
    HttpError
} from "../utils";
import { extractHashtags } from "../utils/extract-hashtags";

class FilesService {
    async getImage(dto: GetImageDto) {
        const image = await filesRepo.getImageMetaDataByKey(dto.imageKey);

        if (!image)
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Image not found"
            );

        //TODO: implement visibility check
        // if(image.visibility !== "private"){
        //     throw new HttpError(403,false,"FORBIDDEN","Image not found")
        // }

        return image;
    }

    async uploadPost(dto: UploadPostDto) {
        const { userId, files, caption, visibility } = dto;
        let visibilityValue = visibility;

        if (!files || files.length === 0) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "No files provided"
            );
        }
        if (
            !visibility ||
            !["public", "private", "followers"].includes(visibility)
        ) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid visibility value"
            );
        }

        const user = await userRepo.getUserById(userId);
        if (!user) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "User not found"
            );
        }

        const isUserAccountPrivate = user.is_private_account;

        if (visibility === "public" && isUserAccountPrivate) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Cannot set visibility to public for a private account"
            );
        }

        if (visibility === "followers" && !isUserAccountPrivate) {
            visibilityValue = "public";
        }

        const buffers = files.map((file) => file.buffer);
        const hashtags = extractHashtags(caption);

        // Upload images to file service and get the image keys
        const images = await fileServiceClient.uploadMultipleImages(buffers);
        const imageKeys = images.data.images.map((img: any) => img.image_key);

        const post = await filesRepo.createPost(
            userId,
            imageKeys,
            caption,
            hashtags,
            visibility
        );

        return {
            post_id: post._id,
            image_urls: post.media_keys.map((key) =>
                convertImageKeyToImageUrl(key)
            ),
            caption: post.caption,
            hashtags: post.hashtags,
            visibility: post.visibility,
            created_at: post.created_at,
            likes_count: post.likes_count,
            comments_count: post.comments_count
        };
    }

    async uploadReel(dto: UploadReelDto) {
        if (!dto.file) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "No file provided"
            );
        }

        if (!dto.visibility) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid visibility value"
            );
        }

        if (!["public", "private", "followers"].includes(dto.visibility)) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid visibility value"
            );
        }

        const user = await userRepo.getUserById(dto.userId);

        if (!user) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "User not found"
            );
        }

        let validVisibility = dto.visibility;

        if (dto.visibility === "public" && user.is_private_account) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Cannot set visibility to public for a private account"
            );
        }

        if (dto.visibility === "followers" && !user.is_private_account) {
            validVisibility = "public";
        }

        const uploadedReel = await fileServiceClient.uploadVideo(
            dto.file.buffer,
            dto.file.originalname
        );

        const hashtags = extractHashtags(dto.caption);

        const reel = await filesRepo.createReel(
            dto.userId,
            uploadedReel.data.video_key,
            uploadedReel.data.thumbnail_key,
            dto.caption,
            hashtags,
            dto.visibility,
            uploadedReel.data.duration
        );

        return {
            reel_id: reel._id,
            video_url: convertVideoKeytoVideoUrl(reel.media_key),
            thumbnail_url: convertImageKeyToImageUrl(reel.thumbnail_key),
            caption: reel.caption,
            hashtags: reel.hashtags,
            visibility: reel.visibility,
            duration_seconds: reel.duration_seconds,
            created_at: reel.created_at,
            likes_count: reel.likes_count,
            views_count: reel.views_count,
            comments_count: reel.comments_count
        };
    }
}

export const filesService = new FilesService();
