import type { NextFunction, Request, Response } from "express";
import { ErrorCodes } from "../constants/error-code";

export class HttpError {
    status_code: number = 400;
    success: boolean = false;
    message: string = "Something went wrong!";
    error: { code: string } = {
        code: "SERVER_ERROR"
    };

    constructor(
        status_code: number,
        success: boolean,
        code: string,
        message: string
    ) {
        this.status_code = status_code;
        this.success = success;
        this.error = {
            code
        };
        this.message = message;
    }

    toJSON() {
        return {
            status_code: this.status_code,
            success: this.success,
            message: this.message,
            error: this.error
        };
    }
}


export const errorMiddleware = (
    err: Error,
    _: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof HttpError) {
        res.status(err.status_code).json(err.toJSON());
    } else {
        res.status(500).json({
            status_code: 500,
            success: false,
            message: `Server Error :/ ${err.message}`,
            error: {
                code: ErrorCodes.SERVER_ERROR
            }
        });
    }
    next();
};
