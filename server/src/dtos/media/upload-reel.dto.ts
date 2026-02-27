export class UploadReelDto {
    userId: string;
    file: Express.Multer.File | null;
    caption: string;
    visibility: "public" | "private" | "followers";

    constructor(params: {
        userId: string;
        file: Express.Multer.File | null;
        caption: string;
        visibility: "public" | "private" | "followers";
    }) {
        this.userId = params.userId;
        this.file = params.file;
        this.caption = params.caption;
        this.visibility = params.visibility;
    }
}
