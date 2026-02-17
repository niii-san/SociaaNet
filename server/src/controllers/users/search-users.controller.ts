import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { usersService } from "../../services";
import { SearchUsersDto } from "../../dtos";

export const searchUsersController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const query = req.query.query as string;
        const page = parseInt(req.query.page as string) || 1;

        const dto = new SearchUsersDto(query, page);
        const results = await usersService.searchUsers(dto);

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    `Showing search results for "${query}"`,
                    results.users,
                    results.pagination
                )
            );
    }
);
