import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Unique,
  Length,
  AllowNull,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';
import { Validator } from '../../validator/entities/validator.entity';
import { Challenge } from '../../challenge/entities/challenge.entity';
import { UserExercise } from '../../user/entities/user-exercise.entity';

@Table({ tableName: 'Exercise' })
export class Exercise extends Model<Exercise> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

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
  @AllowNull(true)
  @Column({
    type: DataType.UUID,
  })
  challengeId: string;

  @BelongsTo(() => Challenge, {
    foreignKey: {
      allowNull: true,
    },
  })
  challenge: Challenge;
}
