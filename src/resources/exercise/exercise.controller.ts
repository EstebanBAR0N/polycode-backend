import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { CheckExerciseDto } from './dto/check-exercise.dto';
import { JwtAuthGuard } from '../../resources/auth/guards/jwt-auth.guard';

@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  /* /exercise [POST] */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exerciseService.create(createExerciseDto);
  }

  /* /exercise [GET] */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: { challengeId: string }) {
    return this.exerciseService.findAll(query);
  }

  /* /exercise/:id [GET] */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exerciseService.findOne(id);
  }

  /* /exercise/:id [PATCH] */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.exerciseService.update(id, updateExerciseDto);
  }

  /* /exercise/:id [DELETE] */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exerciseService.remove(id);
  }

  /* /exercise/run/:id [POST] */
  @UseGuards(JwtAuthGuard)
  @Post('run/:id')
  checkExercise(
    @Param('id') id: string,
    @Body() checkExerciseDto: CheckExerciseDto,
    @Request() req: any,
  ) {
    return this.exerciseService.checkExercise(id, checkExerciseDto, req);
  }
}
