import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './resources/user/user.module';
import { TokenModule } from './resources/token/token.module';
import { ChallengeModule } from './resources/challenge/challenge.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './resources/auth/auth.module';
import { ExerciseModule } from './resources/exercise/exercise.module';
import { ValidatorModule } from './resources/validator/validator.module';
import { RunnerModule } from './runners/runner.module';

@Module({
  imports: [
    UserModule,
    TokenModule,
    ChallengeModule,
    DatabaseModule,
    AuthModule,
    ExerciseModule,
    ValidatorModule,
    RunnerModule,
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
