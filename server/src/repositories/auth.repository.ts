import { Session, SessionDocument } from "../models";
import { Otp } from "../models/otp.model";
import { userRepo } from "./users.repository";

interface IAuthRepository {
    createSession(
        sessionData: Partial<SessionDocument>
    ): Promise<SessionDocument>;
    getSessionById(sessionId: string): Promise<SessionDocument | null>;
    getAllActiveSessionsByUserId(
        userId: string
    ): Promise<Partial<SessionDocument[]>>;
    createForgotPasswordOtp(userId: string, email: string): Promise<string>;
    verifyPasswordResetOtp(email: string, otp: string): Promise<boolean>;
    changePassword(userId: string, newPassword: string): Promise<boolean>;
    deleteAllSessionsByUserId(userId: string): Promise<boolean>;
}

class AuthRepository implements IAuthRepository {
    async createSession(
        sessionData: Partial<SessionDocument>
    ): Promise<SessionDocument> {
        const session = await Session.create(sessionData);

        return session;
    }

    async getSessionById(sessionId: string) {
        const session = await Session.findOne({ session_id: sessionId });

        return session;
    }

    async getAllActiveSessionsByUserId(userId: string) {
        const sessions = await Session.find({
            user_id: userId,
            is_deleted: false,
            has_expired: false
        }).select("-_id -__v -session_id -user_id -expires_at -created_at");

        return sessions;
    }

    async updateSessionLastActivity(sessionId: string) {
        const session = await Session.findOneAndUpdate(
            { session_id: sessionId },
            { last_activity_at: new Date() },
            { new: true }
        );
        return session;
    }

    async createForgotPasswordOtp(
        userId: string,
        email: string
    ): Promise<string> {
        const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

        await Otp.create({
            user_id: userId,
            otp: otpValue,
            email: email,
            otp_type: "password_reset",
            expires_at: otpExpiry
        });

        return otpValue;
    }

    async verifyPasswordResetOtp(email: string, otp: string): Promise<boolean> {
        const otpRecord = await Otp.findOne({
            email: email,
            otp: otp,
            otp_type: "password_reset",
            has_expired: false,
            is_used: false
        });
        if (!otpRecord) return false;

        const now = new Date();
        if (otpRecord.expires_at < now) {
            otpRecord.has_expired = true;
            await otpRecord.save();
            return false;
        }

        otpRecord.is_used = true;
        await otpRecord.save();
        return true;
    }

    async changePassword(
        userId: string,
        newPassword: string
    ): Promise<boolean> {
        const user = await userRepo.getUserById(userId);
        if (!user) return false;

        user.password = newPassword;
        await user.save();
        return true;
    }

    async deleteAllSessionsByUserId(userId: string): Promise<boolean> {
        await Session.updateMany(
            { user_id: userId, is_deleted: false },
            { is_deleted: true }
        );
        return true;
    }
}

export const authRepo = new AuthRepository();
