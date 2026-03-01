import { User, UserDocument } from "../models";
import { Post, PostDocument } from "../models/post.model";
import { Reel, ReelDocument } from "../models/reel.model";
import { Comment, CommentDocument } from "../models/comment.model";
import { convertImageKeyToImageUrl } from "../utils";

class ModeratorRepository {
    // ─── User Management ───────────────────────────────────────

    async getAllUsers(
        page: number = 1,
        limit: number = 20,
        search?: string,
        filter?: string
    ): Promise<{
        users: any[];
        pagination: {
            current_page: number;
            total_pages: number;
            total_count: number;
            has_next_page: boolean;
        };
    }> {
        const skip = (page - 1) * limit;
        const query: any = {};

        if (search) {
            const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            query.$or = [
                { username: { $regex: escaped, $options: "i" } },
                { full_name: { $regex: escaped, $options: "i" } },
                { email_address: { $regex: escaped, $options: "i" } }
            ];
        }

        if (filter === "disabled") {
            query.is_disabled = true;
        } else if (filter === "active") {
            query.is_disabled = { $ne: true };
        } else if (filter === "moderator") {
            query.role = "moderator";
        }

        const [users, total] = await Promise.all([
            User.find(query)
                .select("-password -__v")
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments(query)
        ]);

        const usersWithAvatars = users.map((user) => ({
            ...user,
            user_id: user._id,
            avatar_url: user.avatar_key
                ? convertImageKeyToImageUrl(user.avatar_key)
                : null
        }));

        return {
            users: usersWithAvatars,
            pagination: {
                current_page: page,
                total_pages: Math.ceil(total / limit),
                total_count: total,
                has_next_page: skip + limit < total
            }
        };
    }

    async disableUser(userId: string): Promise<UserDocument | null> {
        return User.findByIdAndUpdate(
            userId,
            { is_disabled: true },
            { new: true }
        ).select("-password -__v");
    }

    async enableUser(userId: string): Promise<UserDocument | null> {
        return User.findByIdAndUpdate(
            userId,
            { is_disabled: false },
            { new: true }
        ).select("-password -__v");
    }

    async getUserDetails(userId: string) {
        return User.findById(userId).select("-password -__v").lean();
    }

    // ─── Content Moderation ────────────────────────────────────

    async getPosts(
        page: number = 1,
        limit: number = 20,
        filter?: string
    ): Promise<{
        posts: PostDocument[];
        pagination: {
            current_page: number;
            total_pages: number;
            total_count: number;
            has_next_page: boolean;
        };
    }> {
        const skip = (page - 1) * limit;
        const query: any = {};

        if (filter === "removed") {
            query.is_removed_by_moderator = true;
        } else if (filter === "active") {
            query.is_removed_by_moderator = { $ne: true };
        }

        const [posts, total] = await Promise.all([
            Post.find(query)
                .populate("author", "username full_name avatar_key")
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Post.countDocuments(query)
        ]);

        return {
            posts: posts as any,
            pagination: {
                current_page: page,
                total_pages: Math.ceil(total / limit),
                total_count: total,
                has_next_page: skip + limit < total
            }
        };
    }

    async removePost(postId: string): Promise<PostDocument | null> {
        return Post.findByIdAndUpdate(
            postId,
            { is_removed_by_moderator: true },
            { new: true }
        );
    }

    async restorePost(postId: string): Promise<PostDocument | null> {
        return Post.findByIdAndUpdate(
            postId,
            { is_removed_by_moderator: false },
            { new: true }
        );
    }

    async getReels(
        page: number = 1,
        limit: number = 20,
        filter?: string
    ): Promise<{
        reels: ReelDocument[];
        pagination: {
            current_page: number;
            total_pages: number;
            total_count: number;
            has_next_page: boolean;
        };
    }> {
        const skip = (page - 1) * limit;
        const query: any = {};

        if (filter === "removed") {
            query.is_removed_by_moderator = true;
        } else if (filter === "active") {
            query.is_removed_by_moderator = { $ne: true };
        }

        const [reels, total] = await Promise.all([
            Reel.find(query)
                .populate("author", "username full_name avatar_key")
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Reel.countDocuments(query)
        ]);

        return {
            reels: reels as any,
            pagination: {
                current_page: page,
                total_pages: Math.ceil(total / limit),
                total_count: total,
                has_next_page: skip + limit < total
            }
        };
    }

    async removeReel(reelId: string): Promise<ReelDocument | null> {
        return Reel.findByIdAndUpdate(
            reelId,
            { is_removed_by_moderator: true },
            { new: true }
        );
    }

    async restoreReel(reelId: string): Promise<ReelDocument | null> {
        return Reel.findByIdAndUpdate(
            reelId,
            { is_removed_by_moderator: false },
            { new: true }
        );
    }

    async removeComment(commentId: string): Promise<CommentDocument | null> {
        return Comment.findByIdAndUpdate(
            commentId,
            { is_deleted: true },
            { new: true }
        );
    }

    // ─── Dashboard Stats ──────────────────────────────────────

    async getDashboardStats(): Promise<{
        total_users: number;
        active_users: number;
        disabled_users: number;
        moderators: number;
        total_posts: number;
        removed_posts: number;
        total_reels: number;
        removed_reels: number;
        total_comments: number;
    }> {
        const [
            total_users,
            disabled_users,
            moderators,
            total_posts,
            removed_posts,
            total_reels,
            removed_reels,
            total_comments
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ is_disabled: true }),
            User.countDocuments({ role: "moderator" }),
            Post.countDocuments(),
            Post.countDocuments({ is_removed_by_moderator: true }),
            Reel.countDocuments(),
            Reel.countDocuments({ is_removed_by_moderator: true }),
            Comment.countDocuments()
        ]);

        return {
            total_users,
            active_users: total_users - disabled_users,
            disabled_users,
            moderators,
            total_posts,
            removed_posts,
            total_reels,
            removed_reels,
            total_comments
        };
    }
}

export const moderatorRepo = new ModeratorRepository();
