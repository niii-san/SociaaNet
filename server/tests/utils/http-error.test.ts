import { HttpError, errorMiddleware } from "../../src/utils/HttpError";
import { Request, Response, NextFunction } from "express";

describe("HttpError", () => {
    it("should create an HttpError with correct properties", () => {
        const error = new HttpError(404, false, "ERR_NOT_FOUND", "Not found");
        expect(error.status_code).toBe(404);
        expect(error.success).toBe(false);
        expect(error.message).toBe("Not found");
        expect(error.error.code).toBe("ERR_NOT_FOUND");
    });

    it("should serialize correctly via toJSON()", () => {
        const error = new HttpError(422, false, "ERR_INVALID_INPUT", "Validation failed");
        const json = error.toJSON();
        expect(json).toEqual({
            status_code: 422,
            success: false,
            message: "Validation failed",
            error: { code: "ERR_INVALID_INPUT" }
        });
    });
});

describe("errorMiddleware", () => {
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        mockNext = jest.fn();
    });

    it("should handle HttpError instances and set correct status", () => {
        const httpError = new HttpError(404, false, "ERR_NOT_FOUND", "Not found");
        errorMiddleware(httpError as any, {} as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith(httpError.toJSON());
    });
});
