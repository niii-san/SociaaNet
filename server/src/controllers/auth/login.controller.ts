import { UAParser } from "ua-parser-js";
import { LoginDto } from "../../dtos";
import { authService } from "../../services";
import { asyncHandler, HttpSuccess } from "../../utils";
import type { Request, Response } from "express";

export const loginController = asyncHandler(
    async (req: Request, res: Response) => {
        const parser = new UAParser(req.headers["user-agent"] || "Unknown");
        const result = parser.getResult();
        const device = `${result.device.model || result.browser.name || "Unknown Device"} • ${result.os.name || "Unknown OS"}`;

        const dtoBody = {
            email_address: req.body.email_address,
            password: req.body.password,
            ip: req.ip,
            device
        };

        const dto = new LoginDto(dtoBody);

        const loginRes = await authService.login(dto);

        return res
            .status(200)
            .cookie("session_id", loginRes.session_id, {
                httpOnly: true,
                secure: true
            })
            .json(
                new HttpSuccess(200, true, "User login success", {
                    session_id: loginRes.session_id,
                    expires_at: loginRes.expires_at
                })
            );
    }
);
