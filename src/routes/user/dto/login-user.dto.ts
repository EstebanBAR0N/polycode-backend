import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
