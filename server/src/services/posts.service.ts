import { ErrorCodes } from "../constants/error-code";
import { filesRepo } from "../repositories";
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

        const isPostAuthor = post.author.toString() === currentUserId;

        if (!isPostAuthor && post.visibility === "private") {
            throw new HttpError(
                403,
                false,
                ErrorCodes.FORBIDDEN,
                "You do not have permission to view this post"
            );
        }

        const mediasUrl = post.media_keys.map((key) => {
            return convertImageKeyToImageUrl(key);
        });

        //TODO: load c omments

        const comments: any = [];
        const is_post_liked_by_current_user = false; //TODO: check if the post is liked by the current user

        return {
            post_id: post._id.toString(),
            author_id: post.author.toString(),
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
}

export const postsService = new PostsService();
