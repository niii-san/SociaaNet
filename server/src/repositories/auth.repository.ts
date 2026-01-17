import { Session, ISession } from "../models";

interface IAuthRepository {
    createSession(sessionData: Partial<ISession>): Promise<ISession>;
    getSessionById(sessionId: string): Promise<ISession | null>;
}

export class AuthRepository implements IAuthRepository {
    async createSession(sessionData: Partial<ISession>): Promise<ISession> {
        const session = await Session.create(sessionData);

        return session;
    }

    async getSessionById(sessionId: string) {
        const session = await Session.findOne({ session_id: sessionId });

        return session;
    }
}
