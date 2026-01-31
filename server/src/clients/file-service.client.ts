import axios from "axios";
import FormData from "form-data";
import config from "../config/env";

class FileServiceClient {
    private baseUrl = config.file_service_url;
    private internalApiKey = config.file_service_internal_api_key;

    async uploadSingleImage(buffer: Buffer): Promise<{ image_key: string,image_id:string }> {
        const form = new FormData();
        form.append("file", buffer, "upload");

        try {
            const res = await axios.post(
                `${this.baseUrl}/images/upload-single-image`,
                form,
                {
                    headers: {
                        ...form.getHeaders(),
                        "x-internal-api-key": this.internalApiKey
                    }
                }
            );

            console.log(res);
            return res.data;
        } catch (error: any) {
            throw new Error(
                "Failed to upload image to file service: " + error.message
            );
        }
    }
}

export const fileServiceClient = new FileServiceClient();
