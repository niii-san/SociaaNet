import { genSalt, hash } from "bcryptjs";
import { CreateUserDto, UploadAvatarDto } from "../dtos";
import { ApiErrorResponse, generateUniqueUsername } from "../utils";
import { UserRepository } from "../repositories";
import config from "../config/env";
import { fileServiceClient } from "../clients";
import { ObjectId, Types } from "mongoose";

const UserRepo = new UserRepository();

class UserService {
    async createUser(dto: CreateUserDto) {
        const fullName = (dto.fullName ?? "").trim();
        const emailAddress = (dto.emailAddress ?? "").trim();
        const password = dto.password;

        if (!fullName) {
            throw new ApiErrorResponse(
                400,
                false,
                "NO_FULLNAME",
                "Full name is required"
            );
        }
        if (!emailAddress) {
            throw new ApiErrorResponse(
                400,
                false,
                "NO_EMAIL",
                "Email address is required"
            );
        }
        if (!password) {
            throw new ApiErrorResponse(
                400,
                false,
                "NO_PASSWORD",
                "Password is required"
            );
        }

        if (password.length < 8) {
            throw new ApiErrorResponse(
                400,
                false,
                "PW_LEN_ERROR",
                "Password must be 8 characters long"
            );
        }

        if (password.length > 24) {
            throw new ApiErrorResponse(
                400,
                false,
                "PW_LEN_ERROR",
                "Password must be less than 24 characters"
            );
        }

        // Checking if the email is already used for another account
        const alreadyExists = await UserRepo.getUserByEmail(emailAddress);

        if (alreadyExists) {
            throw new ApiErrorResponse(
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

        const user = await UserRepo.createUser({
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

    async uploadAvatar(dto: UploadAvatarDto, file: Express.Multer.File | null) {
        if (!file) {
            throw new ApiErrorResponse(
                400,
                false,
                "NO_FILE",
                "Avatar image is required"
            );
        }

        const res = await fileServiceClient.uploadSingleImage(file.buffer);

        await UserRepo.uploadAvatar({
            uploader_id: dto.user_id as unknown as Types.ObjectId,
            image_key: res.image_key,
            image_id: res.image_id,
            chat_id: null,
            visibility: "public"
        });
    }
}

export default new UserService();
