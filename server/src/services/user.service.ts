import { genSalt, hash } from "bcryptjs";
import { CreateUserDto } from "../dtos";
import { User } from "../models";
import { ApiErrorResponse, generateUniqueUsername } from "../utils";

class UserService {
  async createUser(dto: CreateUserDto) {
    const fullName = dto.fullName.trim();
    const emailAddress = dto.emailAddress.trim();
    const _password = dto.password;

    const alreadyExists = await User.findOne({
      email_address: emailAddress
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
    const uniqueUsername = await generateUniqueUsername(fullName);

    const salt = await genSalt(5);
    const hashedPassword = await hash(_password, salt);

    const user = await User.create({
      full_name: fullName,
      username: uniqueUsername,
      email_address: emailAddress,
      password: hashedPassword
    });
    const { password, __v, updated_at, is_disabled, ...filteredUser } =
      user.toObject();

    return filteredUser;
  }
}

export default new UserService();
