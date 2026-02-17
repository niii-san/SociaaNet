
export class SetFollowsNotificationDto {
    userId: string;
    value: boolean;

    constructor(userId: string, value: boolean) {
        this.userId = userId;
        this.value = value;
    }
}
