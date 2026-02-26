import { ImageMetaData, ImageMetaDataDocument } from "../models";
import { Post, PostDocument } from "../models/post.model";

interface IFilesRepository {
    getImageMetaDataByKey(key: string): Promise<ImageMetaDataDocument | null>;
    deleteImageMetaDataByImageKey(
        imageKey: string
    ): Promise<Partial<ImageMetaDataDocument | null>>;
    createPost(
        userId: string,
        image_keys: string[],
        caption: string,
        hashtags: string[],
        visibility: "public" | "private" | "followers"
    ): Promise<PostDocument>;
}

class FilesRepository implements IFilesRepository {
    async getImageMetaDataByKey(
        key: string
    ): Promise<ImageMetaDataDocument | null> {
        const imageMetaData = await ImageMetaData.findOne({
            image_key: key,
            is_deleted: false
        }).lean<ImageMetaDataDocument>();

        return imageMetaData;
    }

    async deleteImageMetaDataByImageKey(
        imageKey: string
    ): Promise<Partial<ImageMetaDataDocument | null>> {
        const data = await ImageMetaData.findOneAndUpdate(
            { image_key: imageKey },
            {
                is_deleted: true,
                deleted_at: new Date()
            }
        );

        return {
            image_key: data?.image_key.toString() || ""
        };
    }

    async createPost(
        userId: string,
        image_keys: string[],
        caption: string,
        hashtags: string[],
        visibility: "public" | "private" | "followers"
    ): Promise<PostDocument> {
        const post = await Post.create({
            author: userId,
            media_keys: image_keys,
            caption,
            hashtags,
            visibility
        });

        return post;
    }
}

export const filesRepo = new FilesRepository();
