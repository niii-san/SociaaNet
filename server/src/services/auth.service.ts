import { LoginDto, CreateUserDto } from "../dtos";
import { genSalt, hash } from "bcryptjs";
import bcrypt from "bcryptjs";
import { generateUniqueUsername, HttpError } from "../utils";
import { activityRepo, authRepo, userRepo } from "../repositories";
import { env } from "../config";
import { ErrorCodes } from "../constants/error-code";
import { UserFieldRequirements } from "../constants";
import { ActivityVerb } from "../types";
import { mailService } from "./mail.service";

class AuthService {
    async login(dto: LoginDto) {
        const emailAddress = (dto.emailAddress ?? "").trim();
        const password: string | undefined = dto.password;
        const ip_address = dto.ip;
        const device = dto.device;

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
            expires_at: sessionExpiryTime,
            ip: ip_address,
            device
        });

        await activityRepo.createActivity({
            verb: ActivityVerb.logged_in,
            actor: {
                user_id: user._id
            },
            metadata: {
                ip: ip_address,
                device
            },
            visibility: "private"
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

    async sendOtpForPasswordReset(email: string) {
        if (!email) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Email is required"
            );
        }

        const user = await userRepo.getUserByEmail(email);

        if (!user) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "User with the provided email does not exist"
            );
        }

        const otp = await authRepo.createForgotPasswordOtp(
            user._id.toString(),
            user.email_address
        );
        const emailSent = await mailService.sendOTP(
            otp,
            user.email_address,
            user.full_name
        );

        if (!emailSent) {
            throw new HttpError(
                500,
                false,
                ErrorCodes.SERVER_ERROR,
                "Failed to send OTP email! Please try again later."
            );
        }
    }
}

export const authService = new AuthService();
