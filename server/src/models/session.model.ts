import mongoose from "mongoose";

import { ISession } from "../types";

const sessionSchema = new mongoose.Schema<ISession>(
  {
    session_id: {
      type: String,
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    is_expired: {
      type: Boolean,
      required: true,
      default: false
    },
    expires_at: {
      type: Date,
      required: true
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
