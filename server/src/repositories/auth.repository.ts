import { Session, SessionDocument } from "../models";

interface IAuthRepository {
    createSession(
        sessionData: Partial<SessionDocument>
    ): Promise<SessionDocument>;
    getSessionById(sessionId: string): Promise<SessionDocument | null>;
    getAllActiveSessionsByUserId(
        userId: string
    ): Promise<Partial<SessionDocument[]>>;
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
}

export const authRepo = new AuthRepository();
