import { IsString, IsOptional } from 'class-validator';

export class EmailConfirmationUserDto {
  @IsOptional()
  @IsString()
  readonly confirmationEmailToken: string;
}
