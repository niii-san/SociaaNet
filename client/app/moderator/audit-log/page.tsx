"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
    getAuditLog,
    AuditLogEntry,
    Pagination
} from "@/features/moderator/moderator.api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ChevronLeft,
    ChevronRight,
    Filter,
    ClipboardList,
    UserX,
    UserCheck,
    AlertTriangle,
    Trash2,
    RotateCcw,
    MessageSquareX,
    FileSearch,
    CheckCircle,
    XCircle
} from "lucide-react";

const actionFilters = [
    { label: "All", value: "" },
    { label: "User Disabled", value: "user_disabled" },
    { label: "User Enabled", value: "user_enabled" },
    { label: "User Warned", value: "user_warned" },
    { label: "Post Removed", value: "post_removed" },
    { label: "Post Restored", value: "post_restored" },
    { label: "Reel Removed", value: "reel_removed" },
    { label: "Reel Restored", value: "reel_restored" },
    { label: "Comment Removed", value: "comment_removed" },
    { label: "Report Resolved", value: "report_resolved" },
    { label: "Report Dismissed", value: "report_dismissed" }
];

const actionIcons: Record<string, React.ElementType> = {
    user_disabled: UserX,
    user_enabled: UserCheck,
    user_warned: AlertTriangle,
    post_removed: Trash2,
    post_restored: RotateCcw,
    reel_removed: Trash2,
    reel_restored: RotateCcw,
    comment_removed: MessageSquareX,
    report_reviewed: FileSearch,
    report_resolved: CheckCircle,
    report_dismissed: XCircle
};

const actionColors: Record<string, string> = {
    user_disabled: "text-red-500",
    user_enabled: "text-green-500",
    user_warned: "text-amber-500",
    post_removed: "text-red-500",
    post_restored: "text-green-500",
    reel_removed: "text-red-500",
    reel_restored: "text-green-500",
    comment_removed: "text-red-500",
    report_reviewed: "text-blue-500",
    report_resolved: "text-green-500",
    report_dismissed: "text-zinc-500"
};

const actionLabels: Record<string, string> = {
    user_disabled: "Disabled User",
    user_enabled: "Enabled User",
    user_warned: "Warned User",
    post_removed: "Removed Post",
    post_restored: "Restored Post",
    reel_removed: "Removed Reel",
    reel_restored: "Restored Reel",
    comment_removed: "Removed Comment",
    report_reviewed: "Reviewed Report",
    report_resolved: "Resolved Report",
    report_dismissed: "Dismissed Report"
};

export default function ModeratorAuditLogPage() {
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionFilter, setActionFilter] = useState("");
    const [page, setPage] = useState(1);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getAuditLog(
                page,
                30,
                actionFilter || undefined
            );
            setLogs(result.logs);
            setPagination(result.pagination);
        } finally {
            setLoading(false);
        }
    }, [page, actionFilter]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    useEffect(() => {
        setPage(1);
    }, [actionFilter]);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Audit Log</h1>
                <p className="text-muted-foreground">
                    Track all moderator actions
                </p>
            </div>

            {/* Filters */}
            <div className="flex gap-1.5 flex-wrap mb-6">
                {actionFilters.map((f) => (
                    <Button
                        key={f.value}
                        variant={actionFilter === f.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActionFilter(f.value)}
                        className="text-xs"
                    >
                        {f.value === "" && <Filter className="w-3 h-3 mr-1" />}
                        {f.label}
                    </Button>
                ))}
            </div>

            {/* Log Entries */}
            <div className="space-y-2">
                {loading
                    ? Array.from({ length: 8 }).map((_, i) => (
                          <Card key={i}>
                              <CardContent className="py-3 flex items-center gap-3">
                                  <Skeleton className="w-8 h-8 rounded-full" />
                                  <div className="flex-1 space-y-1.5">
                                      <Skeleton className="h-3.5 w-48" />
                                      <Skeleton className="h-3 w-32" />
                                  </div>
                                  <Skeleton className="h-3 w-24" />
                              </CardContent>
                          </Card>
                      ))
                    : logs.length === 0 ? (
                          <Card>
                              <CardContent className="py-12 text-center">
                                  <ClipboardList className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                                  <p className="text-muted-foreground">No audit log entries found</p>
                              </CardContent>
                          </Card>
                      ) : logs.map((log) => {
                          const Icon = actionIcons[log.action] || ClipboardList;
                          const color = actionColors[log.action] || "text-muted-foreground";
                          const label = actionLabels[log.action] || log.action;

                          return (
                              <Card key={log.log_id}>
                                  <CardContent className="py-3 flex items-center gap-3">
                                      {/* Action Icon */}
                                      <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0`}>
                                          <Icon className={`w-4 h-4 ${color}`} />
                                      </div>

                                      {/* Log Info */}
                                      <div className="flex-1 min-w-0">
                                          <p className="text-sm">
                                              <span className="font-medium">
                                                  @{log.moderator?.username || "Unknown"}
                                              </span>{" "}
                                              <span className={color}>{label.toLowerCase()}</span>
                                          </p>
                                          {log.details && (
                                              <p className="text-xs text-muted-foreground truncate">
                                                  {log.details}
                                              </p>
                                          )}
                                      </div>

                                      {/* Metadata */}
                                      <div className="flex items-center gap-2 shrink-0">
                                          <Badge variant="outline" className="text-xs capitalize">
                                              {log.target_type}
                                          </Badge>
                                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                                              {new Date(log.created_at).toLocaleString()}
                                          </span>
                                      </div>
                                  </CardContent>
                              </Card>
                          );
                      })}
            </div>

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-muted-foreground">
                        Page {pagination.current_page} of {pagination.total_pages} ·{" "}
                        {pagination.total_count} total
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={!pagination.has_next_page}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
