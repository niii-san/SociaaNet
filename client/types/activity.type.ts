export interface Activity {
    activity_id: string;
    verb: string;
    actor: {
        user_id: string;
    };
    target: {
        user_id?: string;
    };
    metadata: Record<string, any>;
    created_at: string;
}

export interface ActivitiesResponse {
    data: Activity[];
}
