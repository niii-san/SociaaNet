export class GetUserProfileDto {
    targetProfileUsername: string;
    currentUserId: string;

    constructor(targetProfileUsername: string, currentUserId: string) {
        this.targetProfileUsername = targetProfileUsername;
        this.currentUserId = currentUserId;
    }
}
