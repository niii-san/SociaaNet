import { env } from "../config";

export const convertVideoKeyToVideoUrl = (videoKey: string): string => {
    const baseUrl = env.base_url;
    const url = `${baseUrl}/api/v1/files/videos/${videoKey}`;
    return url;
};

