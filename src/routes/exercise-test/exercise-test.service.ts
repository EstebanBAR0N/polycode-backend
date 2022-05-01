import { Injectable } from '@nestjs/common';
import { CreateExerciseTestDto } from './dto/create-exercise-test.dto';
import { UpdateExerciseTestDto } from './dto/update-exercise-test.dto';

@Injectable()
export class ExerciseTestService {
  create(createExerciseTestDto: CreateExerciseTestDto) {
    return 'This action adds a new exerciseTest';
  }

  findAll() {
    return `This action returns all exerciseTest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exerciseTest`;
  }

  update(id: number, updateExerciseTestDto: UpdateExerciseTestDto) {
    return `This action updates a #${id} exerciseTest`;
  }

  remove(id: number) {
    return `This action removes a #${id} exerciseTest`;
  }
}
