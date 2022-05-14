import {
  Controller,
  Post,
  Delete,
  Body,
  UseGuards,
  Headers,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../../resources/user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /* /auth/register [POST] */
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  /* /auth/login [POST] */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: any) {
    return this.authService.login(req);
  }

  /* /auth/logout [POST] */
  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  logout(@Headers('authorization') token) {
    return this.authService.logout(token);
  }
}
