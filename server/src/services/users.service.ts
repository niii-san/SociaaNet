import { genSalt, hash } from "bcryptjs";
import {
    CreateUserDto,
    GetUserByIdDto,
    GetUserByUsernameDto,
    GetUserSettingsByUserIdDto,
    UploadAvatarDto
} from "../dtos";
import {
    HttpError,
    convertImageKeyToImageUrl,
    generateUniqueUsername
} from "../utils";
import { userRepo } from "../repositories";
import { fileServiceClient } from "../clients";
import { Types } from "mongoose";

class UsersService {
    async createUser(dto: CreateUserDto) {
        const fullName = (dto.fullName ?? "").trim();
        const emailAddress = (dto.emailAddress ?? "").trim();
        const password = dto.password;

        if (!fullName) {
            throw new HttpError(
                400,
                false,
                "NO_FULLNAME",
                "Full name is required"
            );
        }
        if (!emailAddress) {
            throw new HttpError(
                400,
                false,
                "NO_EMAIL",
                "Email address is required"
            );
        }
        if (!password) {
            throw new HttpError(
                400,
                false,
                "NO_PASSWORD",
                "Password is required"
            );
        }

        if (password.length < 8) {
            throw new HttpError(
                400,
                false,
                "PW_LEN_ERROR",
                "Password must be 8 characters long"
            );
        }

        if (password.length > 24) {
            throw new HttpError(
                400,
                false,
                "PW_LEN_ERROR",
                "Password must be less than 24 characters"
            );
        }

        // Checking if the email is already used for another account
        const alreadyExists = await userRepo.getUserByEmail(emailAddress);

        if (alreadyExists) {
            throw new HttpError(
                400,
                false,
                "ALR_EXIST",
                "Email is linked with another account"
            );
        }

        // TODO: create unique username
        const uniqueUsername = await generateUniqueUsername(fullName);

        const salt = await genSalt(5);
        const hashedPassword = await hash(password, salt);

        const user = await userRepo.createUser({
            full_name: fullName,
            username: uniqueUsername,
            email_address: emailAddress,
            password: hashedPassword
        });

        return {
            _id: user._id,
            full_name: user.full_name,
            username: user.username,
            created_at: user.created_at
        };
    }

    async getUserById(dto: GetUserByIdDto) {
        const user = await userRepo.getUserById(dto.user_id);

        if (!user) {
            throw new HttpError(404, false, "USER_NOT_FOUND", "User not found");
        }

        const avatar_url =
            user.avatar_key != null
                ? convertImageKeyToImageUrl(user.avatar_key)
                : null;
        return {
            _id: user._id,
            full_name: user.full_name,
            username: user.username,
            email_address: user.email_address,
            avatar_url: avatar_url,
            created_at: user.created_at
        };
    }

    async getUserProfileByUsername(dto: GetUserByUsernameDto) {
        const user = await userRepo.getUserByUsername(dto.username);

        if (!user) {
            throw new HttpError(404, false, "NOT_FOUND", "User not found");
        }

        const avatar_url =
            user.avatar_key != null
                ? convertImageKeyToImageUrl(user.avatar_key)
                : null;

        return {
            _id: user._id,
            full_name: user.full_name,
            username: user.username,
            bio: user.bio,
            avatar_url: avatar_url,
            created_at: user.created_at
        };
    }

    async uploadAvatar(dto: UploadAvatarDto, file: Express.Multer.File | null) {
        if (!file) {
            throw new HttpError(
                400,
                false,
                "NO_FILE",
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

        return {
            avatar_url: res.data.image_key
        };
    }

    async getUserSettingsByUserId(dto: GetUserSettingsByUserIdDto) {
        const userSettings = await userRepo.getUserSettingsByUserId(dto.userId);

        if (!userSettings)
            throw new HttpError(
                404,
                false,
                "NOT_FOUND",
                "User settings not found"
            );

        return {
            user_id: userSettings.user_id,
            privacy: userSettings.privacy,
            notifications: userSettings.notifications,
            appearance: userSettings.appearance,
            feed: userSettings.feed,
            security: userSettings.security
        };
    }
}

export const usersService = new UsersService();
