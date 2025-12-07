export class CreateUserDto {
  fullName: string;
  emailAddress: string;
  password: string;

  constructor(body:any) {
    this.fullName = body.full_name;
    this.emailAddress = body.email_address;
    this.password = body.password;
  }
}
