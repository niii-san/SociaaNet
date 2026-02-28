import { SavedItem, SavedItemDocument } from "../models/saved-item.model";

class SavedItemsRepository {
    async saveItem(
        userId: string,
        targetId: string,
        targetType: "post" | "reel"
    ): Promise<SavedItemDocument> {
        const saved = await SavedItem.create({
            user: userId,
            target_id: targetId,
            target_type: targetType
        });
        return saved;
    }

    async unsaveItem(
        userId: string,
        targetId: string,
        targetType: "post" | "reel"
    ): Promise<boolean> {
        const result = await SavedItem.findOneAndDelete({
            user: userId,
            target_id: targetId,
            target_type: targetType
        });
        return !!result;
    }

    async isSavedByUser(
        userId: string,
        targetId: string,
        targetType: "post" | "reel"
    ): Promise<boolean> {
        const item = await SavedItem.exists({
            user: userId,
            target_id: targetId,
            target_type: targetType
        });
        return !!item;
    }

    async getSavedByUser(
        userId: string,
        page: number = 1,
        limit: number = 20
    ): Promise<{ items: SavedItemDocument[]; total: number }> {
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            SavedItem.find({ user: userId })
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit),
            SavedItem.countDocuments({ user: userId })
        ]);

        return { items, total };
    }
}

export const savedItemsRepo = new SavedItemsRepository();
