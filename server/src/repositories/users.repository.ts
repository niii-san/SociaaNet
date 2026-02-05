import {
    Image,
    ImageDocument,
    UserDocument,
    User,
    UserSettings
} from "../models";

interface UserDocumentRepository {
    createUser(userData: Partial<UserDocument>): Promise<UserDocument>;
    getUserByEmail(email: string): Promise<UserDocument | null>;
    getUserById(userId: string): Promise<UserDocument | null>;
    getUserByUsername(username: string): Promise<UserDocument | null>;
    getAllUsers(): Promise<UserDocument[]>;
    uploadAvatar(data: Partial<ImageDocument>): Promise<ImageDocument>;
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
        const user = await User.findById(userId);
        return user;
    }

    async getUserByUsername(username: string): Promise<UserDocument | null> {
        const user = await User.findOne({ username });
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

    async getAllUsers(): Promise<UserDocument[]> {
        const users = await User.find(
            {},
            { password: 0, is_disabled: 0, __v: 0 }
        );
        return users;
    }
    async uploadAvatar(data: Partial<ImageDocument>): Promise<ImageDocument> {
        const image = await Image.create(data);
        await User.findByIdAndUpdate(data.uploader_id, {
            avatar_key: data.image_key
        });
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
        );
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
        );
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
        );
        return user;
    }
}

export const userRepo = new UserRepository();
