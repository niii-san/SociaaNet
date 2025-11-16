import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";

const app = express();
// Basic config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    return res.json({
        success: true,
        server_health: 100
    });
});

export default app;
