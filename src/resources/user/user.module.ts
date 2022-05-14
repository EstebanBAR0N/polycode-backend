import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { EmailService } from './email/email.service';
import { UserController } from './user.controller';
import { EmailController } from './email/email.controller';
import { userProviders } from './user.providers';
import { userExerciseProviders } from './user-exercise.providers';
import { userChallengeProviders } from './user-challenge.providers';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController, EmailController],
  providers: [
    UserService,
    EmailService,
    ...userProviders,
    ...userExerciseProviders,
    ...userChallengeProviders,
  ],
  exports: [
    UserService,
    EmailService,
    ...userExerciseProviders,
    ...userChallengeProviders,
  ],
})
export class UserModule {}
