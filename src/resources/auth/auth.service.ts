import * as bcrypt from 'bcrypt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../resources/user/entities/user.entity';
import { UserService } from '../../resources/user/user.service';
import { EmailService } from '../../resources/user/email/email.service';
import { TokenService } from '../../resources/token/token.service';
import { CreateUserDto } from '../../resources/user/dto/create-user.dto';
import { LoginUserDto } from '../../resources/user/dto/login-user.dto';
import { Token } from '../../resources/token/entities/token.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private emailService: EmailService,
    private tokenService: TokenService,
  ) {}

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
    await this.emailService.sendEmail({ email: user.email });

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

  /* OTHER FUNCTIONS */
  async validateUser(loginUserDto: LoginUserDto): Promise<any> {
    // get user in bdd
    const user = await this.userService.findOneByEmailWithPassword(
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
