import { LoginDto, CreateUserDto } from "../dtos";
import { genSalt, hash } from "bcryptjs";
import bcrypt from "bcryptjs";
import { generateUniqueUsername, HttpError } from "../utils";
import { authRepo, userRepo } from "../repositories";
import { env } from "../config";
import { ErrorCodes } from "../constants/error-code";
import { UserFieldRequirements } from "../constants";

class AuthService {
    async login(dto: LoginDto) {
        const emailAddress = (dto.emailAddress ?? "").trim();
        const password: string | undefined = dto.password;

        if (!emailAddress) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Email address is required"
            );
        }

        if (!password) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Password is required"
            );
        }

        if (
            password.length < UserFieldRequirements.password.minLength ||
            password.length > UserFieldRequirements.password.maxLength
        ) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid email or password"
            );
        }

        const user = await userRepo.getUserByEmail(emailAddress);

        if (!user) {
            throw new HttpError(
                401,
                false,
                ErrorCodes.UNAUTHORIZED,
                "Invalid email or password"
            );
        }
        const hash = user.password;
        const isPasswordCorrect = await bcrypt.compare(password, hash);

        if (!isPasswordCorrect) {
            throw new HttpError(
                401,
                false,
                ErrorCodes.UNAUTHORIZED,
                "Invalid email or password"
            );
        }
        const sessionId = crypto.randomUUID();

        const sessionExpiryTime = new Date(
            Date.now() + 1000 * 60 * env.sessionExpiryInMinutes
        );

        const session = await authRepo.createSession({
            session_id: sessionId,
            user_id: user._id,
            expires_at: sessionExpiryTime
        });

        return session;
    }

    async createUser(dto: CreateUserDto) {
        const fullName = (dto.fullName ?? "").trim();
        const emailAddress = (dto.emailAddress ?? "").trim();
        const password = dto.password;

        if (!fullName) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Full name is required"
            );
        }
        if (!emailAddress) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Email address is required"
            );
        }
        if (!password) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Password is required"
            );
        }

        if (password.length < UserFieldRequirements.password.minLength) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Password must be 8 characters long"
            );
        }

        if (password.length > UserFieldRequirements.password.maxLength) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Password must be less than 24 characters"
            );
        }

        // Checking if the email is already linked with another account
        const emailAlreadyLinkedToAnotherAccount =
            await userRepo.getUserByEmail(emailAddress);

        if (emailAlreadyLinkedToAnotherAccount) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
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
            user_id: user._id,
            full_name: user.full_name,
            username: user.username,
            created_at: user.created_at
        };
    }
}

export const authService = new AuthService();
