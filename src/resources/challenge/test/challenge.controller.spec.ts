import { Test, TestingModule } from '@nestjs/testing';
import { Language } from 'src/common/enum/language';
import { ChallengeController } from '../challenge.controller';
import { ChallengeService } from '../challenge.service';
import { Challenge } from '../entities/challenge.entity';

describe('ChallengeController', () => {
  let challengeController: ChallengeController;
  let challengeService: ChallengeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChallengeController],
      providers: [ChallengeService],
    }).compile();

    challengeService = module.get<ChallengeService>(ChallengeService);
    challengeController = module.get<ChallengeController>(ChallengeController);
  });

  // describe('findAll', () => {
  //   it('should return an array of challenge', async () => {
  //     const result: Challenge[] = [
  //       {
  //         id: 'azazczeasa-azaxaz',
  //         name: 'foo',
  //         language: Language.JAVASCRIPT,
  //         isPractice: false,
  //       },
  //     ];
  //     jest
  //       .spyOn(challengeService, 'findAll')
  //       .mockImplementation(() => await result);

  //     expect(await challengeService.findAll({})).toBe(result);
  //   });
  // });
});
