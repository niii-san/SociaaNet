import { CreateUserDto } from "../../dtos";
import { authService } from "../../services";
import { HttpSuccess, asyncHandler } from "../../utils";
import type { Request, Response } from "express";

export const signupController = asyncHandler(
    async (req: Request, res: Response) => {
        const dto = new CreateUserDto(req.body);
        const user = await authService.createUser(dto);

        return res
            .status(201)
            .json(new HttpSuccess(201, true, "User created", user));
    }
);
