import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Exercise } from './entities/exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { CheckExerciseDto } from './dto/check-exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(
    @Inject('exerciseModel')
    private exerciseModel: typeof Exercise,
  ) {}

  async create(createExerciseDto: CreateExerciseDto) {
    // check if exercise already exists
    const exerciseAlreadyExist = await this.doesExerciseAlreadyExist(
      createExerciseDto.name,
    );

    if (exerciseAlreadyExist) {
      throw new HttpException(
        'Exercise name already exists',
        HttpStatus.CONFLICT,
      );
    }

    // create exercise from body info
    const exercise = new Exercise();

    exercise.name = createExerciseDto.name;
    exercise.instructions = createExerciseDto.instructions;
    exercise.expectedResult = createExerciseDto.expectedResult;
    exercise.difficultyLevel = createExerciseDto.difficultyLevel;
    exercise.challengeId = createExerciseDto.challengeId;

    // save exercise in db
    return await exercise.save();
  }

  async findAll(query: any) {
    let finalQuery = {};
    if (query.challengeId) {
      finalQuery = { where: { challengeId: query.challengeId } };
    }

    return await this.exerciseModel.findAll(finalQuery);
  }

  async findOne(id: string) {
    return await this.exerciseModel.findByPk(id);
  }

  async checkExercise(id: string, checkExerciseDto: CheckExerciseDto) {
    // get exercise
    const exercise = await this.exerciseModel.findByPk(id);

    if (!exercise) {
      throw new HttpException('Exercise not found', HttpStatus.NOT_FOUND);
    }

    // run code
    const result = await this.runCode(checkExerciseDto);

    return { expectedResult: exercise.expectedResult, result };
  }

  async update(id: string, updateExerciseDto: UpdateExerciseDto) {
    if (
      updateExerciseDto.name &&
      (await this.doesExerciseAlreadyExist(updateExerciseDto.name))
    ) {
      throw new HttpException(
        'Exercise name already exists',
        HttpStatus.CONFLICT,
      );
    }

    // update exercise
    const exercise = await this.exerciseModel.findByPk(id);

    if (!exercise) {
      throw new HttpException('Exercise not found', HttpStatus.NOT_FOUND);
    }

    exercise.name = updateExerciseDto.name || exercise.name;
    exercise.instructions =
      updateExerciseDto.instructions || exercise.instructions;
    exercise.expectedResult =
      updateExerciseDto.expectedResult || exercise.expectedResult;
    exercise.difficultyLevel = updateExerciseDto.difficultyLevel;
    exercise.challengeId = updateExerciseDto.challengeId;

    // modify exercise in db
    return await exercise.save();
  }

  async remove(id: string) {
    // delete the exercise
    const exercise = await this.exerciseModel.findByPk<Exercise>(id);

    if (!exercise) {
      throw new HttpException('Exercise not found', HttpStatus.NOT_FOUND);
    }

    await exercise.destroy();

    return 'Exercise deleted';
  }

  // other functions
  async doesExerciseAlreadyExist(name: string) {
    return await this.exerciseModel.findOne({ where: { name } });
  }

  // TODO: execute code in workers
  async runCode(checkExerciseDto: CheckExerciseDto) {
    const { language, inputCode } = checkExerciseDto;

    return 'result of : ' + inputCode;
  }
}
