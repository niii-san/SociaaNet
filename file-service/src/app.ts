import express from "express";
import { imagesRouter, videoRouter } from "./routes";
import { errorMiddleware } from "./utils";
import { requestLogger } from "./middlewares/request-logger";
import { thumbnailRouter } from "./routes/thumbnail.route";

export const app = express();
app.use(express.json());

app.use(requestLogger);

app.get("/", (_, res) => {
    res.status(200).json({
        message: "file_service microservice is running",
        status: "success"
    });
});

app.use("/images", imagesRouter);
app.use("/videos", videoRouter);
app.use("/thumbnails", thumbnailRouter);

// Error handling middleware
app.use(errorMiddleware);
