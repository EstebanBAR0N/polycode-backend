import { Module } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { DatabaseModule } from '../../database/database.module';
import { exerciseProviders } from './exercise.providers';
import { RunnerModule } from '../../runners/runner.module';
import { UserModule } from '../../resources/user/user.module';

@Module({
  imports: [DatabaseModule, RunnerModule, UserModule],
  controllers: [ExerciseController],
  providers: [ExerciseService, ...exerciseProviders],
  exports: [ExerciseService],
})
export class ExerciseModule {}
