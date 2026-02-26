import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { HttpSuccess } from "./utils";
import cors from "cors";
import { requestLogger } from "./middlewares";

const app = express();
// config

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// cors settings
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
);

// Logger
app.use(requestLogger);

app.get("/", (_: Request, res: Response) => {
    return res
        .status(200)
        .json(new HttpSuccess(200, true, "SociaaNet server", null));
});

// Routes
// Auth Routes
import {
    authRouter,
    usersRouter,
    filesRouter,
    moderatorsRouter,
    settingsRouter,
    mediaRouter
} from "./routes";

// Auth Routes
app.use("/api/v1/auth", authRouter);

// Files Routes
app.use("/api/v1/files", filesRouter);

// Users Routes
app.use("/api/v1/users", usersRouter);

// Settings Routes
app.use("/api/v1/users/me/settings", settingsRouter);

// Media routes
app.use("/api/v1/media", mediaRouter);

// Moderators Routes
app.use("/api/v1/moderators", moderatorsRouter);

// Error handling middleware
import { errorMiddleware } from "./utils";
app.use(errorMiddleware);

export default app;
