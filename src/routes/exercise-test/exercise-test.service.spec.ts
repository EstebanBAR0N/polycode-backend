import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseTestService } from './exercise-test.service';

describe('ExerciseTestService', () => {
  let service: ExerciseTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExerciseTestService],
    }).compile();

    service = module.get<ExerciseTestService>(ExerciseTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
