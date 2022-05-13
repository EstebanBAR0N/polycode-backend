import { Module } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { ChallengeController } from './challenge.controller';
import { challengeProviders } from './challenge.providers';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/resources/user/user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [ChallengeController],
  providers: [ChallengeService, ...challengeProviders],
})
export class ChallengeModule {}
