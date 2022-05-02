import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/routes/user/entities/user.entity';
import { Token } from 'src/routes/token/entities/token.entity';
import { Exercise } from 'src/routes/exercise/entities/exercise.entity';
import { UserExercise } from 'src/routes/user/entities/user-exercise.entity';
import { Validator } from 'src/routes/validator/entities/validator.entity';
import { Challenge } from 'src/routes/challenge/entities/challenge.entity';

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
        Token,
        Validator,
        Challenge,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
