import { Sequelize } from 'sequelize-typescript';
import { User } from '../resources/user/entities/user.entity';
import { Token } from '../resources/token/entities/token.entity';
import { Exercise } from '../resources/exercise/entities/exercise.entity';
import { UserExercise } from '../resources/user/entities/user-exercise.entity';
import { UserChallenge } from '../resources/user/entities/user-challenge.entity';
import { Validator } from '../resources/validator/entities/validator.entity';
import { Challenge } from '../resources/challenge/entities/challenge.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize(process.env.DB_URL, {
        dialect: 'postgres',
      });
      sequelize.addModels([
        User,
        Exercise,
        UserExercise,
        UserChallenge,
        Token,
        Validator,
        Challenge,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
