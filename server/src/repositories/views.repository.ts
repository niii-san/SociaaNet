import mongoose from "mongoose";
import {
    WatchHistory,
    WatchHistoryDocument
} from "../models/watch-history.model";
import { Reel } from "../models/reel.model";

interface IViewsRepository {
    recordView(
        userId: string,
        targetId: string,
        targetType: "post" | "reel"
    ): Promise<{ created: boolean; view: WatchHistoryDocument }>;
    hasViewed(
        userId: string,
        targetId: string,
        targetType: "post" | "reel"
    ): Promise<boolean>;
}

class ViewsRepository implements IViewsRepository {
    /**
     * Records a unique view. If the user has already viewed this target,
     * returns the existing record with created=false.
     * For reels, atomically increments views_count only on first view.
     */
    async recordView(
        userId: string,
        targetId: string,
        targetType: "post" | "reel"
    ): Promise<{ created: boolean; view: WatchHistoryDocument }> {
        const session = await mongoose.startSession();

        try {
            let created = false;
            let view: WatchHistoryDocument;

            await session.withTransaction(async () => {
                // Try to find existing view
                const existing = await WatchHistory.findOne(
                    {
                        user: userId,
                        target_id: targetId,
                        target_type: targetType
                    },
                    null,
                    { session }
                );

                if (existing) {
                    view = existing;
                    created = false;
                    return;
                }

                // Create new view record
                const [newView] = await WatchHistory.create(
                    [
                        {
                            user: userId,
                            target_id: targetId,
                            target_type: targetType
                        }
                    ],
                    { session }
                );

                // For reels, increment the views_count
                if (targetType === "reel") {
                    await Reel.findByIdAndUpdate(
                        targetId,
                        { $inc: { views_count: 1 } },
                        { session }
                    );
                }

                view = newView;
                created = true;
            });

            return { created: created, view: view! };
        } finally {
            await session.endSession();
        }
    }

    async hasViewed(
        userId: string,
        targetId: string,
        targetType: "post" | "reel"
    ): Promise<boolean> {
        const exists = await WatchHistory.exists({
            user: userId,
            target_id: targetId,
            target_type: targetType
        });

        return !!exists;
    }
}

export const viewsRepo = new ViewsRepository();
