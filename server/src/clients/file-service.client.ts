import axios, { AxiosInstance } from "axios";
import FormData from "form-data";
import { env } from "../config";

type UploadMultipleImagesResponse = {
    data: {
        images: {
            image_key: string;
            image_id: string;
        }[];
    };
};

class FileServiceClient {
    private baseUrl = env.file_service_url;
    private internalApiKey = env.file_service_internal_api_key;

    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: this.baseUrl,
            timeout: 10_000,
            headers: {
                "x-internal-api-key": this.internalApiKey
            }
        });
    }

    async uploadSingleImage(
        buffer: Buffer
    ): Promise<{ data: { image_key: string; image_id: string } }> {
        const form = new FormData();

        form.append("image", buffer, {
            filename: "upload.png",
            contentType: "image/png"
        });

        try {
            const res = await this.client.post(
                "/images/upload-single-image",
                form,
                {
                    headers: {
                        ...form.getHeaders(),
                        "x-internal-api-key": this.internalApiKey
                    }
                }
            );

            return res.data;
        } catch (error: any) {
            throw new Error(
                "Failed to upload image to file service: " + error.message
            );
        }
    }

    async uploadMultipleImages(
        buffers: Buffer[]
    ): Promise<UploadMultipleImagesResponse> {
        const form = new FormData();

        buffers.forEach((buffer, index) => {
            form.append("images", buffer, {
                filename: `upload${index}.png`,
                contentType: "image/png"
            });
        });

        try {
            const res = await this.client.post(
                "/images/upload-multiple-images",
                form,
                {
                    headers: {
                        ...form.getHeaders(),
                        "x-internal-api-key": this.internalApiKey
                    }
                }
            );

            return res.data;
        } catch (error) {
            console.log(error);
            throw new Error(
                "Failed to upload images to file service: " +
                    (error as Error).message
            );
        }
    }

    getImageStream(imageKey: string) {
        return this.client.get(`/images/${imageKey}`, {
            responseType: "stream"
        });
    }

    async uploadVideo(
        buffer: Buffer,
        originalName: string
    ): Promise<{
        data: {
            video_key: string;
            video_id: string;
            thumbnail_key: string;
            duration: number;
        };
    }> {
        const form = new FormData();

        // Extract extension safely
        const extension = originalName.includes(".")
            ? originalName.substring(originalName.lastIndexOf("."))
            : "";

        const filename = `upload${extension}`;

        form.append("video", buffer, {
            filename,
            contentType: "video/" + extension.replace(".", "") || "video/mp4"
        });

        const res = await this.client.post("/videos", form, {
            headers: {
                ...form.getHeaders(),
                "x-internal-api-key": this.internalApiKey
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });

        return res.data;
    }

    getVideoStream(videoKey: string) {
        return this.client.get(`/videos/${videoKey}`, {
            responseType: "stream"
        }); 
    }



}

export const fileServiceClient = new FileServiceClient();
