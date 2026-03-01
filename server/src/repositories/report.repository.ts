import mongoose from "mongoose";
import { Report, ReportDocument } from "../models/report.model";
import { ReportStatus } from "../types/report.type";
import { convertImageKeyToImageUrl } from "../utils";

class ReportRepository {
    async createReport(data: {
        reporter: string;
        target_id: string;
        target_type: "post" | "reel" | "comment" | "user";
        reason: string;
        description?: string;
    }): Promise<ReportDocument> {
        return Report.create({
            reporter: new mongoose.Types.ObjectId(data.reporter),
            target_id: new mongoose.Types.ObjectId(data.target_id),
            target_type: data.target_type,
            reason: data.reason,
            description: data.description || ""
        });
    }

    async getReports(
        page: number = 1,
        limit: number = 20,
        status?: string,
        targetType?: string
    ) {
        const skip = (page - 1) * limit;
        const query: any = {};

        if (status) query.status = status;
        if (targetType) query.target_type = targetType;

        const [reports, total] = await Promise.all([
            Report.find(query)
                .populate("reporter", "username full_name avatar_key")
                .populate("reviewed_by", "username full_name")
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Report.countDocuments(query)
        ]);

        const formatted = reports.map((report: any) => {
            const reporter = report.reporter;
            return {
                ...report,
                report_id: report._id,
                reporter: reporter
                    ? {
                          user_id: reporter._id,
                          username: reporter.username,
                          full_name: reporter.full_name,
                          avatar_url: reporter.avatar_key
                              ? convertImageKeyToImageUrl(reporter.avatar_key)
                              : null
                      }
                    : null
            };
        });

        return {
            reports: formatted,
            pagination: {
                current_page: page,
                total_pages: Math.ceil(total / limit),
                total_count: total,
                has_next_page: skip + limit < total
            }
        };
    }

    async updateReportStatus(
        reportId: string,
        status: ReportStatus,
        moderatorId: string,
        moderatorNote?: string
    ) {
        return Report.findByIdAndUpdate(
            reportId,
            {
                status,
                reviewed_by: new mongoose.Types.ObjectId(moderatorId),
                reviewed_at: new Date(),
                ...(moderatorNote && { moderator_note: moderatorNote })
            },
            { new: true }
        );
    }

    async getReportCounts() {
        const [pending, reviewed, resolved, dismissed, total] =
            await Promise.all([
                Report.countDocuments({ status: "pending" }),
                Report.countDocuments({ status: "reviewed" }),
                Report.countDocuments({ status: "resolved" }),
                Report.countDocuments({ status: "dismissed" }),
                Report.countDocuments()
            ]);

        return { pending, reviewed, resolved, dismissed, total };
    }
}

export const reportRepo = new ReportRepository();
