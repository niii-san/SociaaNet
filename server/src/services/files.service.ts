import { fileServiceClient } from "../clients";
import { ErrorCodes } from "../constants/error-code";
import { GetImageDto, UploadPostDto } from "../dtos";
import { filesRepo, userRepo } from "../repositories";
import { convertImageKeyToImageUrl, HttpError } from "../utils";
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
}

export const filesService = new FilesService();
