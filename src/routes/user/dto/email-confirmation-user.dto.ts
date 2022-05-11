import { IsString } from 'class-validator';

export class EmailConfirmationUserDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly confirmationEmailToken: string;
}
