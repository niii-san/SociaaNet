import { Response } from "express";
import { asyncHandler, HttpSuccess, HttpError } from "../../utils";
import { RequestWithUserContext } from "../../types";
import { ErrorCodes } from "../../constants/error-code";
import { notificationService } from "../../services/notification.service";
import { auditLogRepo } from "../../repositories/audit-log.repository";
import { User } from "../../models";

export const warnUserController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { userId } = req.params;
        const { message } = req.body;
        const moderatorId = req.user._id.toString();

        if (!message || typeof message !== "string" || message.trim().length === 0) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Warning message is required"
            );
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new HttpError(404, false, ErrorCodes.NOT_FOUND, "User not found");
        }

        if (user.role === "moderator" || user.role === "system_admin") {
            throw new HttpError(
                403,
                false,
                ErrorCodes.FORBIDDEN,
                "Cannot warn a moderator or admin"
            );
        }

        // Send warning notification
        await notificationService.notify({
            recipientId: userId,
            senderId: moderatorId,
            type: "mod_warning",
            targetType: "user",
            content: message.trim()
        });

        // Log the action
        await auditLogRepo.log({
            moderatorId,
            action: "user_warned",
            targetId: userId,
            targetType: "user",
            details: message.trim()
        });

        return res
            .status(200)
            .json(new HttpSuccess(200, true, "Warning sent to user", null));
    }
);
