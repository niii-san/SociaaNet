import { LoginDto } from "../../dtos";
import { AuthService } from "../../services";
import { asyncHandler, ApiSuccessResponse } from "../../utils";
import type { Request, Response } from "express";

const loginController = asyncHandler(async (req: Request, res: Response) => {
    const dto = new LoginDto(req.body);
    const loginRes = await AuthService.login(dto);

    return res
        .status(200)
        .cookie("session_id", loginRes.session_id, {
            httpOnly: true,
            secure: true
        })
        .json(
            new ApiSuccessResponse(true, 200, "User login success", {
                session_id: loginRes.session_id,
                expires_at: loginRes.expires_at
            })
        );
});

export default loginController;
