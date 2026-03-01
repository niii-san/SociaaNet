"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    getModReports,
    updateReportStatus,
    ModReport,
    Pagination
} from "@/features/moderator/moderator.api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
    ChevronLeft,
    ChevronRight,
    Filter,
    Flag,
    CheckCircle,
    XCircle,
    Eye,
    FileText,
    Film,
    MessageSquare,
    User,
    ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusFilters = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Reviewed", value: "reviewed" },
    { label: "Resolved", value: "resolved" },
    { label: "Dismissed", value: "dismissed" }
];

const typeFilters = [
    { label: "All Types", value: "" },
    { label: "Posts", value: "post" },
    { label: "Reels", value: "reel" },
    { label: "Comments", value: "comment" },
    { label: "Users", value: "user" }
];

const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    reviewed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    resolved: "bg-green-500/10 text-green-600 border-green-500/20",
    dismissed: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
};

const targetTypeIcons: Record<string, React.ElementType> = {
    post: FileText,
    reel: Film,
    comment: MessageSquare,
    user: User
};

const reasonLabels: Record<string, string> = {
    spam: "Spam",
    harassment: "Harassment",
    hate_speech: "Hate Speech",
    violence: "Violence",
    nudity: "Nudity",
    false_information: "False Information",
    intellectual_property: "Intellectual Property",
    self_harm: "Self Harm",
    other: "Other"
};

function getTargetLink(targetType: string, targetId: string): string | null {
    switch (targetType) {
        case "post":
            return `/posts/${targetId}`;
        case "reel":
            return `/reels/${targetId}`;
        default:
            return null;
    }
}

