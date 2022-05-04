import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { userProviders } from './user.providers';
import { userExerciseProviders } from './user-exercise.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, ...userProviders, ...userExerciseProviders],
  exports: [UserService],
})
export class UserModule {}
