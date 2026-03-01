import { Response } from "express";
import { asyncHandler, HttpSuccess } from "../../utils";
import { RequestWithUserContext } from "../../types";
import { reportRepo } from "../../repositories/report.repository";

export const getReportCountsController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const counts = await reportRepo.getReportCounts();
        return res
            .status(200)
            .json(new HttpSuccess(200, true, "Report counts fetched", counts));
    }
);
