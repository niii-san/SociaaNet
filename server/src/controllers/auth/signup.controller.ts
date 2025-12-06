import { User } from "../../models";
import { UserService } from "../../services";
import {
    ApiErrorResponse,
    ApiSuccessResponse,
    asyncHandler
} from "../../utils";
import type { Request, Response } from "express";

const signupController = asyncHandler(async (req: Request, res: Response) => {
    const fullName: string = (req.body?.full_name ?? "").trim();
    const emailAddress: string = (req.body?.email_address ?? "").trim();
    const password: string = (req.body?.password ?? "").trim();

    if (!fullName) {
        throw new ApiErrorResponse(
            400,
            false,
            "NO_FULLNAME",
            "Full name is required"
        );
    }
    if (!emailAddress) {
        throw new ApiErrorResponse(
            400,
            false,
            "NO_EMAIL",
            "Email address is required"
        );
    }
    if (!password) {
        throw new ApiErrorResponse(
            400,
            false,
            "NO_PASSWORD",
            "Password is required"
        );
    }

    if (password.length < 8) {
        throw new ApiErrorResponse(
            400,
            false,
            "PW_LEN_ERROR",
            "Password must be 8 characters long"
        );
    }

    const user = await UserService.createUser({
        fullName,
        emailAddress,
        password
    });

    return res
        .status(201)
        .json(new ApiSuccessResponse(true, 201, "User created", user));
});

export default signupController;