export default function ModeratorReportsPage() {
    const [reports, setReports] = useState<ModReport[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [page, setPage] = useState(1);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [expandedReport, setExpandedReport] = useState<string | null>(null);
    const [moderatorNote, setModeratorNote] = useState("");

    const fetchReports = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getModReports(
                page,
                20,
                statusFilter || undefined,
                typeFilter || undefined
            );
            setReports(result.reports);
            setPagination(result.pagination);
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, typeFilter]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    useEffect(() => {
        setPage(1);
    }, [statusFilter, typeFilter]);

    const handleUpdateStatus = async (reportId: string, status: string) => {
        setActionLoading(reportId);
        try {
            await updateReportStatus(reportId, status, moderatorNote || undefined);
            setExpandedReport(null);
            setModeratorNote("");
            await fetchReports();
        } catch (err: any) {
            alert(err?.response?.data?.message || "Action failed");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Reports</h1>
                <p className="text-muted-foreground">
                    Review and manage user reports
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 mb-6">
                <div className="flex gap-1.5 flex-wrap">
                    {statusFilters.map((f) => (
                        <Button
                            key={f.value}
                            variant={statusFilter === f.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter(f.value)}
                            className="text-xs"
                        >
                            {f.value === "" && <Filter className="w-3 h-3 mr-1" />}
                            {f.label}
                        </Button>
                    ))}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {typeFilters.map((f) => (
                        <Button
                            key={f.value}
                            variant={typeFilter === f.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTypeFilter(f.value)}
                            className="text-xs"
                        >
                            {f.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Reports List */}
            <div className="space-y-3">
                {loading
                    ? Array.from({ length: 5 }).map((_, i) => (
                          <Card key={i}>
                              <CardContent className="py-4 space-y-2">
                                  <Skeleton className="h-4 w-48" />
                                  <Skeleton className="h-3 w-64" />
                                  <Skeleton className="h-3 w-32" />
                              </CardContent>
                          </Card>
                      ))
                    : reports.length === 0 ? (
                          <Card>
                              <CardContent className="py-12 text-center">
                                  <Flag className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                                  <p className="text-muted-foreground">No reports found</p>
                              </CardContent>
                          </Card>
                      ) : reports.map((report) => {
                          const TargetIcon = targetTypeIcons[report.target_type] || Flag;
                          const isExpanded = expandedReport === report.report_id;

                          return (
                              <Card key={report.report_id}>
                                  <CardContent className="py-4">
                                      <div className="flex items-start gap-3">
                                          {/* Target Type Icon */}
                                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                              <TargetIcon className="w-5 h-5 text-primary" />
                                          </div>

                                          {/* Report Info */}
                                          <div className="flex-1 min-w-0">
                                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                                  <Badge
                                                      variant="outline"
                                                      className={cn(
                                                          "text-xs capitalize",
                                                          statusColors[report.status]
                                                      )}
                                                  >
                                                      {report.status}
                                                  </Badge>
                                                  <Badge variant="secondary" className="text-xs capitalize">
                                                      {report.target_type}
                                                  </Badge>
                                                  <Badge variant="outline" className="text-xs">
                                                      {reasonLabels[report.reason] || report.reason}
                                                  </Badge>
                                              </div>

                                              <p className="text-sm">
                                                  Reported by{" "}
                                                  <Link
                                                      href={`/u/${report.reporter?.username || ""}`}
                                                      target="_blank"
                                                      className="font-medium hover:underline inline-flex items-center gap-1"
                                                  >
                                                      @{report.reporter?.username || "Unknown"}
                                                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                                                  </Link>
                                              </p>

                                              {/* View reported content link */}
                                              {(() => {
                                                  const link = getTargetLink(report.target_type, report.target_id);
                                                  return link ? (
                                                      <Link
                                                          href={link}
                                                          target="_blank"
                                                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-0.5"
                                                      >
                                                          <ExternalLink className="w-3 h-3" />
                                                          View reported {report.target_type}
                                                      </Link>
                                                  ) : null;
                                              })()}

                                              {report.description && (
                                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                      {report.description}
                                                  </p>
                                              )}

                                              <p className="text-xs text-muted-foreground mt-1">
                                                  {new Date(report.created_at).toLocaleString()}
                                                  {report.reviewed_by && (
                                                      <>
                                                          {" · "}Reviewed by @{report.reviewed_by.username}
                                                      </>
                                                  )}
                                              </p>

                                              {report.moderator_note && (
                                                  <p className="text-xs text-muted-foreground mt-1 italic">
                                                      Note: {report.moderator_note}
                                                  </p>
                                              )}

                                              {/* Expanded actions */}
                                              {isExpanded && (
                                                  <div className="mt-3 space-y-2 border-t pt-3">
                                                      <Textarea
                                                          placeholder="Add a moderator note (optional)..."
                                                          value={moderatorNote}
                                                          onChange={(e) => setModeratorNote(e.target.value)}
                                                          className="text-sm"
                                                          rows={2}
                                                      />
                                                      <div className="flex gap-2 flex-wrap">
                                                          <Button
                                                              size="sm"
                                                              variant="outline"
                                                              onClick={() => handleUpdateStatus(report.report_id, "reviewed")}
                                                              disabled={actionLoading === report.report_id}
                                                          >
                                                              <Eye className="w-3.5 h-3.5 mr-1" />
                                                              Mark Reviewed
                                                          </Button>
                                                          <Button
                                                              size="sm"
                                                              variant="default"
                                                              onClick={() => handleUpdateStatus(report.report_id, "resolved")}
                                                              disabled={actionLoading === report.report_id}
                                                          >
                                                              <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                                              Resolve
                                                          </Button>
                                                          <Button
                                                              size="sm"
                                                              variant="secondary"
                                                              onClick={() => handleUpdateStatus(report.report_id, "dismissed")}
                                                              disabled={actionLoading === report.report_id}
                                                          >
                                                              <XCircle className="w-3.5 h-3.5 mr-1" />
                                                              Dismiss
                                                          </Button>
                                                          <Button
                                                              size="sm"
                                                              variant="ghost"
                                                              onClick={() => {
                                                                  setExpandedReport(null);
                                                                  setModeratorNote("");
                                                              }}
                                                          >
                                                              Cancel
                                                          </Button>
                                                      </div>
                                                  </div>
                                              )}
                                          </div>

                                          {/* Quick Actions */}
                                          {!isExpanded && report.status === "pending" && (
                                              <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => setExpandedReport(report.report_id)}
                                                  className="shrink-0"
                                              >
                                                  Review
                                              </Button>
                                          )}
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
