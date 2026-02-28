import { Router } from "express";
import { authenticate } from "../middlewares";
import {
    getConversationsController,
    createDirectConversationController,
    createGroupConversationController,
    getMessagesController,
    sendMessageController,
    reactToMessageController,
    removeReactionController,
    markAsReadController,
    deleteMessageController,
    getUnreadCountController,
    addParticipantController,
    removeParticipantController,
    updateGroupNameController,
    getFriendsController,
    getUsersActivityController,
    deleteConversationController
} from "../controllers/chat/chat.controller";
import { uploadChatMediaController } from "../controllers/chat/upload-chat-media.controller";
import multer from "multer";

export const chatRouter = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

chatRouter.use(authenticate);

// Media upload
chatRouter.post("/upload", upload.array("files", 10), uploadChatMediaController);

// Conversations
chatRouter.get("/conversations", getConversationsController);
chatRouter.post("/conversations/direct", createDirectConversationController);
chatRouter.post("/conversations/group", createGroupConversationController);
chatRouter.delete("/conversations/:conversationId", deleteConversationController);

// Messages
chatRouter.get(
    "/conversations/:conversationId/messages",
    getMessagesController
);
chatRouter.post(
    "/conversations/:conversationId/messages",
    sendMessageController
);

// Read receipts
chatRouter.post(
    "/conversations/:conversationId/read",
    markAsReadController
);

// Message actions
chatRouter.post("/messages/:messageId/react", reactToMessageController);
chatRouter.delete("/messages/:messageId/react", removeReactionController);
chatRouter.delete("/messages/:messageId", deleteMessageController);

// Group management
chatRouter.post(
    "/conversations/:conversationId/participants",
    addParticipantController
);
chatRouter.delete(
    "/conversations/:conversationId/participants/:userId",
    removeParticipantController
);
chatRouter.patch(
    "/conversations/:conversationId/name",
    updateGroupNameController
);

// Utility
chatRouter.get("/unread-count", getUnreadCountController);
chatRouter.get("/friends", getFriendsController);
chatRouter.post("/users/activity", getUsersActivityController);
