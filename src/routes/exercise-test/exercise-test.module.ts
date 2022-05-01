import { Module } from '@nestjs/common';
import { ExerciseTestService } from './exercise-test.service';
import { ExerciseTestController } from './exercise-test.controller';

@Module({
  controllers: [ExerciseTestController],
  providers: [ExerciseTestService]
})
export class ExerciseTestModule {}
