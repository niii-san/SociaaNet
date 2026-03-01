"use client";

import React, { useEffect, useState } from "react";
import { getDashboardStats, ModDashboardStats } from "@/features/moderator/moderator.api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Users,
    UserX,
    Shield,
    FileText,
    Trash2,
    Film,
    MessageSquare,
    Flag,
    AlertTriangle
} from "lucide-react";

const statCards = [
    { key: "total_users", label: "Total Users", icon: Users, color: "text-blue-500" },
    { key: "active_users", label: "Active Users", icon: Users, color: "text-green-500" },
    { key: "disabled_users", label: "Disabled Users", icon: UserX, color: "text-red-500" },
    { key: "moderators", label: "Moderators", icon: Shield, color: "text-purple-500" },
    { key: "total_posts", label: "Total Posts", icon: FileText, color: "text-blue-500" },
    { key: "removed_posts", label: "Removed Posts", icon: Trash2, color: "text-red-500" },
    { key: "total_reels", label: "Total Reels", icon: Film, color: "text-cyan-500" },
    { key: "removed_reels", label: "Removed Reels", icon: Trash2, color: "text-red-500" },
    { key: "total_comments", label: "Total Comments", icon: MessageSquare, color: "text-indigo-500" },
    { key: "pending_reports", label: "Pending Reports", icon: AlertTriangle, color: "text-amber-500" },
    { key: "total_reports", label: "Total Reports", icon: Flag, color: "text-orange-500" },
] as const;

export default function ModeratorDashboardPage() {
    const [stats, setStats] = useState<ModDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardStats()
            .then(setStats)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of platform moderation stats
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {loading
                    ? Array.from({ length: 11 }).map((_, i) => (
                          <Card key={i}>
                              <CardContent className="p-4 space-y-2">
                                  <Skeleton className="h-4 w-20" />
                                  <Skeleton className="h-8 w-16" />
                              </CardContent>
                          </Card>
                      ))
                    : statCards.map((card) => {
                          const Icon = card.icon;
                          const value = stats
                              ? stats[card.key as keyof ModDashboardStats]
                              : 0;
                          return (
                              <Card key={card.key}>
                                  <CardContent className="p-4">
                                      <div className="flex items-center gap-2 mb-2">
                                          <Icon
                                              className={`w-4 h-4 ${card.color}`}
                                          />
                                          <span className="text-xs text-muted-foreground">
                                              {card.label}
                                          </span>
                                      </div>
                                      <p className="text-2xl font-bold">
                                          {value?.toLocaleString() ?? 0}
                                      </p>
                                  </CardContent>
                              </Card>
                          );
                      })}
            </div>
        </div>
    );
}
