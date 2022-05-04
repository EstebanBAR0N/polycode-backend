import { UserExercise } from './entities/user-exercise.entity';

export const userExerciseProviders = [
  {
    provide: 'userExerciseModel',
    useValue: UserExercise,
  },
];
