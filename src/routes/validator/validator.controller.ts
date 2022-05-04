import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ValidatorService } from './validator.service';
import { CreateValidatorDto } from './dto/create-validator.dto';
import { UpdateValidatorDto } from './dto/update-validator.dto';
import { CheckValidatorDto } from './dto/check-validator.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('validator')
export class ValidatorController {
  constructor(private readonly validatorService: ValidatorService) {}

  // @UseGuards(JwtAuthGuard)
  // @Post()
  // create(@Body() createValidatorDto: CreateValidatorDto) {
  //   return this.validatorService.create(createValidatorDto);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get()
  // findAll() {
  //   return this.validatorService.findAll();
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.validatorService.findOne(id);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Post(':id')
  // checkValidator(
  //   @Param('id') id: string,
  //   @Body() checkValidatorDto: CheckValidatorDto,
  // ) {
  //   return this.validatorService.checkValidator(id, checkValidatorDto);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateValidatorDto: UpdateValidatorDto,
  // ) {
  //   return this.validatorService.update(id, updateValidatorDto);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.validatorService.remove(id);
  // }
}
