import { Validator } from './entities/validator.entity';

export const validatorProviders = [
  {
    provide: 'validatorModel',
    useValue: Validator,
  },
];
