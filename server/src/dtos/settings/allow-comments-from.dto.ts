
export class AllowCommentsFromDto {
    userId: string;
    allowCommentsFrom: string

    constructor(userId: string, allowCommentsFrom: string) {
        this.userId = userId;
        this.allowCommentsFrom = allowCommentsFrom;
    }
}
