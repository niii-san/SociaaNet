import { Request, Response } from "express";
import { asyncHandler, HttpError, HttpSuccess } from "../../utils";
import { RequestWithUserContext } from "../../types";
import { ErrorCodes } from "../../constants/error-code";
import {
    SetCommentsNotificationDto,
    SetLikesNotificationDto
} from "../../dtos";
import { userSettingsService } from "../../services/user-settings.service";

export const notificationsController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id;
        const likes = req.body?.likes;
        const comments = req.body?.comments;
        const follows = req.body?.follows;
        const mentions = req.body?.mentions;
        const messages = req.body?.messages;

        const fieldsCount = [
            likes,
            comments,
            follows,
            mentions,
            messages
        ].filter((field) => field !== undefined).length;

        let result;

        if (fieldsCount > 1 || fieldsCount === 0) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Exactly one notification setting must be provided"
            );
        }

        if (likes !== undefined) {
            const dto = new SetLikesNotificationDto(userId.toString(), likes);
            result = await userSettingsService.setLikesNotification(dto);
        }
        if (comments !== undefined) {
            const dto = new SetCommentsNotificationDto(
                userId.toString(),
                comments
            );
            result = await userSettingsService.setCommentsNotification(dto);
        }
        if (follows !== undefined) {
            const dto = new SetCommentsNotificationDto(
                userId.toString(),
                follows
            );
            result = await userSettingsService.setFollowsNotification(dto);
        }
        if (mentions !== undefined) {
            const dto = new SetCommentsNotificationDto(
                userId.toString(),
                mentions
            );
            result = await userSettingsService.setMentionsNotification(dto);
        }
        if (messages !== undefined) {
            const dto = new SetCommentsNotificationDto(
                userId.toString(),
                messages
            );
            result = await userSettingsService.setMessagesNotification(dto);
        }

        res.status(200).json(
            new HttpSuccess(
                200,
                true,
                "Notification setting updated successfully",
                result
            )
        );
    }
);
