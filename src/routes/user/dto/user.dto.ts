import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  Length,
} from 'class-validator';
import { User } from '../entities/user.entity';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @Length(3, 15)
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsBoolean()
  readonly isEmailConfirmed: boolean;

  @IsNotEmpty()
  @IsBoolean()
  readonly isAdmin: boolean;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.isAdmin = user.isAdmin;
    this.isEmailConfirmed = user.isEmailConfirmed;
  }
}
