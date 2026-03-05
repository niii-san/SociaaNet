import mongoose from "mongoose";
import { setupTestDB, teardownTestDB, clearDatabase } from "../helpers/db";
import { Follow } from "../../src/models/follow.model";
import { Comment } from "../../src/models/comment.model";
import { Like } from "../../src/models/like.model";
import { Notification } from "../../src/models/notification.model";
import { Reel } from "../../src/models/reel.model";

beforeAll(async () => await setupTestDB());
afterEach(async () => await clearDatabase());
afterAll(async () => await teardownTestDB());

describe("Follow Model", () => {
    const userId1 = new mongoose.Types.ObjectId();
    const userId2 = new mongoose.Types.ObjectId();

    it("should create a follow relationship", async () => {
        const follow = await Follow.create({
            follower: userId1,
            following: userId2,
            status: "accepted"
        });
        expect(follow.follower.toString()).toBe(userId1.toString());
        expect(follow.following.toString()).toBe(userId2.toString());
        expect(follow.status).toBe("accepted");
    });
});

describe("Comment Model", () => {
    const authorId = new mongoose.Types.ObjectId();
    const postId = new mongoose.Types.ObjectId();

    it("should create a comment with valid data", async () => {
        const comment = await Comment.create({
            author: authorId,
            target_id: postId,
            target_type: "post",
            content: "Great post!"
        });
        expect(comment.content).toBe("Great post!");
        expect(comment.target_type).toBe("post");
    });
});

describe("Like Model", () => {
    const userId = new mongoose.Types.ObjectId();
    const postId = new mongoose.Types.ObjectId();

    it("should create a like with valid data", async () => {
        const like = await Like.create({
            user: userId,
            target_id: postId,
            target_type: "post"
        });
        expect(like.user.toString()).toBe(userId.toString());
        expect(like.target_type).toBe("post");
    });
});

describe("Notification Model", () => {
    const recipientId = new mongoose.Types.ObjectId();
    const senderId = new mongoose.Types.ObjectId();

    it("should create a notification", async () => {
        const notification = await Notification.create({
            recipient: recipientId,
            sender: senderId,
            type: "follow"
        });
        expect(notification.type).toBe("follow");
        expect(notification.is_read).toBe(false);
    });
});

describe("Reel Model", () => {
    const authorId = new mongoose.Types.ObjectId();

    it("should create a reel with valid data", async () => {
        const reel = await Reel.create({
            author: authorId,
            media_key: "video123.mp4",
            thumbnail_key: "thumb123.jpg",
            duration_seconds: 30
        });
        expect(reel.media_key).toBe("video123.mp4");
        expect(reel.duration_seconds).toBe(30);
    });
});
