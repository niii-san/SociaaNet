import { Response } from "express";
import { asyncHandler, HttpSuccess } from "../../utils";
import { RequestWithUserContext } from "../../types";
import { reportRepo } from "../../repositories/report.repository";

export const getReportsController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const status = req.query.status as string | undefined;
        const targetType = req.query.target_type as string | undefined;

        const result = await reportRepo.getReports(page, limit, status, targetType);
        return res
            .status(200)
            .json(
                new HttpSuccess(200, true, "Reports fetched", result.reports, {
                    pagination: result.pagination
                })
            );
    }
);
