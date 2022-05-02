import { Injectable } from '@nestjs/common';
import { CreateValidatorDto } from './dto/create-validator.dto';
import { UpdateValidatorDto } from './dto/update-validator.dto';

@Injectable()
export class ValidatorService {
  create(createValidatorDto: CreateValidatorDto) {
    return 'This action adds a new Validator';
  }

  findAll() {
    return `This action returns all Validator`;
  }

  findOne(id: number) {
    return `This action returns a #${id} Validator`;
  }

  update(id: number, updateValidatorDto: UpdateValidatorDto) {
    return `This action updates a #${id} Validator`;
  }

  remove(id: number) {
    return `This action removes a #${id} Validator`;
  }
}
