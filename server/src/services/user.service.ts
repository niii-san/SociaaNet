import { User } from "../models";

class UserService {
    async createUser(data: {
        fullName: string;
        emailAddress: string;
        password: string;
    }) {
        try {
            // TODO: hash password
            // TODO: filter sensitive fields
            const user = await User.create({
                full_name: data.fullName,
                email_address: data.emailAddress,
                password: data.password
            });

            return user;
        } catch (error: any) {
            throw Error("UserService.createUser Error");
        }
    }
}

export default new UserService();
