import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './routes/user/user.module';
import { TokenModule } from './routes/token/token.module';
import { ChallengeModule } from './routes/challenge/challenge.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ExerciseModule } from './routes/exercise/exercise.module';
import { ValidatorModule } from './routes/validator/validator.module';

@Module({
  imports: [
    UserModule,
    TokenModule,
    ChallengeModule,
    DatabaseModule,
    AuthModule,
    ExerciseModule,
    ValidatorModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
