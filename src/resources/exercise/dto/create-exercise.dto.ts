import { IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';

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

  @IsNotEmpty()
  difficultyLevel: number;

  @IsOptional()
  challengeId: string;
}
