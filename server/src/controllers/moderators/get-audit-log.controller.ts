import { Response } from "express";
import { asyncHandler, HttpSuccess } from "../../utils";
import { RequestWithUserContext } from "../../types";
import { auditLogRepo } from "../../repositories/audit-log.repository";

export const getAuditLogController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 30;
        const action = req.query.action as string | undefined;
        const moderatorId = req.query.moderator_id as string | undefined;

        const result = await auditLogRepo.getLogs(page, limit, action, moderatorId);
        return res
            .status(200)
            .json(
                new HttpSuccess(200, true, "Audit log fetched", result.logs, {
                    pagination: result.pagination
                })
            );
    }
);
