import { LoginDto } from "../dtos";
import bcrypt from "bcryptjs";
import { Session, User } from "../models";
import { ApiErrorResponse } from "../utils";

class AuthService {
  async login(dto: LoginDto) {
    const emailAddress = dto.emailAddress.trim();
    const password = dto.password;

    const user = await User.findOne({
      email_address: emailAddress
    }).select("+password");

    if (!user) {
      throw new ApiErrorResponse(
        400,
        false,
        "AUTH_ERROR",
        "Invalid email or password"
      );
    }
    const hash = user.password;
    const isPasswordCorrect = await bcrypt.compare(password, hash);

    if (!isPasswordCorrect) {
      throw new ApiErrorResponse(
        400,
        false,
        "AUTH_ERROR_",
        "Invalid email or password"
      );
    }
    const sessionId = crypto.randomUUID();

    const session = await Session.create({
      session_id: sessionId,
      user_id: user._id,
      expires_at: new Date(Date.now() + 1000 * 60 * 60) // 1 hour
    });

    return session;
  }
}

export default new AuthService();
