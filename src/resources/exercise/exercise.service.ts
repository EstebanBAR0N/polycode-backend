import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Exercise } from './entities/exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { CheckExerciseDto } from './dto/check-exercise.dto';
import { Language } from 'src/common/enum/language';
import { NodeRunnerService } from 'src/runners/node-runner.service';
import { PythonRunnerService } from 'src/runners/python-runner.service';
import { RustRunnerService } from 'src/runners/rust-runner.service';
import { JavaRunnerService } from 'src/runners/java-runner.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ExerciseService {
  constructor(
    @Inject('exerciseModel')
    private exerciseModel: typeof Exercise,
    private nodeRunnerService: NodeRunnerService,
    private pythonRunnerService: PythonRunnerService,
    private rustRunnerService: RustRunnerService,
    private javaRunnerService: JavaRunnerService,
    private userService: UserService,
  ) {}

  // TODO: allowNull on challengeId
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
    return await this.exerciseModel.create(exercise);
  }

  // TODO: handle quand challengeId n'est pas un vrai uuid
  async findAll(query: any) {
    let finalQuery = {};
    if (query.challengeId) {
      finalQuery = { where: { challengeId: query.challengeId } };
    }

    return await this.exerciseModel.findAll(finalQuery);
  }

  async findOne(id: string) {
    return await this.exerciseModel.findOne({ where: { id }, raw: true });
  }

  async checkExercise(
    id: string,
    checkExerciseDto: CheckExerciseDto,
    req: any,
  ) {
    // get exercise
    const exercise = await this.exerciseModel.findOne({
      where: { id },
      raw: true,
    });

    if (!exercise) {
      throw new HttpException('Exercise not found', HttpStatus.NOT_FOUND);
    }

    // run code
    const result = await this.runCode(checkExerciseDto);

    // Handle user-exercise table
    const userId = req.user.userId;
    let isCompleted = false;
    if (result.stdout.trim() === exercise.expectedResult) {
      isCompleted = true;
    }
    await this.userService.createOrUpdateUserExercise(isCompleted, userId, id);

    return { isCompleted: isCompleted, result };
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
    const exercise = await this.exerciseModel.findOne({
      where: { id },
      raw: true,
    });

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
    await this.exerciseModel.update(exercise, { where: { id } });

    return `Exercise ${id} successfuly updated`;
  }

  async remove(id: string) {
    // delete the exercise
    const exercise = await this.exerciseModel.findOne<Exercise>({
      where: { id },
      raw: true,
    });

    if (!exercise) {
      throw new HttpException('Exercise not found', HttpStatus.NOT_FOUND);
    }

    await this.exerciseModel.destroy({ where: { id } });

    return `Exercise ${id} deleted`;
  }

  /* OTHER FUNCTIONS */
  async doesExerciseAlreadyExist(name: string) {
    return await this.exerciseModel.findOne({ where: { name }, raw: true });
  }

  async runCode(checkExerciseDto: CheckExerciseDto) {
    const { language, inputCode } = checkExerciseDto;

    let result = { stdout: '', stderr: '' };

    switch (language) {
      case Language.JAVASCRIPT:
        result = await this.nodeRunnerService.run(inputCode);
        break;
      case Language.PYTHON:
        result = await this.pythonRunnerService.run(inputCode);
        break;
      case Language.RUST:
        result = await this.rustRunnerService.run(inputCode);
        break;
      case Language.JAVA:
        result = await this.javaRunnerService.run(inputCode);
        break;
      default:
        throw new HttpException('Language not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
