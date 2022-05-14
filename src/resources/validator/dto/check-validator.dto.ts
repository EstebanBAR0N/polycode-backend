import { IsNotEmpty, IsString } from 'class-validator';
import { Language } from '../../../common/enum/language';

export class CheckValidatorDto {
  @IsNotEmpty()
  language: Language;

  @IsString()
  @IsNotEmpty()
  inputCode: string;
}
