"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    getModReels,
    removeReel,
    restoreReel,
    ModReel,
    Pagination
} from "@/features/moderator/moderator.api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Film,
    Trash2,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    Filter,
    Heart,
    MessageSquare,
    Eye,
    Users,
    Clock,
    ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

const filters = [
    { label: "All", value: "" },
    { label: "Active", value: "active" },
    { label: "Removed", value: "removed" }
];

function formatDuration(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function ModeratorReelsPage() {
    const [reels, setReels] = useState<ModReel[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [page, setPage] = useState(1);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchReels = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getModReels(page, 20, filter || undefined);
            setReels(result.reels);
            setPagination(result.pagination);
        } finally {
            setLoading(false);
        }
    }, [page, filter]);

    useEffect(() => {
        fetchReels();
    }, [fetchReels]);

    useEffect(() => {
        setPage(1);
    }, [filter]);

    const handleRemove = async (reelId: string) => {
        setActionLoading(reelId);
        try {
            await removeReel(reelId);
            await fetchReels();
        } catch (err: any) {
            alert(err?.response?.data?.message || "Action failed");
        } finally {
            setActionLoading(null);
        }
    };

    const handleRestore = async (reelId: string) => {
        setActionLoading(reelId);
        try {
            await restoreReel(reelId);
            await fetchReels();
        } catch (err: any) {
            alert(err?.response?.data?.message || "Action failed");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Reels Moderation</h1>
                <p className="text-muted-foreground">
                    Review and moderate user reels
                </p>
            </div>

            {/* Filters */}
            <div className="flex gap-1.5 flex-wrap mb-6">
                {filters.map((f) => (
                    <Button
                        key={f.value}
                        variant={filter === f.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter(f.value)}
                        className="text-xs"
                    >
                        {f.value === "" && (
                            <Filter className="w-3 h-3 mr-1" />
                        )}
                        {f.label}
                    </Button>
                ))}
            </div>

            {/* Reels List */}
            <div className="space-y-3">
                {loading
                    ? Array.from({ length: 5 }).map((_, i) => (
                          <Card key={i}>
                              <CardContent className="py-4">
                                  <div className="flex items-start gap-4">
                                      <Skeleton className="w-20 h-28 rounded-lg" />
                                      <div className="flex-1 space-y-2">
                                          <Skeleton className="h-4 w-32" />
                                          <Skeleton className="h-3 w-full" />
                                          <Skeleton className="h-3 w-24" />
                                      </div>
                                      <Skeleton className="h-8 w-20" />
                                  </div>
                              </CardContent>
                          </Card>
                      ))
                    : reels.map((reel) => (
                          <Card
                              key={reel.reel_id}
                              className={cn(
                                  reel.is_removed_by_moderator &&
                                      "opacity-60 border-red-500/30"
                              )}
                          >
                              <CardContent className="py-4">
                                  <div className="flex items-start gap-4">
                                      {/* Thumbnail */}
                                      <div className="w-20 h-28 rounded-lg bg-muted overflow-hidden shrink-0 relative">
                                          {reel.thumbnail_url ? (
                                              <img
                                                  src={reel.thumbnail_url}
                                                  alt="Reel thumbnail"
                                                  className="w-full h-full object-cover"
                                              />
                                          ) : (
                                              <div className="w-full h-full flex items-center justify-center">
                                                  <Film className="w-6 h-6 text-muted-foreground" />
                                              </div>
                                          )}
                                          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                                              {formatDuration(
                                                  reel.duration_seconds
                                              )}
                                          </div>
                                      </div>

                                      {/* Reel Info */}
                                      <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 flex-wrap mb-1">
                                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                                  {reel.author?.avatar_url ? (
                                                      <img
                                                          src={
                                                              reel.author
                                                                  .avatar_url
                                                          }
                                                          alt={
                                                              reel.author
                                                                  .full_name
                                                          }
                                                          className="w-full h-full object-cover"
                                                      />
                                                  ) : (
                                                      <Users className="w-3 h-3 text-primary" />
                                                  )}
                                              </div>
                                              <span className="font-semibold text-sm">
                                                  <Link
                                                      href={`/u/${reel.author?.username || ""}`}
                                                      target="_blank"
                                                      className="hover:underline inline-flex items-center gap-1"
                                                  >
                                                      {reel.author?.full_name ||
                                                          "Unknown"}
                                                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                                                  </Link>
                                              </span>
                                              <Link
                                                  href={`/u/${reel.author?.username || ""}`}
                                                  target="_blank"
                                                  className="text-xs text-muted-foreground hover:underline"
                                              >
                                                  @
                                                  {reel.author?.username ||
                                                      "unknown"}
                                              </Link>
                                              {reel.is_removed_by_moderator && (
                                                  <Badge
                                                      variant="destructive"
                                                      className="text-xs"
                                                  >
                                                      Removed
                                                  </Badge>
                                              )}
                                              <Badge
                                                  variant="outline"
                                                  className="text-xs capitalize"
                                              >
                                                  {reel.visibility}
                                              </Badge>
                                          </div>
                                          <p className="text-sm line-clamp-2 mb-2">
                                              {reel.caption || (
                                                  <span className="text-muted-foreground italic">
                                                      No caption
                                                  </span>
                                              )}
                                          </p>
                                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                              <span className="flex items-center gap-1">
                                                  <Eye className="w-3 h-3" />
                                                  {reel.views_count}
                                              </span>
                                              <span className="flex items-center gap-1">
                                                  <Heart className="w-3 h-3" />
                                                  {reel.likes_count}
                                              </span>
                                              <span className="flex items-center gap-1">
                                                  <MessageSquare className="w-3 h-3" />
                                                  {reel.comments_count}
                                              </span>
                                              <span className="flex items-center gap-1">
                                                  <Clock className="w-3 h-3" />
                                                  {formatDuration(
                                                      reel.duration_seconds
                                                  )}
                                              </span>
                                              <span>
                                                  {new Date(
                                                      reel.created_at
                                                  ).toLocaleDateString()}
                                              </span>
                                          </div>
                                          {reel.hashtags.length > 0 && (
                                              <div className="flex gap-1 flex-wrap mt-1.5">
                                                  {reel.hashtags.map((tag) => (
                                                      <Badge
                                                          key={tag}
                                                          variant="secondary"
                                                          className="text-xs"
                                                      >
                                                          #{tag}
                                                      </Badge>
                                                  ))}
                                              </div>
                                          )}
                                      </div>

                                      {/* Actions */}
                                      <div className="shrink-0 flex gap-1.5">
                                          <Link
                                              href={`/reels/${reel.reel_id}`}
                                              target="_blank"
                                          >
                                              <Button
                                                  variant="outline"
                                                  size="sm"
                                              >
                                                  <ExternalLink className="w-4 h-4 mr-1" />
                                                  <span className="hidden sm:inline">View</span>
                                              </Button>
                                          </Link>
                                          {reel.is_removed_by_moderator ? (
                                              <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() =>
                                                      handleRestore(
                                                          reel.reel_id
                                                      )
                                                  }
                                                  disabled={
                                                      actionLoading ===
                                                      reel.reel_id
                                                  }
                                              >
                                                  {actionLoading ===
                                                  reel.reel_id ? (
                                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                                                  ) : (
                                                      <>
                                                          <RotateCcw className="w-4 h-4 mr-1" />
                                                          <span className="hidden sm:inline">
                                                              Restore
                                                          </span>
                                                      </>
                                                  )}
                                              </Button>
                                          ) : (
                                              <Button
                                                  variant="destructive"
                                                  size="sm"
                                                  onClick={() =>
                                                      handleRemove(
                                                          reel.reel_id
                                                      )
                                                  }
                                                  disabled={
                                                      actionLoading ===
                                                      reel.reel_id
                                                  }
                                              >
                                                  {actionLoading ===
                                                  reel.reel_id ? (
                                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                                                  ) : (
                                                      <>
                                                          <Trash2 className="w-4 h-4 mr-1" />
                                                          <span className="hidden sm:inline">
                                                              Remove
                                                          </span>
                                                      </>
                                                  )}
                                              </Button>
                                          )}
                                      </div>
                                  </div>
                              </CardContent>
                          </Card>
                      ))}

                {!loading && reels.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <Film className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No reels found</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-muted-foreground">
                        Page {pagination.current_page} of{" "}
                        {pagination.total_pages} ({pagination.total_count}{" "}
                        reels)
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
