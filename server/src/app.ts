import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { ApiSuccessResponse } from "./utils";
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
        .json(new ApiSuccessResponse(true, 200, "SociaaNet server", null));
});

// Routes
// Auth Routes
import { authRouter, usersRouter } from "./routes";
app.use("/api/v1/auth", authRouter);

// Users Routes
app.use("/api/v1/users", usersRouter);

// Error handling middleware
import { errorMiddleware } from "./utils";
app.use(errorMiddleware);

export default app;
