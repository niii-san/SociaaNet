export const UserFieldRequirements = {
    fullName: {
        minLength: 3,
        maxLength: 30,
        minErrorMessage: "Full name must be at least 3 characters long",
        maxErrorMessage: "Full name must be less than 30 characters",
    },
    username: {
        minLength: 3,
        maxLength: 20,
        regex: /^[a-zA-Z0-9_]+$/,
        minErrorMessage: "Username must be at least 3 characters long",
        maxErrorMessage: "Username must be less than 20 characters"
    },
    password: {
        minLength: 8,
        maxLength: 30,
        regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        minErrorMessage: "Password must be at least 8 characters long",
        maxErrorMessage: `Password must be 30 characters or less`
    },
    bio: {
        maxLength: 160,
        minLength: 0,
        maxErrorMessage: "Bio must be less than 160 characters",
        minErrorMessage: "Bio must be at least 0 characters long"
    }
};
