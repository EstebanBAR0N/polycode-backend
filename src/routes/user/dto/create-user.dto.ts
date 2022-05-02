import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @Length(3, 15)
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @Length(5, 20)
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @Length(5, 20)
  @IsString()
  @IsNotEmpty()
  readonly confirmPassword: string;

  readonly isAdmin: boolean;
}
