import { asyncHandler } from "../../src/utils/async-handler";
import { Request, Response, NextFunction } from "express";

describe("asyncHandler", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {};
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        mockNext = jest.fn();
    });

    it("should call the wrapped function", async () => {
        const fn = jest.fn().mockResolvedValue(undefined);
        const handler = asyncHandler(fn);
        await handler(mockReq as Request, mockRes as Response, mockNext);
        expect(fn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    });

    it("should call next with error when async function throws", async () => {
        const error = new Error("Async failure");
        const fn = jest.fn().mockRejectedValue(error);
        const handler = asyncHandler(fn);
        await handler(mockReq as Request, mockRes as Response, mockNext);
        expect(mockNext).toHaveBeenCalledWith(error);
    });
});
