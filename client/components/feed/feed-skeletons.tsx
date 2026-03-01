import { Skeleton } from "@/components/ui/skeleton";

export function PostCardSkeleton() {
    return (
        <div className="border-b border-border p-4">
            {/* Header: avatar + username + time */}
            <div className="flex items-center gap-3 mb-3">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-2.5 w-16" />
                </div>
                <Skeleton className="w-6 h-6 rounded-full" />
            </div>

            {/* Image area */}
            <Skeleton className="w-full aspect-square rounded-lg mb-3" />

            {/* Action buttons */}
            <div className="flex items-center gap-4 mb-2">
                <Skeleton className="w-6 h-6 rounded" />
                <Skeleton className="w-6 h-6 rounded" />
                <Skeleton className="w-6 h-6 rounded" />
                <div className="ml-auto">
                    <Skeleton className="w-6 h-6 rounded" />
                </div>
            </div>

            {/* Likes count */}
            <Skeleton className="h-3.5 w-20 mb-2" />

            {/* Caption lines */}
            <div className="space-y-1.5">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
            </div>
        </div>
    );
}

export function FeedReelCardSkeleton() {
    return (
        <div className="border-b border-border p-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-2.5 w-16" />
                </div>
            </div>

            {/* Video area */}
            <Skeleton className="w-full aspect-9/16 max-h-125 rounded-lg mb-3" />

            {/* Action buttons */}
            <div className="flex items-center gap-4 mb-2">
                <Skeleton className="w-6 h-6 rounded" />
                <Skeleton className="w-6 h-6 rounded" />
                <Skeleton className="w-6 h-6 rounded" />
                <div className="ml-auto">
                    <Skeleton className="w-6 h-6 rounded" />
                </div>
            </div>

            {/* Caption */}
            <Skeleton className="h-3 w-3/4" />
        </div>
    );
}

export function FeedSkeleton() {
    return (
        <div>
            {/* Suggested users bar skeleton */}
            <div className="border-b border-border p-4">
                <Skeleton className="h-3.5 w-32 mb-3" />
                <div className="flex gap-3 overflow-hidden">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center gap-1.5 min-w-25 w-25 shrink-0"
                        >
                            <Skeleton className="w-14 h-14 rounded-full" />
                            <Skeleton className="h-2.5 w-16" />
                            <Skeleton className="h-2 w-12" />
                            <Skeleton className="h-7 w-full rounded-md" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Post skeletons */}
            <PostCardSkeleton />
            <PostCardSkeleton />
            <FeedReelCardSkeleton />
            <PostCardSkeleton />
        </div>
    );
}

export function SuggestedUsersBarSkeleton() {
    return (
        <div className="border-b border-border bg-background">
            <div className="px-4 pt-3 pb-1">
                <Skeleton className="h-3.5 w-32" />
            </div>
            <div className="flex gap-3 overflow-hidden px-4 pb-3 pt-1">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex flex-col items-center gap-1.5 min-w-25 w-25 rounded-xl border border-border p-3 shrink-0"
                    >
                        <Skeleton className="w-14 h-14 rounded-full" />
                        <Skeleton className="h-2.5 w-16" />
                        <Skeleton className="h-2 w-12" />
                        <Skeleton className="h-7 w-full rounded-md mt-auto" />
                    </div>
                ))}
            </div>
        </div>
    );
}
