export class UploadAvatarDto {
    user_id: string;

    constructor(params: any) {
        this.user_id = params.user_id;
    }
}
