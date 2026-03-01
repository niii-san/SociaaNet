import { Skeleton } from "@/components/ui/skeleton";

export function ExploreGridSkeleton() {
    // Mimics the masonry grid layout (grid-cols-2 md:grid-cols-3)
    // Every 7th item is "large" (row-span-2 col-span-2 on md)
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 auto-rows-auto">
            {Array.from({ length: 12 }).map((_, i) => {
                const isLarge = i % 7 === 0;
                return (
                    <Skeleton
                        key={i}
                        className={`rounded-lg ${
                            isLarge
                                ? "aspect-square md:col-span-2 md:row-span-2"
                                : "aspect-square"
                        }`}
                    />
                );
            })}
        </div>
    );
}
