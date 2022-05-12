import { UserChallenge } from './entities/user-challenge.entity';

export const userChallengeProviders = [
  {
    provide: 'userChallengeModel',
    useValue: UserChallenge,
  },
];
