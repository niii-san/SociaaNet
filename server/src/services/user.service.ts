import { genSalt, hash } from "bcryptjs";
import { CreateUserDto } from "../dtos";
import { ApiErrorResponse, generateUniqueUsername } from "../utils";
import { UserRepository } from "../repositories/user.repository";

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
}

export default new UserService();
