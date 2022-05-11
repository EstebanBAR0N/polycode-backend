import {
  Controller,
  Post,
  Body,
  UseGuards,
  Headers,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/routes/user/dto/create-user.dto';
import { EmailConfirmationUserDto } from 'src/routes/user/dto/email-confirmation-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: any) {
    return this.authService.login(req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Headers('authorization') token) {
    return this.authService.logout(token);
  }

  @Post('send-email')
  sendMail(@Body() body: any) {
    return this.authService.sendEmail(body);
  }
}
