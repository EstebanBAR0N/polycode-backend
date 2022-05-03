import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Unique,
  Length,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { Exercise } from 'src/routes/exercise/entities/exercise.entity';
import { Language } from 'src/common/enum/language';

@Table({ tableName: 'Challenge' })
export class Challenge extends Model<Challenge> {
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
  language: Language;

  @Column
  isPractice: boolean;

  @HasMany(() => Exercise)
  exercise: Exercise[];
}
