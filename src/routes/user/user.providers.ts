import { User } from './entities/user.entity';

export const userProviders = [
  {
    provide: 'userModel',
    useValue: User,
  },
];
