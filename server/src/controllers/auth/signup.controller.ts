import { CreateUserDto } from "../../dtos";
import { usersService } from "../../services";
import { HttpSuccess, asyncHandler } from "../../utils";
import type { Request, Response } from "express";

export const signupController = asyncHandler(async (req: Request, res: Response) => {
    const dto = new CreateUserDto(req.body);
    const user = await usersService.createUser(dto);

    return res
        .status(201)
        .json(new HttpSuccess(true, 201, "User created", user));
});

