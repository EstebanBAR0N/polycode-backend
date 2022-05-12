import { Module } from '@nestjs/common';
import { ValidatorService } from './validator.service';
import { ValidatorController } from './validator.controller';
import { validatorProviders } from './validator.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ValidatorController],
  providers: [ValidatorService, ...validatorProviders],
})
export class ValidatorModule {}
