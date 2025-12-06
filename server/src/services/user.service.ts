import { User } from "../models";
import { ApiErrorResponse } from "../utils";

class UserService {
    async createUser(data: {
        fullName: string;
        emailAddress: string;
        password: string;
    }) {
        // TODO: create random username
        // TODO: hash password
        // TODO: filter sensitive fields

        const alreadyExists = await User.findOne({
            email_address: data.emailAddress
        });

        if (alreadyExists) {
            throw new ApiErrorResponse(
                400,
                false,
                "ALR_EXIST",
                "Email is linked with another account"
            );
        }
        const user = await User.create({
            full_name: data.fullName,
            email_address: data.emailAddress,
            password: data.password
        });

        return user;
    }
}

export default new UserService();
