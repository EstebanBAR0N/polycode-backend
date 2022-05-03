import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CreateValidatorDto } from './dto/create-validator.dto';
import { UpdateValidatorDto } from './dto/update-validator.dto';
import { CheckValidatorDto } from './dto/check-validator.dto';
import { Validator } from './entities/validator.entity';

@Injectable()
export class ValidatorService {
  constructor(
    @Inject('validatorModel')
    private validatorModel: typeof Validator,
  ) {}

  async create(createValidatorDto: CreateValidatorDto) {
    // check if user already exists
    const validatorAlreadyExist = await this.doesValidatorAlreadyExist(
      createValidatorDto.name,
    );

    if (validatorAlreadyExist) {
      throw new HttpException(
        'Validator name already exists',
        HttpStatus.CONFLICT,
      );
    }

    // create validator from body info
    const validator = new Validator();

    validator.name = createValidatorDto.name;
    validator.entryValue = createValidatorDto.entryValue;
    validator.expectedResult = createValidatorDto.expectedResult;

    // save validator in db
    return await validator.save();
  }

  async findAll() {
    return await this.validatorModel.findAll();
  }

  async findOne(id: string) {
    return await this.validatorModel.findByPk(id);
  }

  async checkValidator(id: string, checkValidatorDto: CheckValidatorDto) {
    // get validator
    const validator = await this.validatorModel.findByPk(id);

    if (!validator) {
      throw new HttpException('Validator not found', HttpStatus.NOT_FOUND);
    }

    // run code
    const result = await this.runCode(validator.entryValue, checkValidatorDto);

    return { expectedResult: validator.expectedResult, result };
  }

  async update(id: string, updateValidatorDto: UpdateValidatorDto) {
    if (
      updateValidatorDto.name &&
      (await this.doesValidatorAlreadyExist(updateValidatorDto.name))
    ) {
      throw new HttpException(
        'Validator name already exists',
        HttpStatus.CONFLICT,
      );
    }

    // update validator
    const validator = await this.validatorModel.findByPk(id);

    if (!validator) {
      throw new HttpException('validator not found', HttpStatus.NOT_FOUND);
    }

    validator.name = updateValidatorDto.name || validator.name;
    validator.entryValue =
      updateValidatorDto.entryValue || validator.entryValue;
    validator.expectedResult =
      updateValidatorDto.expectedResult || validator.expectedResult;

    // modify validator in db
    return await validator.save();
  }

  async remove(id: string) {
    // delete the validator
    const validator = await this.validatorModel.findByPk<Validator>(id);

    if (!validator) {
      throw new HttpException('Validator not found', HttpStatus.NOT_FOUND);
    }

    await validator.destroy();

    return 'Validator deleted';
  }

  // other functions
  async doesValidatorAlreadyExist(name: string) {
    return await this.validatorModel.findOne({ where: { name } });
  }

  // TODO: execute code in workers
  async runCode(code: string, checkValidatorDto: CheckValidatorDto) {
    const { language, inputCode } = checkValidatorDto;

    return 'result of : ' + inputCode;
  }
}
