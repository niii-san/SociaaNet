"use client";

import React, { useEffect, useState } from "react";
import {
    getDashboardStats,
    ModDashboardStats
} from "@/features/moderator/moderator.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Users,
    UserX,
    Shield,
    FileText,
    Film,
    MessageSquare,
    Trash2,
    UserCheck
} from "lucide-react";

export default function ModeratorDashboard() {
    const [stats, setStats] = useState<ModDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardStats()
            .then(setStats)
            .finally(() => setLoading(false));
    }, []);

    const statCards = stats
        ? [
              {
                  label: "Total Users",
                  value: stats.total_users,
                  icon: Users,
                  color: "text-blue-500"
              },
              {
                  label: "Active Users",
                  value: stats.active_users,
                  icon: UserCheck,
                  color: "text-green-500"
              },
              {
                  label: "Disabled Users",
                  value: stats.disabled_users,
                  icon: UserX,
                  color: "text-red-500"
              },
              {
                  label: "Moderators",
                  value: stats.moderators,
                  icon: Shield,
                  color: "text-purple-500"
              },
              {
                  label: "Total Posts",
                  value: stats.total_posts,
                  icon: FileText,
                  color: "text-blue-500"
              },
              {
                  label: "Removed Posts",
                  value: stats.removed_posts,
                  icon: Trash2,
                  color: "text-red-500"
              },
              {
                  label: "Total Reels",
                  value: stats.total_reels,
                  icon: Film,
                  color: "text-blue-500"
              },
              {
                  label: "Removed Reels",
                  value: stats.removed_reels,
                  icon: Trash2,
                  color: "text-red-500"
              },
              {
                  label: "Total Comments",
                  value: stats.total_comments,
                  icon: MessageSquare,
                  color: "text-blue-500"
              }
          ]
        : [];

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of platform activity
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading
                    ? Array.from({ length: 9 }).map((_, i) => (
                          <Card key={i}>
                              <CardHeader className="flex flex-row items-center justify-between pb-2">
                                  <Skeleton className="h-4 w-24" />
                                  <Skeleton className="h-5 w-5 rounded" />
                              </CardHeader>
                              <CardContent>
                                  <Skeleton className="h-8 w-16" />
                              </CardContent>
                          </Card>
                      ))
                    : statCards.map((stat) => (
                          <Card key={stat.label}>
                              <CardHeader className="flex flex-row items-center justify-between pb-2">
                                  <CardTitle className="text-sm font-medium text-muted-foreground">
                                      {stat.label}
                                  </CardTitle>
                                  <stat.icon
                                      className={`w-5 h-5 ${stat.color}`}
                                  />
                              </CardHeader>
                              <CardContent>
                                  <p className="text-3xl font-bold">
                                      {stat.value.toLocaleString()}
                                  </p>
                              </CardContent>
                          </Card>
                      ))}
            </div>
        </div>
    );
}
