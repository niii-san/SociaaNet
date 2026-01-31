import express from "express";
import { imagesRouter } from "./routes";
import { errorMiddleware } from "./utils";
import { requestLogger } from "./middlewares/request-logger";

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

// Error handling middleware
app.use(errorMiddleware);
