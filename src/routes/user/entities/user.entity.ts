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
import { Token } from 'src/routes/token/entities/token.entity';
import { Exercise } from 'src/routes/exercise/entities/exercise.entity';
import { UserExercise } from './user-exercise.entity';

@Table({ tableName: 'User' })
export class User extends Model<User> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Unique
  @Length({ min: 3, max: 15 })
  @Column
  username: string;

  @Unique
  @IsEmail
  @Column
  email: string;

  @Column
  password: string;

  @Column({ defaultValue: '' })
  image: string;

  @Column({ defaultValue: false })
  isAdmin: boolean;

  @HasMany(() => Token)
  tokens: Token[];

  @BelongsToMany(() => Exercise, () => UserExercise)
  exercises: Exercise[];
}
