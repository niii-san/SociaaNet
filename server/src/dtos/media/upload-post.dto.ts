export class UploadPostDto {
    userId: string;
    files: Express.Multer.File[];
    caption: string;
    visibility: "public" | "private" | "followers";

    constructor(params: {
        userId: string;
        files: Express.Multer.File[];
        caption?: string;
        visibility?: "public" | "private" | "followers";
    }) {
        this.userId = params.userId;
        this.files = params.files;
        this.caption = params.caption || "";
        this.visibility = params.visibility || "public";
    }
}
