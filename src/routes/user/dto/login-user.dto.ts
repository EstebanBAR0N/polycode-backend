import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @Length(5, 20)
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
