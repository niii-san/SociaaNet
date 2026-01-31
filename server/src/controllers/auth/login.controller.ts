import { LoginDto } from "../../dtos";
import { authService } from "../../services";
import { asyncHandler, HttpSuccess } from "../../utils";
import type { Request, Response } from "express";

export const loginController = asyncHandler(async (req: Request, res: Response) => {
    const dto = new LoginDto(req.body);
    const loginRes = await authService.login(dto);

    return res
        .status(200)
        .cookie("session_id", loginRes.session_id, {
            httpOnly: true,
            secure: true
        })
        .json(
            new HttpSuccess(true, 200, "User login success", {
                session_id: loginRes.session_id,
                expires_at: loginRes.expires_at
            })
        );
});

