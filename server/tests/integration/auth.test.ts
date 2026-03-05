import request from "supertest";
import mongoose from "mongoose";
import { setupTestDB, teardownTestDB, clearDatabase } from "../helpers/db";
import app from "../../src/app";

beforeAll(async () => await setupTestDB());
afterEach(async () => await clearDatabase());
afterAll(async () => await teardownTestDB());

describe("GET /", () => {
    it("should return 200 and server info", async () => {
        const res = await request(app).get("/");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("SociaaNet server");
    });
});

describe("POST /api/v1/auth/signup", () => {
    it("should create a new user with valid data", async () => {
        const res = await request(app).post("/api/v1/auth/signup").send({
            full_name: "Test User",
            email_address: "test@example.com",
            password: "Test@123!"
        });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.full_name).toBe("Test User");
        expect(res.body.data.username).toBeDefined();
        expect(res.body.data.user_id).toBeDefined();
    });

    it("should return 400 when full_name is missing", async () => {
        const res = await request(app).post("/api/v1/auth/signup").send({
            email_address: "test@example.com",
            password: "Test@123!"
        });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it("should return 400 when password is too short", async () => {
        const res = await request(app).post("/api/v1/auth/signup").send({
            full_name: "Test User",
            email_address: "test@example.com",
            password: "abc"
        });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it("should return 400 when email is already taken", async () => {
        await request(app).post("/api/v1/auth/signup").send({
            full_name: "User One",
            email_address: "duplicate@example.com",
            password: "Test@123!"
        });
        const res = await request(app).post("/api/v1/auth/signup").send({
            full_name: "User Two",
            email_address: "duplicate@example.com",
            password: "Test@123!"
        });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain("Email is linked with another account");
    });
});

describe("POST /api/v1/auth/login", () => {
    beforeEach(async () => {
        await request(app).post("/api/v1/auth/signup").send({
            full_name: "Login User",
            email_address: "login@example.com",
            password: "Test@123!"
        });
    });

    it("should login with valid credentials", async () => {
        const res = await request(app).post("/api/v1/auth/login").send({
            email_address: "login@example.com",
            password: "Test@123!"
        });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.session_id).toBeDefined();
        expect(res.body.data.expires_at).toBeDefined();
        const cookies = res.headers["set-cookie"];
        expect(cookies).toBeDefined();
    });

    it("should return 400 when email is missing", async () => {
        const res = await request(app).post("/api/v1/auth/login").send({
            password: "Test@123!"
        });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it("should return 401 with wrong password", async () => {
        const res = await request(app).post("/api/v1/auth/login").send({
            email_address: "login@example.com",
            password: "WrongPassword@1"
        });
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });
});

describe("GET /api/v1/auth/validate-session", () => {
    it("should return 401 without session cookie", async () => {
        const res = await request(app).get("/api/v1/auth/validate-session");
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it("should return 401 with invalid session", async () => {
        const res = await request(app)
            .get("/api/v1/auth/validate-session")
            .set("Cookie", "session_id=invalid-session-id");
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it("should validate a real session", async () => {
        // Signup
        await request(app).post("/api/v1/auth/signup").send({
            full_name: "Session User",
            email_address: "session@example.com",
            password: "Test@123!"
        });
        // Login
        const loginRes = await request(app).post("/api/v1/auth/login").send({
            email_address: "session@example.com",
            password: "Test@123!"
        });
        const sessionId = loginRes.body.data.session_id;

        const res = await request(app)
            .get("/api/v1/auth/validate-session")
            .set("Cookie", `session_id=${sessionId}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.username).toBeDefined();
        expect(res.body.data.full_name).toBe("Session User");
    });
});

describe("DELETE /api/v1/auth/logout", () => {
    it("should logout successfully with valid session", async () => {
        await request(app).post("/api/v1/auth/signup").send({
            full_name: "Logout User",
            email_address: "logout@example.com",
            password: "Test@123!"
        });
        const loginRes = await request(app).post("/api/v1/auth/login").send({
            email_address: "logout@example.com",
            password: "Test@123!"
        });
        const sessionId = loginRes.body.data.session_id;

        const res = await request(app)
            .delete("/api/v1/auth/logout")
            .set("Cookie", `session_id=${sessionId}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        // Session should be invalid after logout
        const validateRes = await request(app)
            .get("/api/v1/auth/validate-session")
            .set("Cookie", `session_id=${sessionId}`);
        expect(validateRes.status).toBe(401);
    });
});

describe("Protected routes without auth", () => {
    it("GET /api/v1/users/me should return 401", async () => {
        const res = await request(app).get("/api/v1/users/me");
        expect(res.status).toBe(401);
    });

    it("PATCH /api/v1/auth/change-password should return 401", async () => {
        const res = await request(app)
            .patch("/api/v1/auth/change-password")
            .send({
                current_password: "old",
                new_password: "new"
            });
        expect(res.status).toBe(401);
    });

    it("GET /api/v1/users/me/settings should return 401", async () => {
        const res = await request(app).get("/api/v1/users/me/settings");
        expect(res.status).toBe(401);
    });
});

describe("Non-existent routes", () => {
    it("should return 404 for unknown API routes", async () => {
        const res = await request(app).get("/api/v1/nonexistent");
        expect(res.status).toBe(404);
    });
});
