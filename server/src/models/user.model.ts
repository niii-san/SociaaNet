import mongoose from "mongoose";

import { IUser } from "../types";

const userSchema = new mongoose.Schema<IUser>(
  {
    email_address: {
      type: String,
      required: true
    },
    full_name: String,
    username: {
      type: String,
      required: true
    },
    is_disabled: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const User = mongoose.model("User", userSchema);

export default User;
