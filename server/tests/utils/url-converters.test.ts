import { convertImageKeyToImageUrl } from "../../src/utils/convert-imagekey-imageurl";
import { convertThumbnailKeytoThumbnailUrl } from "../../src/utils/convert-thumbnailkey-thumbnailurl";
import { convertVideoKeyToVideoUrl } from "../../src/utils/convert-videokey-videourl";

describe("URL conversion utilities", () => {
    const BASE_URL = process.env.BASE_URL!; // set in setup-env.ts

    describe("convertImageKeyToImageUrl", () => {
        it("should construct correct image URL from key", () => {
            const url = convertImageKeyToImageUrl("abc123.jpg");
            expect(url).toBe(`${BASE_URL}/api/v1/files/images/abc123.jpg`);
        });
    });

    describe("convertThumbnailKeytoThumbnailUrl", () => {
        it("should construct correct thumbnail URL from key", () => {
            const url = convertThumbnailKeytoThumbnailUrl("thumb123.jpg");
            expect(url).toBe(`${BASE_URL}/api/v1/files/thumbnails/thumb123.jpg`);
        });
    });

    describe("convertVideoKeyToVideoUrl", () => {
        it("should construct correct video URL from key", () => {
            const url = convertVideoKeyToVideoUrl("video456.mp4");
            expect(url).toBe(`${BASE_URL}/api/v1/files/videos/video456.mp4`);
        });
    });
});
