import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge } from './entities/challenge.entity';

@Injectable()
export class ChallengeService {
  constructor(
    @Inject('challengeModel')
    private challengeModel: typeof Challenge,
  ) {}

  async create(createChallengeDto: CreateChallengeDto) {
    // check if challenge already exists
    const challengeAlreadyExist = await this.doesChallengeAlreadyExist(
      createChallengeDto.name,
    );

    if (challengeAlreadyExist) {
      throw new HttpException(
        'Challenge name already exists',
        HttpStatus.CONFLICT,
      );
    }

    // create challenge from body info
    const challenge = new Challenge();

    challenge.name = createChallengeDto.name;
    challenge.language = createChallengeDto.language;
    challenge.isPractice = createChallengeDto.isPractice || false;

    // save challenge in db
    return await challenge.save();
  }

  async findAll(query: any) {
    const isPractice = query.isPractice || false;

    return await this.challengeModel.findAll({
      where: { isPractice: isPractice },
    });
  }

  async findOne(id: string) {
    return await this.challengeModel.findByPk(id);
  }

  async update(id: string, updateChallengeDto: UpdateChallengeDto) {
    if (
      updateChallengeDto.name &&
      (await this.doesChallengeAlreadyExist(updateChallengeDto.name))
    ) {
      throw new HttpException(
        'challenge name already exists',
        HttpStatus.CONFLICT,
      );
    }

    // update challenge
    const challenge = await this.challengeModel.findByPk(id);

    if (!challenge) {
      throw new HttpException('Challenge not found', HttpStatus.NOT_FOUND);
    }

    challenge.name = updateChallengeDto.name || challenge.name;
    challenge.language = updateChallengeDto.language || challenge.language;
    if (updateChallengeDto.isPractice != null) {
      challenge.isPractice = updateChallengeDto.isPractice;
    }

    // modify challenge in db
    return await challenge.save();
  }

  async remove(id: string) {
    // delete the challenge
    const challenge = await this.challengeModel.findByPk<Challenge>(id);

    if (!challenge) {
      throw new HttpException('Challenge not found', HttpStatus.NOT_FOUND);
    }

    await challenge.destroy();

    return 'Challenge deleted';
  }

  // other functions
  async doesChallengeAlreadyExist(name: string) {
    return await this.challengeModel.findOne({ where: { name } });
  }
}
