import { ImageMetaData, ImageMetaDataDocument } from "../models";
import { Post, PostDocument } from "../models/post.model";
import { Reel, ReelDocument } from "../models/reel.model";

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

    deletePost(postId: string): Promise<boolean>;
    createReel(
        userId: string,
        media_key: string,
        thumbnail_key: string,
        caption: string,
        hashtags: string[],
        visibility: "public" | "private" | "followers",
        duration_seconds: number
    ): Promise<ReelDocument>;
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

    async deletePost(postId: string): Promise<boolean> {
        const post = await Post.findById(postId);

        if (!post) {
            return false;
        }

        post.is_deleted = true;
        post.deleted_at = new Date();

        await post.save();

        return true;
    }

    async createReel(
        userId: string,
        media_key: string,
        thumbnail_key: string,
        caption: string,
        hashtags: string[],
        visibility: "public" | "private" | "followers",
        duration_seconds: number
    ): Promise<ReelDocument> {
        const reel = await Reel.create({
            author: userId,
            media_key,
            caption,
            hashtags,
            visibility,
            thumbnail_key,
            duration_seconds
        });
        return reel;
    }
}

export const filesRepo = new FilesRepository();
