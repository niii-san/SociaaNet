import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email_address: String,
        full_name: String,
        username: String,
        password: String
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const User = mongoose.model("User", userSchema);

export default User;
