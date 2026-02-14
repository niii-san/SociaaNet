
export class AllowMentionsFromDto {
    userId: string;
    allowMentionsFrom: string

    constructor(userId: string, allowMentionsFrom: string) {
        this.userId = userId;
        this.allowMentionsFrom = allowMentionsFrom;
    }
}
