import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { EmailService } from './email/email.service';
import { UserController } from './user.controller';
import { EmailController } from './email/email.controller';
import { userProviders } from './user.providers';
import { userExerciseProviders } from './user-exercise.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController, EmailController],
  providers: [
    UserService,
    EmailService,
    ...userProviders,
    ...userExerciseProviders,
  ],
  exports: [UserService, EmailService],
})
export class UserModule {}
