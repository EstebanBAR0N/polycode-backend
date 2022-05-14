import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Exercise } from './entities/exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { CheckExerciseDto } from './dto/check-exercise.dto';
import { Language } from '../../common/enum/language';
import { NodeRunnerService } from '../../runners/node-runner.service';
import { PythonRunnerService } from '../../runners/python-runner.service';
import { RustRunnerService } from '../../runners/rust-runner.service';
import { JavaRunnerService } from '../../runners/java-runner.service';
import { UserExercise } from '../user/entities/user-exercise.entity';
import { UserChallenge } from '../user/entities/user-challenge.entity';

@Injectable()
export class ExerciseService {
  constructor(
    @Inject('exerciseModel')
    private exerciseModel: typeof Exercise,
    @Inject('userExerciseModel')
    private userExerciseModel: typeof UserExercise,
    @Inject('userChallengeModel')
    private userChallengeModel: typeof UserChallenge,
    private nodeRunnerService: NodeRunnerService,
    private pythonRunnerService: PythonRunnerService,
    private rustRunnerService: RustRunnerService,
    private javaRunnerService: JavaRunnerService,
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
    await this.createOrUpdateUserExercise(isCompleted, userId, id);

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
  async getExerciseById(id: string) {
    return await this.exerciseModel.findOne({ where: { id: id } });
  }

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

  async createOrUpdateUserExercise(
    isCompleted: boolean,
    userId: string,
    exerciseId: string,
  ) {
    // check if user-exercise row exists
    const userExerciseAlreadyExists = await this.userExerciseModel.findOne({
      where: { userId: userId, exerciseId: exerciseId },
      raw: true,
    });

    const exercise = await this.exerciseModel.findOne({
      where: { id: exerciseId },
      raw: true,
    });

    if (userExerciseAlreadyExists) {
      // exists + it's not completed and isComplted = true  => update to completed
      if (!userExerciseAlreadyExists.isCompleted && isCompleted) {
        await this.userExerciseModel.update(
          { isCompleted },
          { where: { userId, exerciseId } },
        );

        // update user-challenge too
        await this.createOrUpdateUserChallenge(exercise, userId);

        console.log(`Exercise ${exerciseId} successfuly completed`);
      }
      // no need update
      else {
        console.log('Exercise already completed');
      }
    } else {
      // create the row in db
      await this.userExerciseModel.create({
        isCompleted,
        userId,
        exerciseId,
      });
      await this.createOrUpdateUserChallenge(exercise, userId);

      console.log(`Exercise ${exerciseId} successfuly completed`);
    }
  }

  async createOrUpdateUserChallenge(exercise: Exercise, userId: string) {
    // udpate user-challenge table
    const userChallenge = await this.userChallengeModel.findOne({
      where: { userId: userId, challengeId: exercise.challengeId },
      raw: true,
    });

    if (userChallenge) {
      await this.userChallengeModel.update(
        { nbOfExerciseCompleted: userChallenge.nbOfExerciseCompleted + 1 },
        { where: { userId: userId, challengeId: exercise.challengeId } },
      );
      console.log(`Challenge ${exercise.challengeId} successfuly completed`);
    } else {
      // create the row in db
      await this.userChallengeModel.create({
        nbOfExerciseCompleted: 1,
        userId: userId,
        challengeId: exercise?.challengeId,
      });

      console.log(`Challenge ${exercise.challengeId} successfuly completed`);
    }
  }
}
