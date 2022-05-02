import * as bcrypt from 'bcrypt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/routes/user/entities/user.entity';
import { UserService } from 'src/routes/user/user.service';
import { TokenService } from 'src/routes/token/token.service';
import { CreateUserDto } from 'src/routes/user/dto/create-user.dto';
import { LoginUserDto } from 'src/routes/user/dto/login-user.dto';
import { Token } from 'src/routes/token/entities/token.entity';

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
        'email or username already exists',
        HttpStatus.CONFLICT,
      );
    }

    // create user from body info
    const user = new User();

    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.isAdmin = false;

    // hashed password
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    user.password = hashPassword;

    // save user in db
    await user.save();

    // return the token
    return await this.login(
      new LoginUserDto(user.email, createUserDto.password),
    );
  }

  async login(body: LoginUserDto): Promise<any> {
    // get user in bdd
    const user = await this.userService.findOneByEmail(body.email);

    if (!user) {
      throw new HttpException(
        'Invalid email or password.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // info to stock in the token
    const payload = {
      username: user.username,
      id: user.id,
    };

    // sign token
    const jwt_token = this.jwtService.sign(payload);

    // TODO: add token to bdd
    await this.storeTokenInDatabase(user.id, jwt_token);

    return {
      access_token: jwt_token,
    };
  }

  async logout(tokenStr: string) {
    const token = tokenStr.split(' ')[1];

    // delete token in database;
    const tokenDelete = await this.tokenService.remove(token);

    return tokenDelete;
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<any> {
    // get user in bdd
    const user = await this.userService.findOneByEmailForLogin(
      loginUserDto.email,
    );

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
    let expirationDate = new Date(creationDate);
    expirationDate.setDate(expirationDate.getDate() + 1);

    const token_obj = new Token();
    token_obj.token = token;
    token_obj.issueDate = creationDate;
    token_obj.expirationDate = expirationDate;
    token_obj.userId = userId;

    await token_obj.save();
  }
}
