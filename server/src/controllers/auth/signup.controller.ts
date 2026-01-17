import { CreateUserDto } from "../../dtos";
import { UserService } from "../../services";
import { ApiSuccessResponse, asyncHandler } from "../../utils";
import type { Request, Response } from "express";

const signupController = asyncHandler(async (req: Request, res: Response) => {
    const dto = new CreateUserDto(req.body);
    const user = await UserService.createUser(dto);

    return res
        .status(201)
        .json(new ApiSuccessResponse(true, 201, "User created", user));
});

export default signupController;
