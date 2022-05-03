import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Token } from './entities/token.entity';

@Injectable()
export class TokenService {
  constructor(
    @Inject('tokenModel')
    private tokenModel: typeof Token,
  ) {}

  async remove(tokenPk: string) {
    const token = await this.tokenModel.findByPk<Token>(tokenPk);

    if (!token) {
      throw new HttpException("Token doesn't existe", HttpStatus.BAD_REQUEST);
    }

    await token.destroy();

    return token;
  }
}
