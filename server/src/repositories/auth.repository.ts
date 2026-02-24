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
}

export const authRepo = new AuthRepository();
