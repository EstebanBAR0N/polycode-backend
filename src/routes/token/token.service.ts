import { Injectable, Inject } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { Token } from './entities/token.entity';

@Injectable()
export class TokenService {
  constructor(
    @Inject('tokenModel')
    private tokenModel: typeof Token,
  ) {}

  create(createTokenDto: CreateTokenDto) {
    return 'This action adds a new token';
  }

  findAll() {
    return `This action returns all token`;
  }

  findOne(id: number) {
    return `This action returns a #${id} token`;
  }

  update(id: number, updateTokenDto: UpdateTokenDto) {
    return `This action updates a #${id} token`;
  }

  async remove(tokenPk: string) {
    const token = await this.tokenModel.findByPk<Token>(tokenPk);
    await token.destroy();

    return token;
  }
}
