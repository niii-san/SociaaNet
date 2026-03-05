import mongoose from "mongoose";
import { setupTestDB, teardownTestDB, clearDatabase } from "../helpers/db";
import { Post } from "../../src/models/post.model";

beforeAll(async () => await setupTestDB());
afterEach(async () => await clearDatabase());
afterAll(async () => await teardownTestDB());

describe("Post Model", () => {
    const authorId = new mongoose.Types.ObjectId();

    it("should create a post with valid data", async () => {
        const post = await Post.create({
            author: authorId,
            caption: "Hello world #test",
            hashtags: ["test"],
            media_keys: ["image1.jpg"]
        });
        expect(post._id).toBeDefined();
        expect(post.author.toString()).toBe(authorId.toString());
        expect(post.caption).toBe("Hello world #test");
    });

    it("should set default values correctly", async () => {
        const post = await Post.create({
            author: authorId,
            media_keys: []
        });
        expect(post.caption).toBe("");
        expect(post.hashtags).toEqual([]);
        expect(post.likes_count).toBe(0);
        expect(post.comments_count).toBe(0);
        expect(post.is_deleted).toBe(false);
        expect(post.visibility).toBe("public");
    });

    it("should reject invalid visibility values", async () => {
        await expect(
            Post.create({ author: authorId, visibility: "invalid" as any })
        ).rejects.toThrow();
    });
});
