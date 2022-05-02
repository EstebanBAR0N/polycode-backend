import { IsString, IsNotEmpty, IsEmail, IsBoolean } from 'class-validator';
import { User } from '../entities/user.entity';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly isAdmin: boolean;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.isAdmin = user.isAdmin;
  }
}
