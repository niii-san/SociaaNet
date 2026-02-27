import { env } from "../config";

export const convertThumbnailKeytoThumbnailUrl = (
    thumbnailUrl: string
): string => {
    const baseUrl = env.base_url;
    const url = `${baseUrl}/api/v1/files/thumbnail/${thumbnailUrl}`;
    return url;
};
