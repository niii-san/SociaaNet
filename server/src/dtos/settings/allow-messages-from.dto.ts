export class AllowMessagesFromDto {
    userId: string;
    allowMessagesFrom: string;

    constructor(userId: string, allowMessagesFrom: string) {
        this.userId = userId;
        this.allowMessagesFrom = allowMessagesFrom;
    }
}
