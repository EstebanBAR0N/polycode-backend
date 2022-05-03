import { Exercise } from './entities/exercise.entity';

export const exerciseProviders = [
  {
    provide: 'exerciseModel',
    useValue: Exercise,
  },
];
