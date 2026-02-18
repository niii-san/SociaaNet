export class FollowUserDTO {
    followerId: string;
    followeeId: string;

    constructor(followerId: string, followeeId: string) {
        this.followerId = followerId;
        this.followeeId = followeeId;
    }
}
