import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Unique,
  IsEmail,
  Length,
  DataType,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { Token } from '../../token/entities/token.entity';
import { Exercise } from '../../exercise/entities/exercise.entity';
import { Challenge } from '../../challenge/entities/challenge.entity';
import { UserExercise } from './user-exercise.entity';
import { UserChallenge } from './user-challenge.entity';

@Table({ tableName: 'User' })
export class User extends Model<User> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Unique
  @Length({ min: 3, max: 15 })
  @Column
  username: string;

  @Unique
  @IsEmail
  @Column
  email: string;

  @Column({ defaultValue: false })
  isEmailConfirmed: boolean;

  @Column
  emailConfirmationToken: string;

  @Column
  password: string;

  @Column({ defaultValue: false })
  isAdmin: boolean;

  @HasMany(() => Token)
  tokens: Token[];

  @BelongsToMany(() => Exercise, () => UserExercise)
  userExercises: UserExercise[];

  @BelongsToMany(() => Challenge, () => UserChallenge)
  userChallenges: UserChallenge[];
}
