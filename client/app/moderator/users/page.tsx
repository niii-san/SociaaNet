"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
    getModUsers,
    disableUser,
    enableUser,
    ModUser,
    Pagination
} from "@/features/moderator/moderator.api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Search,
    UserX,
    UserCheck,
    ChevronLeft,
    ChevronRight,
    Users,
    Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

const filters = [
    { label: "All", value: "" },
    { label: "Active", value: "active" },
    { label: "Disabled", value: "disabled" },
    { label: "Moderators", value: "moderator" }
];

export default function ModeratorUsersPage() {
    const [users, setUsers] = useState<ModUser[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [page, setPage] = useState(1);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getModUsers(
                page,
                20,
                search || undefined,
                filter || undefined
            );
            setUsers(result.users);
            setPagination(result.pagination);
        } finally {
            setLoading(false);
        }
    }, [page, search, filter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        setPage(1);
    }, [search, filter]);

    const handleToggleDisable = async (user: ModUser) => {
        setActionLoading(user.user_id);
        try {
            if (user.is_disabled) {
                await enableUser(user.user_id);
            } else {
                await disableUser(user.user_id);
            }
            await fetchUsers();
        } catch (err: any) {
            alert(err?.response?.data?.message || "Action failed");
        } finally {
            setActionLoading(null);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">User Management</h1>
                <p className="text-muted-foreground">
                    Manage and moderate user accounts
                </p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <form
                    onSubmit={handleSearchSubmit}
                    className="flex-1 flex gap-2"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by username, name, or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </form>

                <div className="flex gap-1.5 flex-wrap">
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
            </div>

            {/* Users List */}
            <div className="space-y-3">
                {loading
                    ? Array.from({ length: 5 }).map((_, i) => (
                          <Card key={i}>
                              <CardContent className="flex items-center gap-4 py-4">
                                  <Skeleton className="w-12 h-12 rounded-full" />
                                  <div className="flex-1 space-y-2">
                                      <Skeleton className="h-4 w-32" />
                                      <Skeleton className="h-3 w-48" />
                                  </div>
                                  <Skeleton className="h-8 w-20" />
                              </CardContent>
                          </Card>
                      ))
                    : users.map((user) => (
                          <Card
                              key={user.user_id}
                              className={cn(
                                  user.is_disabled &&
                                      "opacity-60 border-red-500/30"
                              )}
                          >
                              <CardContent className="flex items-center gap-4 py-4">
                                  {/* Avatar */}
                                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                                      {user.avatar_url ? (
                                          <img
                                              src={user.avatar_url}
                                              alt={user.full_name}
                                              className="w-full h-full object-cover"
                                          />
                                      ) : (
                                          <Users className="w-5 h-5 text-primary" />
                                      )}
                                  </div>

                                  {/* User Info */}
                                  <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                          <p className="font-semibold text-sm truncate">
                                              {user.full_name}
                                          </p>
                                          {user.role !== "user" && (
                                              <Badge
                                                  variant="secondary"
                                                  className="text-xs capitalize"
                                              >
                                                  {user.role.replace("_", " ")}
                                              </Badge>
                                          )}
                                          {user.is_disabled && (
                                              <Badge
                                                  variant="destructive"
                                                  className="text-xs"
                                              >
                                                  Disabled
                                              </Badge>
                                          )}
                                          {user.is_private_account && (
                                              <Badge
                                                  variant="outline"
                                                  className="text-xs"
                                              >
                                                  Private
                                              </Badge>
                                          )}
                                      </div>
                                      <p className="text-xs text-muted-foreground truncate">
                                          @{user.username} · {user.email_address}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                          {user.followers_count} followers ·{" "}
                                          {user.following_count} following ·
                                          Joined{" "}
                                          {new Date(
                                              user.created_at
                                          ).toLocaleDateString()}
                                      </p>
                                  </div>

                                  {/* Actions */}
                                  {user.role === "user" && (
                                      <Button
                                          variant={
                                              user.is_disabled
                                                  ? "outline"
                                                  : "destructive"
                                          }
                                          size="sm"
                                          onClick={() =>
                                              handleToggleDisable(user)
                                          }
                                          disabled={
                                              actionLoading === user.user_id
                                          }
                                          className="shrink-0"
                                      >
                                          {actionLoading === user.user_id ? (
                                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                                          ) : user.is_disabled ? (
                                              <>
                                                  <UserCheck className="w-4 h-4 mr-1" />
                                                  <span className="hidden sm:inline">
                                                      Enable
                                                  </span>
                                              </>
                                          ) : (
                                              <>
                                                  <UserX className="w-4 h-4 mr-1" />
                                                  <span className="hidden sm:inline">
                                                      Disable
                                                  </span>
                                              </>
                                          )}
                                      </Button>
                                  )}
                              </CardContent>
                          </Card>
                      ))}

                {!loading && users.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No users found</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-muted-foreground">
                        Page {pagination.current_page} of{" "}
                        {pagination.total_pages} ({pagination.total_count}{" "}
                        users)
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
