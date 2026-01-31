class HttpSuccess {
    status_code: number = 200;
    success: boolean = true;
    message: string = "Desired action success!";
    data: any = {};

    constructor(
        success: boolean,
        status_code: number,
        message: string,
        data: any
    ) {
        this.success = success;
        this.status_code = status_code;
        this.message = message;
        this.data = data;
    }
}

export default HttpSuccess;
