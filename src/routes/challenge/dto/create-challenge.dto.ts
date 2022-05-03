import { IsString, IsNotEmpty, IsBoolean, Length } from 'class-validator';
import { Language } from 'src/common/enum/language';

export class CreateChallengeDto {
  @Length(3, 30)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  language: Language;

  @IsBoolean()
  isPractice: boolean;
}
