import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('userModel')
    private userModel: typeof User,
  ) {}

  async findOne(id: string, req: any) {
    // verify the authorization
    if (!this.hasTheAuthorization(id, req)) {
      throw new HttpException(
        'You cannot access this user',
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.userModel.findByPk<User>(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return new UserDto(user);
  }

  async update(id: string, req: any, updateUserDto: UpdateUserDto) {
    // verify the authorization
    if (!this.hasTheAuthorization(id, req)) {
      throw new HttpException(
        'You cannot update this user',
        HttpStatus.FORBIDDEN,
      );
    }

    // update user
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.username = updateUserDto.username || user.username;
    user.email = updateUserDto.email || user.email;
    user.isAdmin = updateUserDto.isAdmin || false;

    // update password
    const hashPassword = await bcrypt.hash(updateUserDto.password, 10);
    user.password = hashPassword || user.password;

    // change user in db
    let userData = await user.save();

    return new UserDto(userData);
  }

  async remove(id: string, req: any) {
    // verify the authorization
    if (!this.hasTheAuthorization(id, req)) {
      throw new HttpException(
        'You cannot remove this user',
        HttpStatus.FORBIDDEN,
      );
    }

    // delete the user
    const user = await this.userModel.findByPk<User>(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await user.destroy();

    return new UserDto(user);
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne<User>({ where: { email } });

    return new UserDto(user);
  }

  async findOneByEmailForLogin(email: string) {
    return await this.userModel.findOne<User>({ where: { email } });
  }

  async doesUserAlreadyExist(username: string, email: string) {
    return await this.userModel.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: email }],
      },
    });
  }

  hasTheAuthorization(id: string, req: any) {
    return req.user && req.user.userId == id;
  }
}
