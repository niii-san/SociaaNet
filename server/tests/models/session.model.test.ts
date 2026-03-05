import mongoose from "mongoose";
import { setupTestDB, teardownTestDB, clearDatabase } from "../helpers/db";
import { Session } from "../../src/models/session.model";

beforeAll(async () => await setupTestDB());
afterEach(async () => await clearDatabase());
afterAll(async () => await teardownTestDB());

describe("Session Model", () => {
    const userId = new mongoose.Types.ObjectId();

    it("should create a session with valid data", async () => {
        const session = await Session.create({
            session_id: "test-session-123",
            user_id: userId,
            ip: "127.0.0.1",
            device: "Chrome",
            expires_at: new Date(Date.now() + 3600000)
        });
        expect(session._id).toBeDefined();
        expect(session.session_id).toBe("test-session-123");
    });

    it("should set default values correctly", async () => {
        const session = await Session.create({
            session_id: "session-defaults",
            user_id: userId,
            ip: "192.168.1.1",
            device: "Firefox",
            expires_at: new Date(Date.now() + 3600000)
        });
        expect(session.has_expired).toBe(false);
        expect(session.is_deleted).toBe(false);
        expect(session.is_revoked).toBe(false);
    });
});
