class ApiErrorResponse {
    status_code: number = 400;
    success: boolean = false;
    message: string = "Something went wrong!";
    error: { code: string } = {
        code: "SERVER_ERROR"
    };

    constructor(
        status_code: number,
        success: boolean,
        code: string,
        message: string
    ) {
        this.status_code = status_code;
        this.success = success;
        this.error = {
            code
        };
        this.message = message;
    }
}

export default ApiErrorResponse;
