import {
  Controller,
  Get,
  Body,
  Request,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../resources/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /* /user/:id [GET] */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.userService.findOne(id, req);
  }

  /* /user/:id [PATCH] */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, req, updateUserDto);
  }

  /* /user/:id [DELETE] */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.userService.remove(id, req);
  }
}
