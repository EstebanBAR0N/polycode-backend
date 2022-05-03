import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateExerciseDto {
  @Length(3, 30)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  instructions: string;

  @IsString()
  @IsNotEmpty()
  expectedResult: string;

  difficultyLevel: number;
}
