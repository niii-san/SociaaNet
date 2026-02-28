import { ErrorCodes } from "../constants/error-code";
import { filesRepo, userRepo } from "../repositories";
import {
    convertImageKeyToImageUrl,
    convertVideoKeyToVideoUrl,
    HttpError
} from "../utils";

class PostsService {
    async getPost(postId: string, currentUserId: string) {
        const post = await filesRepo.getPostById(postId);

        if (!post) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Post not found"
            );
        }

        const author = await userRepo.getUserById(post.author.toString());

        if (!author) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Author of the post not found"
            );
        }

        const isPostAuthor = post.author.toString() === currentUserId;

        if (!isPostAuthor && post.visibility === "private") {
            throw new HttpError(
                403,
                false,
                ErrorCodes.FORBIDDEN,
                "You do not have permission to view this post"
            );
        }

        const authorPayload = {
            user_id: author._id.toString(),
            username: author.username,
            full_name: author.full_name,
            avatar_url: author.avatar_key
                ? convertImageKeyToImageUrl(author.avatar_key)
                : null
        };

        const mediasUrl = post.media_keys.map((key) => {
            return convertImageKeyToImageUrl(key);
        });

        //TODO: load comments

        const comments: any = [];
        const is_post_liked_by_current_user = false; //TODO: check if the post is liked by the current user

        return {
            post_id: post._id.toString(),
            author: authorPayload,
            media_urls: mediasUrl,
            caption: post.caption,
            is_post_author: isPostAuthor,
            is_post_liked_by_current_user,
            likes_count: post.likes_count,
            comments_count: post.comments_count,
            comments,
            hashtags: post.hashtags,
            visibility: post.visibility,
            created_at: post.created_at
        };
    }

    async getReel(reelId: string, userId: string) {
        const reel = await filesRepo.getReelById(reelId);

        if (!reel) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Reel not found"
            );
        }

        const author = await userRepo.getUserById(reel.author.toString());

        if (!author) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Author of the reel not found"
            );
        }

        const isReelAuthor = reel.author.toString() === userId;

        if (!isReelAuthor && reel.visibility === "private") {
            throw new HttpError(
                403,
                false,
                ErrorCodes.FORBIDDEN,
                "You do not have permission to view this reel"
            );
        }

        const authorPayload = {
            user_id: author._id.toString(),
            username: author.username,
            full_name: author.full_name,
            avatar_url: author.avatar_key
                ? convertImageKeyToImageUrl(author.avatar_key)
                : null
        };

        const videoUrl = convertVideoKeyToVideoUrl(reel.media_key);
        const comments: any = []; //TODO:
        const is_reel_liked_by_current_user = false; //TODO: check if the reel is liked by the current user

        return {
            reel_id: reel._id.toString(),
            author: authorPayload,
            video_url: videoUrl,
            caption: reel.caption,
            hashtags: reel.hashtags,
            is_reel_author: isReelAuthor,
            is_reel_liked_by_current_user,
            likes_count: reel.likes_count,
            comments_count: reel.comments_count,
            views_count: reel.views_count,
            comments,
            visibility: reel.visibility,
            created_at: reel.created_at
        };
    }
}

export const postsService = new PostsService();
