import { CreateUserDto } from "../dtos";
import { User } from "../models";
import { ApiErrorResponse } from "../utils";

class UserService {
  async createUser(data: CreateUserDto) {
    // TODO: hash password

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

    // TODO: create unique username
    const uniqueUsername = data.fullName;

    const user = await User.create({
      full_name: data.fullName,
      username: uniqueUsername,
      email_address: data.emailAddress,
      password: data.password
    });

    const { password, __v, updated_at, ...filteredUser } = user.toObject();

    return filteredUser;
  }
}

export default new UserService();
