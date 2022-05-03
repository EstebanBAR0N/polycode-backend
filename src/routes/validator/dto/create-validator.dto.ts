import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateValidatorDto {
  @Length(3, 30)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  entryValue: string;

  @IsString()
  @IsNotEmpty()
  expectedResult: string;

  @IsString()
  exerciseId: string;
}
