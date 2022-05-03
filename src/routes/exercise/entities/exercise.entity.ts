import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Unique,
  Length,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from 'src/routes/user/entities/user.entity';
import { Validator } from 'src/routes/validator/entities/validator.entity';
import { Challenge } from 'src/routes/challenge/entities/challenge.entity';
import { UserExercise } from 'src/routes/user/entities/user-exercise.entity';

@Table({ tableName: 'Exercise' })
export class Exercise extends Model<Exercise> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Unique
  @Length({ min: 3, max: 30 })
  @Column
  name: string;

  @Column
  instructions: string;

  @Column
  expectedResult: string;

  @Column({
    defaultValue: 1,
    validate: {
      min: 1,
      max: 5,
    },
  })
  difficultyLevel: number;

  @BelongsToMany(() => User, () => UserExercise)
  users: User[];

  @HasMany(() => Validator)
  tests: Validator[];

  @ForeignKey(() => Challenge)
  @Column({
    type: DataType.UUID,
  })
  challengeId: string;

  @BelongsTo(() => Challenge)
  challenge: Challenge;
}
