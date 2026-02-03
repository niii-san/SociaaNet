import mongoose from "mongoose";
import { UserSettingsEntity } from "../types";

const userSettingsSchema = new mongoose.Schema<UserSettingsEntity>({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        unique: true
    },
    privacy: {
        private_account: {
            type: Boolean,
            default: false
        },
        allow_messages_from: {
            type: String,
            enum: ["everyone", "followers_only", "no_one"],
            default: "everyone"
        },
        allow_comments_from: {
            type: String,
            enum: ["everyone", "followers_only", "no_one"],
            default: "everyone"
        },
        allow_mentions_from: {
            type: String,
            enum: ["everyone", "followers_only", "no_one"],
            default: "everyone"
        },
        show_online_status: {
            type: Boolean,
            default: true
        },
        show_last_seen: {
            type: Boolean,
            default: true
        },
        blocked_users: {
            type: {
                user_id: mongoose.Schema.Types.ObjectId,
                username: String,
                full_name: String,
                avatar_key: String
            },
            default: []
        }
    },
    notifications: {
        likes: {
            type: Boolean,
            default: true
        },
        comments: {
            type: Boolean,
            default: true
        },
        mentions: {
            type: Boolean,
            default: true
        },
        follows: {
            type: Boolean,
            default: true
        },
        messages: {
            type: Boolean,
            default: true
        }
    },
    appearance: {
        theme: {
            type: String,
            enum: ["light", "dark", "system"],
            default: "system"
        }
    },
    feed: {
        mode: {
            type: String,
            enum: ["algorithmic", "chronological"],
            default: "algorithmic"
        },
        show_sensitive_content: {
            type: Boolean,
            default: true
        }
    },
    security: {
        login_alerts: {
            type: Boolean,
            default: true
        },
        active_session: {
            type: [
                {
                    device: String,
                    ip: String,
                    last_activity: Date
                }
            ],
            default: []
        }
    }
});

export const UserSettings = mongoose.model("UserSettings", userSettingsSchema);
export type UserSettingsDocument =
    mongoose.HydratedDocument<UserSettingsEntity>;
