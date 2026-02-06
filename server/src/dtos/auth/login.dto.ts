export class LoginDto {
    emailAddress: string;
    password: string;
    ip: string;
    device: string;

    constructor(body: any) {
        this.emailAddress = body.email_address;
        this.password = body.password;
        this.ip = body.ip;
        this.device = body.device;
    }
}
