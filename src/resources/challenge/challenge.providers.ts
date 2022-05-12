import { Challenge } from './entities/challenge.entity';

export const challengeProviders = [
  {
    provide: 'challengeModel',
    useValue: Challenge,
  },
];
