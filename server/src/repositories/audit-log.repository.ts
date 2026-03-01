import mongoose from "mongoose";
import { AuditLog } from "../models/audit-log.model";
import { AuditAction } from "../types/audit-log.type";
import { convertImageKeyToImageUrl } from "../utils";

class AuditLogRepository {
    async log(data: {
        moderatorId: string;
        action: AuditAction;
        targetId: string;
        targetType: "user" | "post" | "reel" | "comment" | "report";
        details?: string;
    }) {
        return AuditLog.create({
            moderator: new mongoose.Types.ObjectId(data.moderatorId),
            action: data.action,
            target_id: new mongoose.Types.ObjectId(data.targetId),
            target_type: data.targetType,
            details: data.details || ""
        });
    }

    async getLogs(
        page: number = 1,
        limit: number = 30,
        action?: string,
        moderatorId?: string
    ) {
        const skip = (page - 1) * limit;
        const query: any = {};

        if (action) query.action = action;
        if (moderatorId)
            query.moderator = new mongoose.Types.ObjectId(moderatorId);

        const [logs, total] = await Promise.all([
            AuditLog.find(query)
                .populate("moderator", "username full_name avatar_key")
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            AuditLog.countDocuments(query)
        ]);

        const formatted = logs.map((log: any) => {
            const mod = log.moderator;
            return {
                ...log,
                log_id: log._id,
                moderator: mod
                    ? {
                          user_id: mod._id,
                          username: mod.username,
                          full_name: mod.full_name,
                          avatar_url: mod.avatar_key
                              ? convertImageKeyToImageUrl(mod.avatar_key)
                              : null
                      }
                    : null
            };
        });

        return {
            logs: formatted,
            pagination: {
                current_page: page,
                total_pages: Math.ceil(total / limit),
                total_count: total,
                has_next_page: skip + limit < total
            }
        };
    }
}

export const auditLogRepo = new AuditLogRepository();
