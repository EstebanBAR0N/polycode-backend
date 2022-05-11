import axios from 'axios';
import * as bcrypt from 'bcrypt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/routes/user/entities/user.entity';
import { UserService } from 'src/routes/user/user.service';
import { TokenService } from 'src/routes/token/token.service';
import { CreateUserDto } from 'src/routes/user/dto/create-user.dto';
import { LoginUserDto } from 'src/routes/user/dto/login-user.dto';
import { Token } from 'src/routes/token/entities/token.entity';

// custom imports
import { generateString } from '../utils/randomString';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  // TODO: envoi de mail
  async register(createUserDto: CreateUserDto) {
    // check if user already exists
    const userAlreadyExist = await this.userService.doesUserAlreadyExist(
      createUserDto.username,
      createUserDto.email,
    );

    if (userAlreadyExist) {
      throw new HttpException(
        'Email or username already exists',
        HttpStatus.CONFLICT,
      );
    }

    // check if same passwords
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new HttpException("Passwords don't match", HttpStatus.CONFLICT);
    }

    // create user from body info
    const user = new User();

    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.isEmailConfirmed = false;
    user.isAdmin = false;

    // hashed password
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    user.password = hashPassword;

    // save user in db
    await this.userService.create(user);

    // send confirmation email
    await this.sendEmail({ email: user.email });

    return { message: `Your account as been created successfuly` };
  }

  async login(req: any): Promise<any> {
    // get user data
    const user = req.user;

    // info to stock in the token
    const payload = {
      id: user.id,
      username: user.username,
    };

    // sign token
    const jwt_token = this.jwtService.sign(payload);

    // add token to bdd
    const expirationDateInTimeStamp: number = await this.storeTokenInDatabase(
      user.id,
      jwt_token,
    );

    return {
      access_token: jwt_token,
      userId: user?.id,
      expirationDate: expirationDateInTimeStamp,
    };
  }

  async logout(composedToken: string) {
    const token = composedToken.split(' ')[1];

    if (!token) {
      throw new HttpException("Token doesn't existe", HttpStatus.BAD_REQUEST);
    }

    // delete token in database;
    const tokenDelete = await this.tokenService.remove(token);

    return tokenDelete;
  }

  async sendEmail(body: any) {
    console.log(body);
    // generate new token to send
    const token = generateString(10);

    // update email confirmation token in db
    await this.userService.updateEmailConfirmationToken(body?.email, token);

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

  // other functions
  async validateUser(loginUserDto: LoginUserDto): Promise<any> {
    // get user in bdd
    const user = await this.userService.findOneByEmailForLogin(
      loginUserDto.email,
    );

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // check password
    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);

    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async storeTokenInDatabase(userId: string, token: string) {
    // store new token to database
    const creationDate = new Date(Date.now());
    const expirationDate = new Date(creationDate);
    expirationDate.setDate(expirationDate.getDate() + 1);

    const token_obj = new Token();
    token_obj.token = token;
    token_obj.issueDate = creationDate;
    token_obj.expirationDate = expirationDate;
    token_obj.userId = userId;

    await this.tokenService.create(token_obj);

    return expirationDate.getTime();
  }

  async isEmailConfirmed(userId: string) {
    const user = await this.userService.findOneById(userId);

    return user && user.isEmailConfirmed;
  }
}
