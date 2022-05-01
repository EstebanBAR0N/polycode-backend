import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseTestController } from './exercise-test.controller';
import { ExerciseTestService } from './exercise-test.service';

describe('ExerciseTestController', () => {
  let controller: ExerciseTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExerciseTestController],
      providers: [ExerciseTestService],
    }).compile();

    controller = module.get<ExerciseTestController>(ExerciseTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
