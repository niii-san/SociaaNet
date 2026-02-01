import { signupController } from "./auth/signup.controller";
import { loginController } from "./auth/login.controller";
import { validateSessionController } from "./auth/validate_session.controller";
import { uploadAvatarController } from "./users/upload-avatar.controller";
import { getImageController } from "./files/get-image.controller";
import { getProfileByUsernameController } from "./users/get-profile-by-username.controller";

export {
    signupController,
    loginController,
    validateSessionController,
    uploadAvatarController,
    getImageController,
    getProfileByUsernameController
};
