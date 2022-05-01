import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/routes/user/entities/user.entity';
import { Token } from 'src/routes/token/entities/token.entity';
import { Exercise } from 'src/routes/exercise/entities/exercise.entity';
import { UserExercise } from 'src/routes/user/entities/user-exercise.entity';
import { ExerciseTest } from 'src/routes/exercise-test/entities/exercise-test.entity';
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
        ExerciseTest,
        Challenge,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
