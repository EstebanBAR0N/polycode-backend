import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/routes/user/dto/create-user.dto';
import { LoginUserDto } from 'src/routes/user/dto/login-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  register(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
