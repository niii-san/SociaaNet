import { generateUniqueUsername } from "../../src/utils/generate-unique-username";

describe("generateUniqueUsername", () => {
    it("should return a lowercase string", async () => {
        const result = await generateUniqueUsername("John Doe");
        expect(result).toBe(result.toLowerCase());
    });

    it("should handle single name", async () => {
        const result = await generateUniqueUsername("Alice");
        expect(result).toBe("alice");
    });
});
