import { Controller, Body, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailConfirmationUserDto } from '../dto/email-confirmation-user.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /* email/confirm [POST] */
  @Post('confirm')
  emailConfirmation(
    @Body() emailConfirmationUserDto: EmailConfirmationUserDto,
  ) {
    return this.emailService.emailConfirmation(emailConfirmationUserDto);
  }

  /* email/send [POST] */
  @Post('send')
  sendEmail(@Body() body: any) {
    return this.emailService.sendEmail(body);
  }
}
