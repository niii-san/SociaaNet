export class UpdateFeedModeDto {
    userId: string;
    mode: string;

    constructor(userId: string, mode: string) {
        this.userId = userId;
        this.mode = mode;
    }
}
