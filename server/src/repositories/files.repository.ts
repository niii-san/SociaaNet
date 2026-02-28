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

    createImageMetaData(
        uploaderId: string,
        imageKey: string,
        imageId: string,
        visibility: "public" | "followers" | "private" | "chat_only",
        chatId?: string,
        postId?: string
    ): Promise<ImageMetaDataDocument>;

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
    getReelByVideoKey(videoKey: string): Promise<ReelDocument | null>;
    getUserPostsByUserId(userId: string): Promise<PostDocument[]>;
    getUserReelsByUserId(userId: string): Promise<ReelDocument[]>;

    getPostById(postId: string): Promise<PostDocument | null>;
    getReelById(reelId: string): Promise<ReelDocument | null>;
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

    async createImageMetaData(
        uploaderId: string,
        imageKey: string,
        imageId: string,
        visibility: "public" | "followers" | "private" | "chat_only",
        chatId?: string,
        postId?: string
    ): Promise<ImageMetaDataDocument> {
        const imageMetaData = await ImageMetaData.create({
            uploader_id: uploaderId,
            image_key: imageKey,
            image_id: imageId,
            visibility,
            chat_id: chatId || null,
            post_id: postId || null
        });

        return imageMetaData;
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

    async getReelByVideoKey(videoKey: string): Promise<ReelDocument | null> {
        const reel = await Reel.findOne({
            media_key: videoKey,
            is_deleted: false,
            is_removed_by_moderator: false
        });

        return reel;
    }

    async getUserPostsByUserId(userId: string): Promise<PostDocument[]> {
        const posts = await Post.find({
            author: userId,
            is_deleted: false,
            is_removed_by_moderator: false
        }).sort({ created_at: -1 });

        return posts;
    }

    async getUserReelsByUserId(userId: string): Promise<ReelDocument[]> {
        const reels = await Reel.find({
            author: userId,
            is_deleted: false,
            is_removed_by_moderator: false
        }).sort({ created_at: -1 });

        return reels;
    }

    async getPostById(postId: string): Promise<PostDocument | null> {
        const post = await Post.findOne({
            _id: postId,
            is_deleted: false,
            is_removed_by_moderator: false
        });

        return post;
    }

    async getReelById(reelId: string): Promise<ReelDocument | null> {
        const reel = await Reel.findOne({
            _id: reelId,
            is_deleted: false,
            is_removed_by_moderator: false
        });

        return reel;
    }
}

export const filesRepo = new FilesRepository();
