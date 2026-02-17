export class SetShowSensitiveContentDto {
    userId: string;
    showSensitiveContent: boolean;

    constructor(userId: string, showSensitiveContent: boolean) {
        this.userId = userId;
        this.showSensitiveContent = showSensitiveContent;
    }
}
