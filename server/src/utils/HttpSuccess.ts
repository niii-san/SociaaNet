export class HttpSuccess {
    status_code: number = 200;
    success: boolean = true;
    message: string = "Fetched successfully!";
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

