import { Skeleton } from "@/components/ui/skeleton";

export function ProfileHeaderSkeleton() {
    return (
        <div className="px-4 py-6">
            {/* Avatar + Stats row */}
            <div className="flex items-start gap-6 mb-4">
                <Skeleton className="w-20 h-20 rounded-full shrink-0" />
                <div className="flex-1">
                    {/* Username */}
                    <Skeleton className="h-5 w-32 mb-2" />
                    {/* Stats: posts, followers, following */}
                    <div className="flex gap-6 mt-3">
                        <div className="text-center space-y-1">
                            <Skeleton className="h-5 w-8 mx-auto" />
                            <Skeleton className="h-2.5 w-10" />
                        </div>
                        <div className="text-center space-y-1">
                            <Skeleton className="h-5 w-8 mx-auto" />
                            <Skeleton className="h-2.5 w-14" />
                        </div>
                        <div className="text-center space-y-1">
                            <Skeleton className="h-5 w-8 mx-auto" />
                            <Skeleton className="h-2.5 w-14" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Full name */}
            <Skeleton className="h-4 w-36 mb-1" />
            {/* Bio */}
            <Skeleton className="h-3 w-48 mb-1" />
            <Skeleton className="h-3 w-32 mb-3" />

            {/* Action buttons */}
            <div className="flex gap-2">
                <Skeleton className="h-9 w-28 rounded-md" />
                <Skeleton className="h-9 w-28 rounded-md" />
            </div>
        </div>
    );
}

export function ProfileGridSkeleton() {
    return (
        <div className="grid grid-cols-3 gap-0.5 px-0.5">
            {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-none" />
            ))}
        </div>
    );
}

export function ProfilePageSkeleton() {
    return (
        <div>
            <ProfileHeaderSkeleton />
            {/* Tabs */}
            <div className="flex border-b border-border mb-2">
                <Skeleton className="h-10 flex-1 rounded-none" />
                <Skeleton className="h-10 flex-1 rounded-none" />
                <Skeleton className="h-10 flex-1 rounded-none" />
            </div>
            <ProfileGridSkeleton />
        </div>
    );
}
