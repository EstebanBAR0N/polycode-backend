import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { tokenProviders } from './token.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TokenController],
  providers: [TokenService, ...tokenProviders],
  exports: [TokenService],
})
export class TokenModule {}
