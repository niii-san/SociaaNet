import { extractHashtags } from "../../src/utils/extract-hashtags";

describe("extractHashtags", () => {
    it("should extract multiple hashtags", () => {
        const result = extractHashtags("#hello #world #test");
        expect(result).toEqual(["hello", "world", "test"]);
    });

    it("should return empty array when no hashtags present", () => {
        expect(extractHashtags("Hello world")).toEqual([]);
        expect(extractHashtags("")).toEqual([]);
    });

    it("should extract hashtags with numbers and underscores", () => {
        const result = extractHashtags("#test123 #hello_world");
        expect(result).toEqual(["test123", "hello_world"]);
    });

    it("should not include the # symbol in results", () => {
        const result = extractHashtags("#myhashtag");
        expect(result).toEqual(["myhashtag"]);
        expect(result[0]).not.toContain("#");
    });
});
