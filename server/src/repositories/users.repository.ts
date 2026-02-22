import { ErrorCodes } from "../constants/error-code";
import {
    ImageMetaDataDocument,
    ImageMetaData,
    UserDocument,
    User,
    UserSettings
} from "../models";
import { UserEntity } from "../types";
import { HttpError } from "../utils";
import { filesRepo } from "./files.repository";
import { socialsRepo } from "./socials.repository";

interface UserDocumentRepository {
    createUser(userData: Partial<UserDocument>): Promise<UserDocument>;
    getUserByEmail(email: string): Promise<UserDocument | null>;
    getUserById(userId: string): Promise<UserDocument | null>;
    getUserByUsername(username: string): Promise<UserDocument | null>;
    getProfileByUsername(
        targetUsername: string,
        currentUserId: string
    ): Promise<(UserEntity & { is_following: boolean }) | null>;
    getAllUsers(): Promise<UserDocument[]>;
    uploadAvatar(
        data: Partial<ImageMetaDataDocument>
    ): Promise<ImageMetaDataDocument>;
    searchUsers(query: string): Promise<{
        users: UserDocument[];
        pagination: { current_page: number; has_next_page: boolean };
    }>;
}

class UserRepository implements UserDocumentRepository {
    async createUser(userData: Partial<UserDocument>): Promise<UserDocument> {
        const user = await User.create(userData);
        await UserSettings.create({ user_id: user._id });
        return user;
    }

    async getUserByEmail(email: string): Promise<UserDocument | null> {
        const user = await User.findOne({ email_address: email });
        return user;
    }

    async getUserById(userId: string): Promise<UserDocument | null> {
        const user = await User.findById(userId).select("-password");
        return user;
    }

    async getProfileByUsername(
        targetUsername: string,
        currentUserId: string
    ): Promise<(UserEntity & { is_following: boolean }) | null> {
        const userDoc = await User.findOne({ username: targetUsername }).select(
            "-password"
        );

        if (!userDoc) return null;

        const user = userDoc.toObject(); 

        const userId = String(user._id); 

        let following = false;

        if (currentUserId && userId !== currentUserId) {
            following = await socialsRepo.isFollowing(currentUserId, userId);
        }

        return {
            ...user,
            is_following: following
        };
    }

    async getUserByUsername(username: string): Promise<UserDocument | null> {
        const user = await User.findOne({ username }).select("-password");
        return user;
    }

    async getUserSettingsByUserId(userId: string) {
        const settings = await UserSettings.findOne({ user_id: userId });
        return settings;
    }

    async getUserSettingsBySettingsId(settingsId: string) {
        const settings = await UserSettings.findById(settingsId);
        return settings;
    }

    async getUserWithSettingsByUserId(userId: string) {
        const user = await User.findById(userId).select("-password");
        const settings = await UserSettings.findOne({ user_id: userId });

        return {
            user,
            settings
        };
    }

    async getAllUsers(): Promise<UserDocument[]> {
        const users = await User.find(
            {},
            { password: 0, is_disabled: 0, __v: 0 }
        );
        return users;
    }

    async uploadAvatar(
        data: Partial<ImageMetaDataDocument>
    ): Promise<ImageMetaDataDocument> {
        const image = await ImageMetaData.create(data);

        const user = await User.findById(data.uploader_id);

        if (!user) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "User not found"
            );
        }

        // if the user already has an avatar, we need to delete the old one
        if (user.avatar_key) {
            filesRepo
                .deleteImageMetaDataByImageKey(user.avatar_key)
                .catch(() => { });
        }

        user.avatar_key = image.image_key;
        await user.save();

        return image;
    }

    // Updates
    async updateBio({
        userId,
        bio
    }: {
        userId: string;
        bio: string;
    }): Promise<UserDocument | null> {
        const user = await User.findByIdAndUpdate(
            userId,
            { bio },
            { new: true }
        ).select("-password");
        return user;
    }

    async updateFullName({
        userId,
        fullName
    }: {
        userId: string;
        fullName: string;
    }): Promise<UserDocument | null> {
        const user = await User.findByIdAndUpdate(
            userId,
            { full_name: fullName },
            { new: true }
        ).select("-password");
        return user;
    }

    async updateUsername({
        userId,
        username
    }: {
        userId: string;
        username: string;
    }): Promise<UserDocument | null> {
        const user = await User.findByIdAndUpdate(
            userId,
            { username },
            { new: true }
        ).select("-password");
        return user;
    }

    private escapeRegex(text: string): string {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    async searchUsers(
        query: string,
        limit: number = 20,
        page: number = 1
    ): Promise<{
        users: UserDocument[];
        pagination: { current_page: number; has_next_page: boolean };
    }> {
        const skip = (page - 1) * limit;
        const safeQuery = this.escapeRegex(query);

        const users = await User.find({
            $or: [
                { username: { $regex: safeQuery, $options: "i" } },
                { full_name: { $regex: safeQuery, $options: "i" } }
            ]
        })
            .select("-password")
            .skip(skip)
            .limit(limit);

        return {
            users,
            pagination: {
                current_page: page,
                has_next_page: users.length === limit
            }
        };
    }
}

export const userRepo = new UserRepository();
