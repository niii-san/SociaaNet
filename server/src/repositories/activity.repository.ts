import { ActivityDocument, Activity } from "../models";

interface IActivityRepository {
    createActivity(
        activityData: Partial<ActivityDocument>
    ): Promise<ActivityDocument>;
}

class ActivityRepository implements IActivityRepository {
    async createActivity(
        activityData: Partial<ActivityDocument>
    ): Promise<ActivityDocument> {
        const activity = await Activity.create({
            verb: activityData.verb,
            actor: activityData.actor,
            target: activityData.target,
            metadata: activityData.metadata,
            visibility: activityData.visibility
        });

        return activity;
    }
}

export const activityRepo = new ActivityRepository();
