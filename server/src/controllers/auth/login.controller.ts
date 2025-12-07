import { LoginDto } from "../../dtos";
import { AuthService } from "../../services";
import {
  asyncHandler,
  ApiSuccessResponse,
  ApiErrorResponse
} from "../../utils";
import type { Request, Response } from "express";

const loginController = asyncHandler(async (req: Request, res: Response) => {
  const emailAddress = (req.body?.email_address ?? "").trim();
  const password: string | undefined = req.body?.password;

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

  if (password.length < 8 || password.length > 24) {
    throw new ApiErrorResponse(400, false, "PW_LEN_ERROR", "Invalid password");
  }

  const dto = new LoginDto(req.body);
  const loginRes = await AuthService.login(dto);

  return res
    .status(200)
    .cookie("session_id", loginRes.session_id, { httpOnly: true, secure: true })
    .json(
      new ApiSuccessResponse(true, 200, "User login success", {
        session_id: loginRes.session_id,
        expires_at: loginRes.expires_at
      })
    );
});

export default loginController;
