import express from "express";
import { uploadImageRoute } from "./routes";
import { errorMiddleware } from "./utils";

export const app = express();
app.use(express.json());

app.get("/", (_, res) => {
    res.status(200).json({
        message: "file_service microservice is running",
        status: "success"
    });
});

app.use("/images", uploadImageRoute);

// Error handling middleware
app.use(errorMiddleware);
