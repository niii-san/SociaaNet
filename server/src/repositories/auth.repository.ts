import { Session, SessionDocument } from "../models";

interface IAuthRepository {
    createSession(
        sessionData: Partial<SessionDocument>
    ): Promise<SessionDocument>;
    getSessionById(sessionId: string): Promise<SessionDocument | null>;
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
}

export const authRepo = new AuthRepository();
