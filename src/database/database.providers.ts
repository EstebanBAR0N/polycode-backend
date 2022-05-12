import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/resources/user/entities/user.entity';
import { Token } from 'src/resources/token/entities/token.entity';
import { Exercise } from 'src/resources/exercise/entities/exercise.entity';
import { UserExercise } from 'src/resources/user/entities/user-exercise.entity';
import { UserChallenge } from 'src/resources/user/entities/user-challenge.entity';
import { Validator } from 'src/resources/validator/entities/validator.entity';
import { Challenge } from 'src/resources/challenge/entities/challenge.entity';

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
