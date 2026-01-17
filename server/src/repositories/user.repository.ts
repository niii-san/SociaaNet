import { IUser, User } from "../models";

interface IUserRepository {
    createUser(userData: Partial<IUser>): Promise<IUser>;
    getUserByEmail(email: string): Promise<IUser | null>;
    getUserById(userId: string): Promise<IUser | null>;
    getUserByUsername(username: string): Promise<IUser | null>;
    getAllUsers(): Promise<IUser[]>;
}

export class UserRepository implements IUserRepository {
    async createUser(userData: Partial<IUser>): Promise<IUser> {
        const user = await User.create(userData);
        return user;
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        const user = await User.findOne({ email_address: email });
        return user;
    }

    async getUserById(userId: string): Promise<IUser | null> {
        const user = await User.findById(userId);
        return user;
    }

    async getUserByUsername(username: string): Promise<IUser | null> {
        const user = await User.findOne({ username });
        return user;
    }

    async getAllUsers(): Promise<IUser[]> {
        const users = await User.find(
            {},
            { password: 0, is_disabled: 0, __v: 0 }
        );
        return users;
    }
}
