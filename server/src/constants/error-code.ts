export const ErrorCodes = {
    INVALID_INPUT: "ERR_INVALID_INPUT", // If input is not given or is not valid  or does not meet certain criteria
    NOT_FOUND: "ERR_NOT_FOUND", // When a requested resource is not found
    FORBIDDEN: "ERR_FORBIDDEN", // When the user does not have permission to access a resource
    DUPLICATE: "ERR_DUPLICATE", // When a resource already exists and cannot be created again
    UNAUTHORIZED: "ERR_UNAUTHORIZED", // When authentication is required and has failed or has not yet been provided
    SERVER_ERROR: "ERR_SERVER_ERROR", // General error for server issues
    TIMEOUT: "ERR_TIMEOUT" // When a request times out
};
