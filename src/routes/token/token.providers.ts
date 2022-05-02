import { Token } from './entities/token.entity';

export const tokenProviders = [
  {
    provide: 'tokenModel',
    useValue: Token,
  },
];
