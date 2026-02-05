export class HttpSuccess {
    status_code: number = 200;
    success: boolean = true;
    message: string = "Fetched successfully!";
    data: any = {};

    constructor(
        status_code: number,
        success: boolean,
        message: string,
        data: any
    ) {
        this.status_code = status_code;
        this.success = success;
        this.message = message;
        this.data = data;
    }
}
