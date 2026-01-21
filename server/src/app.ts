import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { ApiSuccessResponse } from "./utils";
import cors from "cors";

const app = express();
// config

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// cors settings
const corsOption = {
    origin: "http://localhost:3000"
};
app.use(cors(corsOption));

app.get("/", (_: Request, res: Response) => {
    return res
        .status(200)
        .json(new ApiSuccessResponse(true, 200, "SociaaNet server", null));
});

// Routes
import { authRouter } from "./routes";
app.use("/api/v1/auth", authRouter);

// Error handling middleware
import { errorMiddleware } from "./utils";
app.use(errorMiddleware);

export default app;
