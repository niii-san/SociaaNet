
export class UnfollowUserDTO {
    followerId: string;
    followeeId: string;

    constructor(followerId: string, followeeId: string) {
        this.followerId = followerId;
        this.followeeId = followeeId;
    }
}
