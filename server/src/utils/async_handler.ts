import type { Request, Response, NextFunction } from "express";

function asyncHandler(fn: any) {
    return function(req: Request, res: Response, next: NextFunction) {
        Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    };
}

export default asyncHandler;
