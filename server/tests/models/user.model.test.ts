import mongoose from "mongoose";
import { setupTestDB, teardownTestDB, clearDatabase } from "../helpers/db";
import { User } from "../../src/models/user.model";

beforeAll(async () => await setupTestDB());
afterEach(async () => await clearDatabase());
afterAll(async () => await teardownTestDB());

describe("User Model", () => {
    const validUserData = {
        email_address: "test@example.com",
        full_name: "Test User",
        username: "test_user",
        password: "hashedpassword123"
    };

    it("should create a user with valid data", async () => {
        const user = await User.create(validUserData);
        expect(user._id).toBeDefined();
        expect(user.email_address).toBe("test@example.com");
        expect(user.username).toBe("test_user");
        expect(user.full_name).toBe("Test User");
    });

    it("should set default values correctly", async () => {
        const user = await User.create(validUserData);
        expect(user.is_disabled).toBe(false);
        expect(user.is_private_account).toBe(false);
        expect(user.is_email_verified).toBe(false);
        expect(user.followers_count).toBe(0);
        expect(user.following_count).toBe(0);
        expect(user.bio).toBe("");
        expect(user.avatar_key).toBeNull();
        expect(user.role).toBe("user");
        expect(user.is_online).toBe(false);
        expect(user.last_active_at).toBeNull();
    });

    it("should fail without required email_address", async () => {
        const data = { ...validUserData, email_address: undefined };
        await expect(User.create(data)).rejects.toThrow();
    });

    it("should only allow valid roles", async () => {
        const userRole = await User.create({ ...validUserData, role: "user" });
        expect(userRole.role).toBe("user");

        const modRole = await User.create({
            ...validUserData,
            email_address: "mod@test.com",
            username: "mod_user",
            role: "moderator"
        });
        expect(modRole.role).toBe("moderator");
    });
});
