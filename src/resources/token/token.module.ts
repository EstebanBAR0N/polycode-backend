import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { tokenProviders } from './token.providers';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [TokenService, ...tokenProviders],
  exports: [TokenService],
})
export class TokenModule {}
