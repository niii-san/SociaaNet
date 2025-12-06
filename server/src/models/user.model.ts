import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
        password: {
            type: String,
            required: true
        }
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const User = mongoose.model("User", userSchema);

export default User;
