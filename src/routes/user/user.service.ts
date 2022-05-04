import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailConfirmationUserDto } from './dto/email-confirmation-user.dto';
import { User } from './entities/user.entity';
import { UserExercise } from './entities/user-exercise.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('userModel')
    private userModel: typeof User,
    @Inject('userExerciseModel')
    private userExerciseModel: typeof UserExercise,
  ) {}

  async findOne(id: string, req: any) {
    // verify the authorization
    if (!this.hasTheAuthorization(id, req)) {
      throw new HttpException(
        'You cannot access this user',
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.userModel.findOne<User>({
      where: { id },
      raw: true,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return new UserDto(user);
  }

  async update(id: string, req: any, updateUserDto: UpdateUserDto) {
    // check if user already exists
    const userAlreadyExist = await this.doesUserAlreadyExist(
      updateUserDto.username,
      updateUserDto.email,
    );

    // verify the authorization
    if (!this.hasTheAuthorization(id, req) || userAlreadyExist) {
      throw new HttpException(
        "You haven't the authorization or the user already exist",
        HttpStatus.FORBIDDEN,
      );
    }

    // update user
    const user = await this.userModel.findOne({ where: { id }, raw: true });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // update user
    user.username = updateUserDto.username || user.username;
    user.email = updateUserDto.email || user.email;
    user.isAdmin = updateUserDto.isAdmin || false;

    if (updateUserDto.password) {
      // verify passwords
      if (updateUserDto.password !== updateUserDto.confirmPassword) {
        throw new HttpException("Passwords don't match", HttpStatus.CONFLICT);
      }

      const hashPassword = await bcrypt.hash(updateUserDto.password, 10);
      user.password = hashPassword || user.password;
    }

    // update user in db
    await this.userModel.update(user, { where: { id } });

    return new UserDto(user);
  }

  async remove(id: string, req: any) {
    // verify the authorization
    if (!this.hasTheAuthorization(id, req)) {
      throw new HttpException(
        'You cannot remove this user',
        HttpStatus.FORBIDDEN,
      );
    }

    // delete user in db
    await this.userModel.destroy({ where: { id } });

    return `User ${id} successfuly deleted`; //new UserDto(user);
  }

  // other functions
  async emailConfirmation(
    id: string,
    emailConfirmationUserDto: EmailConfirmationUserDto,
  ) {
    // update user
    const user = await this.userModel.findOne({ where: { id }, raw: true });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.isEmailConfirmed) {
      throw new HttpException('Email already confirmed', HttpStatus.CONFLICT);
    }

    if (
      emailConfirmationUserDto.confirmationEmailToken ===
      process.env.EMAIL_CONFIRMATION_TOKEN
    ) {
      user.isEmailConfirmed = true;

      // update user in db
      await this.userModel.update(user, { where: { id } });

      return `Email successfuly confirmed by ${id}`;
    }
    throw new HttpException(
      'Incorrect email confirmaton token',
      HttpStatus.FORBIDDEN,
    );
  }

  async create(user: User) {
    await this.userModel.create(user);
  }

  // TODO
  async createOrUpdateUserExercise(
    isCompleted: boolean,
    userId: string,
    exerciseId: string,
  ) {
    // check if user-exercise row exists
    const userExerciseAlreadyExists = await this.userExerciseModel.findOne({
      where: { userId: userId, exerciseId: exerciseId },
      raw: true,
    });

    if (userExerciseAlreadyExists) {
      // exists + it's not completed and isComplted = true  => update to completed
      if (!userExerciseAlreadyExists.isCompleted && isCompleted) {
        await this.userExerciseModel.update(
          { isCompleted },
          { where: { userId, exerciseId } },
        );
        console.log(`Exercise ${exerciseId} successfuly completed`);
      }
      // no need update
      else {
        console.log('Exercise already completed');
      }
    } else {
      // create the row in db
      await this.userExerciseModel.create({
        isCompleted,
        userId,
        exerciseId,
      });
      console.log(`Exercise ${exerciseId} successfuly completed`);
    }
  }

  async findOneById(id: string) {
    const user = await this.userModel.findOne<User>({
      where: { id },
      raw: true,
    });

    if (!user) {
      throw new HttpException(`User ${id} not found`, HttpStatus.NOT_FOUND);
    }

    return new UserDto(user);
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne<User>({
      where: { email },
      raw: true,
    });

    if (!user) {
      throw new HttpException(
        `User with thie email: ${email} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return new UserDto(user);
  }

  async findOneByEmailForLogin(email: string): Promise<any> {
    return await this.userModel.findOne<User>({ where: { email }, raw: true });
  }

  async doesUserAlreadyExist(username: string, email: string) {
    let query = {};
    if (username && email) {
      query = {
        where: {
          [Op.or]: [{ username: username }, { email: email }],
        },
      };
    } else if (username) {
      query = { where: { username }, raw: true };
    } else {
      query = { where: { email } };
    }

    return await this.userModel.findOne(query);
  }

  hasTheAuthorization(id: string, req: any) {
    return req.user && req.user.userId == id;
  }
}
