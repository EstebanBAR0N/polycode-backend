import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // check the expirationDate
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const isEmailConfirmed = await this.authService.isEmailConfirmed(
      payload.id,
    );

    if (!isEmailConfirmed) {
      throw new UnauthorizedException('Please verify your email');
    }

    return {
      userId: payload.id,
      username: payload.username,
    };
  }
}
