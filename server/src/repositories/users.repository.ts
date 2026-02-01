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
}

export const userRepo = new UserRepository();
