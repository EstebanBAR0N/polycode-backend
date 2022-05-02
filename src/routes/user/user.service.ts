import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { Injectable, Inject } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('userModel')
    private userModel: typeof User,
  ) {}

  async findAll() {
    const users = await this.userModel.findAll<User>();

    // UserDto: don't return password
    return users.map((user) => new UserDto(user));
  }

  async findOne(id: string) {
    const user = await this.userModel.findByPk<User>(id);

    return new UserDto(user);
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne<User>({ where: { email } });

    return new UserDto(user);
  }

  async findOneByEmailForLogin(email: string) {
    return await this.userModel.findOne<User>({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByPk(id);

    // update user
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

  async remove(id: string) {
    const user = await this.userModel.findByPk<User>(id);
    await user.destroy();

    return new UserDto(user);
  }

  async doesUserAlreadyExist(username, email) {
    return await this.userModel.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: email }],
      },
    });
  }
}
