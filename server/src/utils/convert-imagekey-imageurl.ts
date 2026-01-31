import { env } from "../config";

export const convertImageKeyToImageUrl = (imageKey: string): string => {
    const baseUrl = env.base_url;
    const url = `${baseUrl}/api/v1/files/images/${imageKey}`;
    return url;
};
