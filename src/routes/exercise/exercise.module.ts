import { Module } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { DatabaseModule } from 'src/database/database.module';
import { exerciseProviders } from './exercise.providers';
import { RunnerModule } from 'src/common/runner/runner.module';

@Module({
  imports: [DatabaseModule, RunnerModule],
  controllers: [ExerciseController],
  providers: [ExerciseService, ...exerciseProviders],
})
export class ExerciseModule {}
