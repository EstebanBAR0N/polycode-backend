import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { User } from 'src/resources/user/entities/user.entity';
import { Challenge } from 'src/resources/challenge/entities/challenge.entity';

@Table({ tableName: 'UserChallenge' })
export class UserChallenge extends Model<UserChallenge> {
  @Column
  nbOfExerciseCompleted: boolean;

  @ForeignKey(() => User)
  @Column
  userId: string;

  @ForeignKey(() => Challenge)
  @Column
  challengeId: string;
}
