import { LoginDto } from "../dtos";
import bcrypt from "bcryptjs";
import { HttpError } from "../utils";
import { authRepo, userRepo } from "../repositories";
import { env } from "../config";

class AuthService {
    async login(dto: LoginDto) {
        const emailAddress = (dto.emailAddress ?? "").trim();
        const password: string | undefined = dto.password;

        if (!emailAddress) {
            throw new HttpError(
                400,
                false,
                "NO_EMAIL",
                "Email address is required"
            );
        }

        if (!password) {
            throw new HttpError(
                400,
                false,
                "NO_PASSWORD",
                "Password is required"
            );
        }

        if (password.length < 8 || password.length > 24) {
            throw new HttpError(400, false, "PW_LEN_ERROR", "Invalid password");
        }

        const user = await userRepo.getUserByEmail(emailAddress);

        if (!user) {
            throw new HttpError(
                400,
                false,
                "AUTH_ERROR",
                "Invalid email or password"
            );
        }
        const hash = user.password;
        const isPasswordCorrect = await bcrypt.compare(password, hash);

        if (!isPasswordCorrect) {
            throw new HttpError(
                400,
                false,
                "AUTH_ERROR_",
                "Invalid email or password"
            );
        }
        const sessionId = crypto.randomUUID();

        const sessionExpiryTime = new Date(
            Date.now() + 1000 * 60 * env.sessionExpiryInMinutes
        );

        const session = await authRepo.createSession({
            session_id: sessionId,
            user_id: user._id,
            expires_at: sessionExpiryTime
        });

        return session;
    }
}

export const authService = new AuthService();
