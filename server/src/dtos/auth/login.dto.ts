export class LoginDto {
  emailAddress: string;
  password: string;

  constructor(body: any) {
    this.emailAddress = body.email_address;
    this.password = body.password;
  }
}

