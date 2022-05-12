import axios from 'axios';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { EmailConfirmationUserDto } from '../dto/email-confirmation-user.dto';
import { UserService } from '../user.service';

// custom imports
import { generateString } from '../../../utils/randomString';

@Injectable()
export class EmailService {
  constructor(
    @Inject('userModel')
    private userModel: typeof User,
    private userService: UserService,
  ) {}

  async sendEmail(body: any) {
    // generate new token to send
    const token = generateString(10);

    // update email confirmation token in db
    await this.updateEmailConfirmationToken(body?.email, token);

    // send email
    await axios.post(
      process.env.SMTP_URL,
      {
        sender: {
          name: 'noreply',
          email: 'estebanbaron.pro@gmail.com',
        },
        to: [
          {
            email: body?.email,
            name: body?.email.split('@')[0] || 'polycode user',
          },
        ],
        subject: 'PolyCode email confirmation',
        htmlContent:
          '<html><head></head><body><p>Welcome to PolyCode ! Last step, confirm your email !</p> Code:' +
          token +
          '</p></body></html>',
      },
      {
        headers: {
          'api-key': process.env.API_KEY,
        },
      },
    );

    return { message: 'Email resend successfuly' };
  }

  async emailConfirmation(emailConfirmationUserDto: EmailConfirmationUserDto) {
    const email = emailConfirmationUserDto.email;

    // get user
    const user = await this.userService.findOneByEmailWithPassword(email);

    // check if user exist and if accoutn not already verified
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.isEmailConfirmed) {
      throw new HttpException('Email already confirmed', HttpStatus.CONFLICT);
    }

    // check token
    if (
      emailConfirmationUserDto.confirmationEmailToken.trim() ===
      user.emailConfirmationToken.trim()
    ) {
      user.isEmailConfirmed = true;

      // update user in db
      await this.userModel.update(user, {
        where: { email: email },
      });

      return {
        message: `Email successfuly confirmed by ${email}`,
      };
    }
    // wrong token
    throw new HttpException(
      'Incorrect email confirmaton token',
      HttpStatus.FORBIDDEN,
    );
  }

  async updateEmailConfirmationToken(
    email: string,
    emailConfirmationToken: string,
  ) {
    // update user
    const user: User = await this.userService.findOneByEmailWithPassword(email);

    if (!user) {
      throw new HttpException(
        `User with this email: ${email} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    // update user
    user.emailConfirmationToken =
      emailConfirmationToken || user.emailConfirmationToken;

    // update user in db
    await this.userModel.update(user, { where: { email: email } });
  }
}
