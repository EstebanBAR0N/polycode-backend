import { Module } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { DatabaseModule } from 'src/database/database.module';
import { exerciseProviders } from './exercise.providers';
import { RunnerModule } from 'src/runners/runner.module';
import { UserModule } from 'src/resources/user/user.module';

@Module({
  imports: [DatabaseModule, RunnerModule, UserModule],
  controllers: [ExerciseController],
  providers: [ExerciseService, ...exerciseProviders],
  exports: [ExerciseService],
})
export class ExerciseModule {}
