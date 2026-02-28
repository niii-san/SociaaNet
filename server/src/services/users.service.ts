import {
    GetUserByIdDto,
    GetUserByUsernameDto,
    GetUserProfileDto,
    GetUserSettingsByUserIdDto,
    SearchUsersDto,
    UpdateBioDto,
    UpdateFullNameDto,
    UpdateUsernameDto,
    UploadAvatarDto
} from "../dtos";
import {
    HttpError,
    convertImageKeyToImageUrl,
    convertThumbnailKeytoThumbnailUrl,
    convertVideoKeyToVideoUrl
} from "../utils";
import { activityRepo, authRepo, filesRepo, userRepo } from "../repositories";
import { fileServiceClient } from "../clients";
import { Types } from "mongoose";
import { UserFieldRequirements } from "../constants";
import { ErrorCodes } from "../constants/error-code";
import { ActivityVerb } from "../types";

class UsersService {
    async getUserById(dto: GetUserByIdDto) {
        const user = await userRepo.getUserById(dto.user_id);

        if (!user) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "User not found"
            );
        }

        const avatar_url =
            user.avatar_key != null
                ? convertImageKeyToImageUrl(user.avatar_key)
                : null;
        return {
            user_id: user._id,
            full_name: user.full_name,
            username: user.username,
            is_private_account: user.is_private_account,
            bio: user.bio,
            followers_count: user.followers_count,
            following_count: user.following_count,
            email_address: user.email_address,
            avatar_url: avatar_url,
            created_at: user.created_at
        };
    }

    async getUserProfileByUsername(dto: GetUserProfileDto) {
        const user = await userRepo.getProfileByUsername(
            dto.targetProfileUsername,
            dto.currentUserId
        );

        if (!user) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "User profile not found"
            );
        }

        const avatar_url =
            user.avatar_key != null
                ? convertImageKeyToImageUrl(user.avatar_key)
                : null;

        if(user.is_private_account && !user.is_following && dto.currentUserId !== user._id.toString()) {
            return {
                user_id: user._id,
                full_name: user.full_name,
                username: user.username,
                is_private_account: user.is_private_account,
                followers_count: user.followers_count,
                following_count: user.following_count,
                bio: user.bio,
                avatar_url: avatar_url,
                created_at: user.created_at,
                is_own_profile: dto.currentUserId === user._id.toString(),
                is_following: user.is_following
            };
        }

        const posts = await filesRepo.getUserPostsByUserId(user._id.toString());
        const reels = await filesRepo.getUserReelsByUserId(user._id.toString());

        const isOwnProfile = dto.currentUserId === user._id.toString();

        // Filter out private posts/reels when viewing someone else's profile
        const filteredPosts = isOwnProfile
            ? posts
            : posts.filter((post) => post.visibility !== "private");
        const filteredReels = isOwnProfile
            ? reels
            : reels.filter((reel) => reel.visibility !== "private");

        

        const reelsPayload = filteredReels.map((reel) => ({
            reel_id: reel._id,
            media_url: convertVideoKeyToVideoUrl(reel.media_key),
            thumbnail_url: convertThumbnailKeytoThumbnailUrl(
                reel.thumbnail_key
            ),
            caption: reel.caption,
            hashtags: reel.hashtags,
            views_count: reel.views_count,
            likes_count: reel.likes_count,
            comments_count: reel.comments_count,
            comments: [],
            duration_seconds: reel.duration_seconds,
            created_at: reel.created_at
        }));

        const postsPayload = filteredPosts.map((post) => ({
            post_id: post._id,
            media_urls: post.media_keys.map((key) =>
                convertImageKeyToImageUrl(key)
            ),
            caption: post.caption,
            comments_count: post.comments_count,
            likes_count: post.likes_count,
            comments: [],
            hashtags: post.hashtags,
            created_at: post.created_at
        }));

        return {
            user_id: user._id,
            full_name: user.full_name,
            username: user.username,
            is_private_account: user.is_private_account,
            followers_count: user.followers_count,
            following_count: user.following_count,
            bio: user.bio,
            avatar_url: avatar_url,
            created_at: user.created_at,
            posts_count: filteredPosts.length,
            reels_count: filteredReels.length,
            posts: postsPayload,
            reels: reelsPayload,
            is_own_profile: isOwnProfile,
            is_following: user.is_following
        };
    }

    async uploadAvatar(dto: UploadAvatarDto, file: Express.Multer.File | null) {
        if (!file) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Avatar image is required"
            );
        }

        const res = await fileServiceClient.uploadSingleImage(file.buffer);

        await userRepo.uploadAvatar({
            uploader_id: dto.user_id as unknown as Types.ObjectId,
            image_key: res.data.image_key,
            image_id: res.data.image_id,
            chat_id: null,
            visibility: "public"
        });

        await activityRepo.createActivity({
            verb: ActivityVerb.avatar_updated,
            actor: {
                user_id: dto.user_id as unknown as Types.ObjectId
            },
            target: {
                user_id: dto.user_id as unknown as Types.ObjectId
            },
            metadata: {
                image_key: res.data.image_key
            },
            visibility: "private"
        });

        return {
            avatar_url: res.data.image_key
        };
    }

    async getUserSettingsByUserId(dto: GetUserSettingsByUserIdDto) {
        const userSettings = await userRepo.getUserSettingsByUserId(dto.userId);
        const sessions = await authRepo.getAllActiveSessionsByUserId(
            dto.userId
        );

        if (!userSettings)
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "User settings not found"
            );

        return {
            user_id: userSettings.user_id,
            privacy: userSettings.privacy,
            notifications: userSettings.notifications,
            appearance: userSettings.appearance,
            feed: userSettings.feed,
            security: {
                login_alerts: userSettings.security.login_alerts,
                sessions: sessions
            }
        };
    }

    async updateBio(dto: UpdateBioDto) {
        if (!dto.bio) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Bio is required"
            );
        }

        if (dto.bio.length > UserFieldRequirements.bio.maxLength) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                UserFieldRequirements.bio.maxErrorMessage
            );
        }

        const updatedUser = await userRepo.updateBio({
            userId: dto.userId,
            bio: dto.bio
        });

        if (!updatedUser) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "User not found"
            );
        }

        await activityRepo.createActivity({
            verb: ActivityVerb.bio_updated,
            actor: {
                user_id: dto.userId as unknown as Types.ObjectId
            },
            target: {
                user_id: dto.userId as unknown as Types.ObjectId
            },
            metadata: {
                new_bio: dto.bio
            },
            visibility: "private"
        });

        return {
            bio: updatedUser.bio,
            username: updatedUser.username
        };
    }

    async updateUsername(dto: UpdateUsernameDto) {
        if (!dto.username) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Username is required"
            );
        }

        if (dto.username.length < UserFieldRequirements.username.minLength) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                UserFieldRequirements.username.minErrorMessage
            );
        }
        if (dto.username.length > UserFieldRequirements.username.maxLength) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                UserFieldRequirements.username.maxErrorMessage
            );
        }

        const userWithUsernameAlreadyExists = await userRepo.getUserByUsername(
            dto.username
        );

        // if the new username is same as old username, return success without doing anything
        if (dto.userId == userWithUsernameAlreadyExists?._id.toString()) {
            return {
                username: userWithUsernameAlreadyExists.username,
                _id: userWithUsernameAlreadyExists._id.toString()
            };
        }

        if (userWithUsernameAlreadyExists) {
            throw new HttpError(
                409,
                false,
                ErrorCodes.DUPLICATE,
                "Username is already taken"
            );
        }

        if (!UserFieldRequirements.username.regex.test(dto.username)) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Username can only contain letters, numbers, dots and underscores"
            );
        }

        const updatedUser = await userRepo.updateUsername({
            userId: dto.userId,
            username: dto.username
        });

        if (!updatedUser) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "User not found"
            );
        }

        await activityRepo.createActivity({
            verb: ActivityVerb.username_updated,
            actor: {
                user_id: dto.userId as unknown as Types.ObjectId
            },
            target: {
                user_id: dto.userId as unknown as Types.ObjectId
            },
            metadata: {
                new_username: dto.username
            },
            visibility: "private"
        });

        return {
            username: updatedUser.username
        };
    }

    async updateFullName(dto: UpdateFullNameDto) {
        const fullName = (dto.fullName ?? "").trim();

        if (!fullName) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Full name is required"
            );
        }

        if (fullName.length < UserFieldRequirements.fullName.minLength) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                UserFieldRequirements.fullName.minErrorMessage
            );
        }

        if (fullName.length > UserFieldRequirements.fullName.maxLength) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                UserFieldRequirements.fullName.maxErrorMessage
            );
        }

        const updatedUser = await userRepo.updateFullName({
            userId: dto.userId,
            fullName
        });

        if (!updatedUser) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "User not found"
            );
        }

        await activityRepo.createActivity({
            verb: ActivityVerb.full_name_updated,
            actor: {
                user_id: dto.userId as unknown as Types.ObjectId
            },
            target: {
                user_id: dto.userId as unknown as Types.ObjectId
            },
            metadata: {
                new_full_name: fullName
            },
            visibility: "private"
        });

        return {
            full_name: updatedUser.full_name,
            user_id: updatedUser._id.toString()
        };
    }

    async getUserActivities(userId: string) {
        const activities = await activityRepo.getActivitiesByActor(userId);

        return activities.map((activity) => ({
            activity_id: activity._id,
            verb: activity.verb,
            actor: {
                user_id: activity.actor.user_id
            },
            target: activity.target,
            metadata: activity.metadata,
            created_at: activity.created_at
        }));
    }

    async searchUsers(dto: SearchUsersDto) {
        const query = dto.query ?? "".trim();
        const page = dto.page;

        if (!query) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Search query cannot be empty"
            );
        }

        const result = await userRepo.searchUsers(query, 20, page);

        const preparedUsers = result.users.map((user) => {
            return {
                user_id: user._id,
                full_name: user.full_name,
                username: user.username,
                is_private_account: user.is_private_account,
                followers_count: user.followers_count,
                following_count: user.following_count,
                avatar_url: user.avatar_key
                    ? convertImageKeyToImageUrl(user.avatar_key)
                    : null
            };
        });

        return {
            users: preparedUsers,
            pagination: result.pagination
        };
    }
}

export const usersService = new UsersService();
