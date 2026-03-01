import { Response } from "express";
import { asyncHandler, HttpSuccess, HttpError } from "../../utils";
import { RequestWithUserContext } from "../../types";
import { reportRepo } from "../../repositories/report.repository";
import { ErrorCodes } from "../../constants/error-code";

export const submitReportController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { target_id, target_type, reason, description } = req.body;
        const reporterId = req.user._id.toString();

        if (!target_id || !target_type || !reason) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "target_id, target_type, and reason are required"
            );
        }

        const validTypes = ["post", "reel", "comment", "user"];
        if (!validTypes.includes(target_type)) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid target_type"
            );
        }

        try {
            const report = await reportRepo.createReport({
                reporter: reporterId,
                target_id,
                target_type,
                reason,
                description
            });
            return res
                .status(201)
                .json(
                    new HttpSuccess(
                        201,
                        true,
                        "Report submitted successfully",
                        { report_id: report._id }
                    )
                );
        } catch (err: any) {
            if (err.code === 11000) {
                throw new HttpError(
                    409,
                    false,
                    ErrorCodes.DUPLICATE,
                    "You have already reported this content"
                );
            }
            throw err;
        }
    }
);
