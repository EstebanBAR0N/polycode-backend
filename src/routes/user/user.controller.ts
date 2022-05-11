import {
  Controller,
  Get,
  Body,
  Request,
  Patch,
  Param,
  Delete,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailConfirmationUserDto } from './dto/email-confirmation-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.userService.findOne(id, req);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, req, updateUserDto);
  }

  @Post('confirm-email')
  emailConfirmation(
    @Body() emailConfirmationUserDto: EmailConfirmationUserDto,
  ) {
    return this.userService.emailConfirmation(emailConfirmationUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.userService.remove(id, req);
  }
}
