import { Response } from "express";
import { asyncHandler, HttpSuccess, HttpError } from "../../utils";
import { RequestWithUserContext } from "../../types";
import { reportRepo } from "../../repositories/report.repository";
import { ErrorCodes } from "../../constants/error-code";
import { auditLogRepo } from "../../repositories/audit-log.repository";

export const updateReportStatusController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { reportId } = req.params;
        const { status, moderator_note } = req.body;
        const moderatorId = req.user._id.toString();

        const validStatuses = ["pending", "reviewed", "resolved", "dismissed"];
        if (!status || !validStatuses.includes(status)) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Valid status is required (pending, reviewed, resolved, dismissed)"
            );
        }

        const report = await reportRepo.updateReportStatus(
            reportId,
            status,
            moderatorId,
            moderator_note
        );

        if (!report) {
            throw new HttpError(404, false, ErrorCodes.NOT_FOUND, "Report not found");
        }

        // Audit log
        const actionMap: Record<string, any> = {
            reviewed: "report_reviewed",
            resolved: "report_resolved",
            dismissed: "report_dismissed"
        };
        if (actionMap[status]) {
            await auditLogRepo.log({
                moderatorId,
                action: actionMap[status],
                targetId: reportId,
                targetType: "report",
                details: moderator_note || `Report ${status}`
            });
        }

        return res
            .status(200)
            .json(new HttpSuccess(200, true, "Report status updated", null));
    }
);
