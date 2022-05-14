import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { JwtAuthGuard } from '../../resources/auth/guards/jwt-auth.guard';

@Controller('challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  /* /challenge [POST] */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createChallengeDto: CreateChallengeDto) {
    return this.challengeService.create(createChallengeDto);
  }

  /* /challenge [GET] */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: { isPractice: boolean }) {
    return this.challengeService.findAll(query);
  }

  /* /challenge/:id [GET] */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.challengeService.findOne(id);
  }

  /* /challenge/:id [PATCH] */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChallengeDto: UpdateChallengeDto,
  ) {
    return this.challengeService.update(id, updateChallengeDto);
  }

  /* /challenge/:id [DELETE] */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.challengeService.remove(id);
  }

  /* /challenge/progress [GET] */
  @UseGuards(JwtAuthGuard)
  @Get('progress/:id')
  findProgress(@Param('id') id: string, @Request() req: any) {
    return this.challengeService.findProgress(id, req);
  }
}
