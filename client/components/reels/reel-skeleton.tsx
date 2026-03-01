import { Skeleton } from "@/components/ui/skeleton";

export function ReelViewerSkeleton() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="relative w-full max-w-md mx-auto">
                {/* Video placeholder */}
                <Skeleton className="w-full aspect-9/16 max-h-screen rounded-none bg-white/10" />

                {/* Right-side action buttons skeleton */}
                <div className="absolute right-3 bottom-24 flex flex-col gap-5 items-center">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="w-10 h-10 rounded-full bg-white/10" />
                    ))}
                </div>

                {/* Bottom info skeleton */}
                <div className="absolute bottom-6 left-4 right-16 space-y-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-8 h-8 rounded-full bg-white/10" />
                        <Skeleton className="h-3 w-24 bg-white/10" />
                    </div>
                    <Skeleton className="h-3 w-48 bg-white/10" />
                    <Skeleton className="h-3 w-32 bg-white/10" />
                </div>
            </div>
        </div>
    );
}
