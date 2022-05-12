import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { User } from 'src/resources/user/entities/user.entity';
import { Exercise } from 'src/resources/exercise/entities/exercise.entity';

@Table({ tableName: 'UserExercise' })
export class UserExercise extends Model<UserExercise> {
  @Column
  isCompleted: boolean;

  @ForeignKey(() => User)
  @Column
  userId: string;

  @ForeignKey(() => Exercise)
  @Column
  exerciseId: string;
}
