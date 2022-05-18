import { Test, TestingModule } from '@nestjs/testing';
import { UserDto } from '../dto/user.dto';
import { User } from '../entities/user.entity';
import { UserModule } from '../user.module';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
    controller = module.get<UserController>(UserController);
  });

  describe('findOne', () => {
    // it('should return the user without password and email token', async () => {
    //   const user = new User();
    //   user.id = 'id';
    //   user.username = 'username';
    //   user.email = 'username@gmail.com';
    //   user.isEmailConfirmed = true;
    //   user.emailConfirmationToken = 'azazfzea';
    //   user.password = 'DASXas<jaazW>ZOEA';
    //   user.isAdmin = false;
    //   const userDto: UserDto = new UserDto(user);
    //   const expectedResult = userDto;
    //   const spy = jest
    //     .spyOn(userService, 'findOne')
    //     .mockReturnValue(expectedResult);
    //   // .mockImplementation(async (id: string, req: any) => await userDto);
    //   const result = await controller.findOne('id', {});
    //   expect(spy).toHaveBeenCalled();
    //   expect(result).toBe(userDto);
    // });
  });
});
