import { ActivityDocument, Activity } from "../models";

interface IActivityRepository {
    createActivity(
        activityData: Partial<ActivityDocument>
    ): Promise<ActivityDocument>;
    getActivitiesByActor(actorId: string): Promise<ActivityDocument[]>;
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

    async getActivitiesByActor(actorId: string): Promise<ActivityDocument[]> {
        const activities = await Activity.find({ "actor.user_id": actorId })
            .sort({ created_at: -1 })
            .exec();

        return activities;
    }
}

export const activityRepo = new ActivityRepository();
