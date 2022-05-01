import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExerciseTestService } from './exercise-test.service';
import { CreateExerciseTestDto } from './dto/create-exercise-test.dto';
import { UpdateExerciseTestDto } from './dto/update-exercise-test.dto';

@Controller('exercise-test')
export class ExerciseTestController {
  constructor(private readonly exerciseTestService: ExerciseTestService) {}

  @Post()
  create(@Body() createExerciseTestDto: CreateExerciseTestDto) {
    return this.exerciseTestService.create(createExerciseTestDto);
  }

  @Get()
  findAll() {
    return this.exerciseTestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exerciseTestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExerciseTestDto: UpdateExerciseTestDto) {
    return this.exerciseTestService.update(+id, updateExerciseTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exerciseTestService.remove(+id);
  }
}
