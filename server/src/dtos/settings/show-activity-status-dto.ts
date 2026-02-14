export class ShowActivityStatusDto {
    user_id: string;
    show_activity_status: boolean;

    constructor(user_id: string, show_activity_status: boolean) {
        this.user_id = user_id;
        this.show_activity_status = show_activity_status;
    }
}
