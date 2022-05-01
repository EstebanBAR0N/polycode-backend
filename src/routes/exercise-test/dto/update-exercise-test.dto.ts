import { PartialType } from '@nestjs/mapped-types';
import { CreateExerciseTestDto } from './create-exercise-test.dto';

export class UpdateExerciseTestDto extends PartialType(CreateExerciseTestDto) {}
