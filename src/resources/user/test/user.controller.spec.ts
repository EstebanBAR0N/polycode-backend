import { Test, TestingModule } from '@nestjs/testing';
import { UserDto } from '../dto/user.dto';
import { User } from '../entities/user.entity';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);
  });

  describe('findOne', () => {
    it('should return some fields of the user', async () => {
      const user = new User();
      user.id = 'azajzbjansaza-azazvchbz-azazxczdza';
      user.username = 'username';
      user.email = 'username@gmail.com';
      user.isEmailConfirmed = true;
      user.emailConfirmationToken = 'azazfzea';
      user.password = 'DASXas<jaazW>ZOEA';
      user.isAdmin = false;

      const userDto: UserDto = new UserDto(user);

      jest
        .spyOn(userService, 'findOne')
        .mockImplementation(async () => await userDto);

      expect(
        await userController.findOne('azajzbjansaza-azazvchbz-azazxczdza', {}),
      ).toBe(userDto);
    });
  });
});
