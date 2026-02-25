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

    async changePasswordWithOtp(
        email: string,
        otp: string,
        newPassword: string
    ) {
        if (!email) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Email is required"
            );
        }

        if (!otp) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "OTP is required"
            );
        }

        if (!newPassword) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "New password is required"
            );
        }

        if (newPassword.length < UserFieldRequirements.password.minLength) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                UserFieldRequirements.password.minErrorMessage
            );
        }

        if (newPassword.length > UserFieldRequirements.password.maxLength) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                UserFieldRequirements.password.maxErrorMessage
            );
        }

        const isOtpValid = await authRepo.verifyPasswordResetOtp(email, otp);

        if (!isOtpValid) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid or expired OTP"
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

        const salt = await genSalt(5);
        const hashedPassword = await hash(newPassword, salt);

        const pwChange = await authRepo.changePassword(
            user._id.toString(),
            hashedPassword
        );

        if (!pwChange) {
            throw new HttpError(
                500,
                false,
                ErrorCodes.SERVER_ERROR,
                "Failed to change password! Please try again later."
            );
        }

        return true;
    }

    async changePassword(
        userId: string,
        currentPassword: string,
        newPassword: string
    ) {
        if (!currentPassword) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Current password is required"
            );
        }

        if (!newPassword) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "New password is required"
            );
        }

        if (newPassword.length < UserFieldRequirements.password.minLength) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                UserFieldRequirements.password.minErrorMessage
            );
        }

        if (newPassword.length > UserFieldRequirements.password.maxLength) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                UserFieldRequirements.password.maxErrorMessage
            );
        }

        const user = await userRepo.getUserById(userId);

        if (!user) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "User does not exist"
            );
        }

        const currentPasswordHash = user.password;

        const isCurrentPasswordCorrect = await bcrypt.compare(
            currentPassword,
            currentPasswordHash
        );

        if (!isCurrentPasswordCorrect) {
            throw new HttpError(
                401,
                false,
                ErrorCodes.UNAUTHORIZED,
                "Incorrect current password"
            );
        }

        const salt = await genSalt(5);
        const newHashedPassword = await hash(newPassword, salt);

        const pwChange = await authRepo.changePassword(
            userId,
            newHashedPassword
        );

        await authRepo.deleteAllSessionsByUserId(userId);

        return {
            password_changed: pwChange
        };
    }

    async deleteSession(sessionId: string, userId: string): Promise<boolean> {
        const res = await authRepo.deleteSessionBySessionIdAndUserId(
            sessionId,
            userId
        );
        return res;
    }
}

export const authService = new AuthService();
