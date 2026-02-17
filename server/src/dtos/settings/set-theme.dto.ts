export class SetThemeDto {
    userId: string;
    theme: string;

    constructor(userId: string, theme: string) {
        this.userId = userId;
        this.theme = theme;
    }
}
