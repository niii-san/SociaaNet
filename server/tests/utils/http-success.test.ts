import { HttpSuccess } from "../../src/utils/HttpSuccess";

describe("HttpSuccess", () => {
    it("should create a success response with correct properties", () => {
        const success = new HttpSuccess(200, true, "OK", { id: 1 });
        expect(success.status_code).toBe(200);
        expect(success.success).toBe(true);
        expect(success.message).toBe("OK");
        expect(success.data).toEqual({ id: 1 });
    });

    it("should handle null data", () => {
        const success = new HttpSuccess(200, true, "No data", null);
        expect(success.data).toBeNull();
    });

    it("should merge additional properties from others param", () => {
        const success = new HttpSuccess(200, true, "OK", [], {
            total: 100,
            page: 1
        });
        expect((success as any).total).toBe(100);
        expect((success as any).page).toBe(1);
    });
});
