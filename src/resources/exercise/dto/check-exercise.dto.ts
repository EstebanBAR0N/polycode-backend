import { IsNotEmpty, IsString } from 'class-validator';
import { Language } from '../../../common/enum/language';

export class CheckExerciseDto {
  @IsNotEmpty()
  language: Language;

  @IsString()
  @IsNotEmpty()
  inputCode: string;
}
