import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { User } from 'src/routes/user/entities/user.entity';
import { Exercise } from 'src/routes/exercise/entities/exercise.entity';

@Table({ tableName: 'UserExercise' })
export class UserExercise extends Model<UserExercise> {
  @Column({ defaultValue: false })
  isTheChallengeCompleted: boolean;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Exercise)
  @Column
  exerciseId: number;
}
