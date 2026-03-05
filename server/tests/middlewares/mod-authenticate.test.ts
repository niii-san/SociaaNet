import { moderatorAuthenticate } from "../../src/middlewares/mod-authenticate.middleware";
import { Response, NextFunction } from "express";
import { RequestWithUserContext } from "../../src/types";

describe("moderatorAuthenticate middleware", () => {
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        mockNext = jest.fn();
    });

    it("should call next() for moderator role", async () => {
        const req = {
            user: { role: "moderator" }
        } as unknown as RequestWithUserContext;

        // moderatorAuthenticate returns an asyncHandler wrapper
        await (moderatorAuthenticate as any)(req, mockRes as Response, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it("should pass error to next for regular user role", async () => {
        const req = {
            user: { role: "user" }
        } as unknown as RequestWithUserContext;

        await (moderatorAuthenticate as any)(req, mockRes as Response, mockNext);
        // asyncHandler catches the HttpError and passes it to next
        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
                status_code: 403
            })
        );
    });
});
