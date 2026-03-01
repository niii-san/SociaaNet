"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
    getModPosts,
    removePost,
    restorePost,
    ModPost,
    Pagination
} from "@/features/moderator/moderator.api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    FileText,
    Trash2,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    Filter,
    Heart,
    MessageSquare,
    Users
} from "lucide-react";
import { cn } from "@/lib/utils";

const filters = [
    { label: "All", value: "" },
    { label: "Active", value: "active" },
    { label: "Removed", value: "removed" }
];

export default function ModeratorPostsPage() {
    const [posts, setPosts] = useState<ModPost[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [page, setPage] = useState(1);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getModPosts(
                page,
                20,
                filter || undefined
            );
            setPosts(result.posts);
            setPagination(result.pagination);
        } finally {
            setLoading(false);
        }
    }, [page, filter]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        setPage(1);
    }, [filter]);

    const handleRemove = async (postId: string) => {
        setActionLoading(postId);
        try {
            await removePost(postId);
            await fetchPosts();
        } catch (err: any) {
            alert(err?.response?.data?.message || "Action failed");
        } finally {
            setActionLoading(null);
        }
    };

    const handleRestore = async (postId: string) => {
        setActionLoading(postId);
        try {
            await restorePost(postId);
            await fetchPosts();
        } catch (err: any) {
            alert(err?.response?.data?.message || "Action failed");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Posts Moderation</h1>
                <p className="text-muted-foreground">
                    Review and moderate user posts
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

            {/* Posts List */}
            <div className="space-y-3">
                {loading
                    ? Array.from({ length: 5 }).map((_, i) => (
                          <Card key={i}>
                              <CardContent className="py-4">
                                  <div className="flex items-start gap-4">
                                      <Skeleton className="w-10 h-10 rounded-full" />
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
                    : posts.map((post) => (
                          <Card
                              key={post.post_id}
                              className={cn(
                                  post.is_removed_by_moderator &&
                                      "opacity-60 border-red-500/30"
                              )}
                          >
                              <CardContent className="py-4">
                                  <div className="flex items-start gap-4">
                                      {/* Author Avatar */}
                                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                                          {post.author?.avatar_url ? (
                                              <img
                                                  src={post.author.avatar_url}
                                                  alt={
                                                      post.author.full_name
                                                  }
                                                  className="w-full h-full object-cover"
                                              />
                                          ) : (
                                              <Users className="w-4 h-4 text-primary" />
                                          )}
                                      </div>

                                      {/* Post Info */}
                                      <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 flex-wrap mb-1">
                                              <span className="font-semibold text-sm">
                                                  {post.author?.full_name ||
                                                      "Unknown"}
                                              </span>
                                              <span className="text-xs text-muted-foreground">
                                                  @
                                                  {post.author?.username ||
                                                      "unknown"}
                                              </span>
                                              {post.is_removed_by_moderator && (
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
                                                  {post.visibility}
                                              </Badge>
                                          </div>
                                          <p className="text-sm line-clamp-2 mb-2">
                                              {post.caption || (
                                                  <span className="text-muted-foreground italic">
                                                      No caption
                                                  </span>
                                              )}
                                          </p>
                                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                              <span className="flex items-center gap-1">
                                                  <Heart className="w-3 h-3" />
                                                  {post.likes_count}
                                              </span>
                                              <span className="flex items-center gap-1">
                                                  <MessageSquare className="w-3 h-3" />
                                                  {post.comments_count}
                                              </span>
                                              <span>
                                                  {new Date(
                                                      post.created_at
                                                  ).toLocaleDateString()}
                                              </span>
                                          </div>
                                          {post.hashtags.length > 0 && (
                                              <div className="flex gap-1 flex-wrap mt-1.5">
                                                  {post.hashtags.map((tag) => (
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
                                      <div className="shrink-0">
                                          {post.is_removed_by_moderator ? (
                                              <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() =>
                                                      handleRestore(
                                                          post.post_id
                                                      )
                                                  }
                                                  disabled={
                                                      actionLoading ===
                                                      post.post_id
                                                  }
                                              >
                                                  {actionLoading ===
                                                  post.post_id ? (
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
                                                          post.post_id
                                                      )
                                                  }
                                                  disabled={
                                                      actionLoading ===
                                                      post.post_id
                                                  }
                                              >
                                                  {actionLoading ===
                                                  post.post_id ? (
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

                {!loading && posts.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No posts found</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-muted-foreground">
                        Page {pagination.current_page} of{" "}
                        {pagination.total_pages} ({pagination.total_count}{" "}
                        posts)
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
