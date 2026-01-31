import axios, { AxiosInstance } from "axios";
import FormData from "form-data";
import { env } from "../config";

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

    getImageStream(imageKey: string) {
        return this.client.get(`/images/${imageKey}`, {
            responseType: "stream"
        });
    }
}

export const fileServiceClient = new FileServiceClient();
