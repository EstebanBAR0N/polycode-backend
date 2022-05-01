import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Unique,
  Length,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Exercise } from 'src/routes/exercise/entities/exercise.entity';

@Table({ tableName: 'ExerciseTest' })
export class ExerciseTest extends Model<ExerciseTest> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Unique
  @Length({ min: 3, max: 15 })
  @Column
  name: string;

  @Column
  code: string;

  @Column
  expectedResult: string;

  @ForeignKey(() => Exercise)
  @Column({
    type: DataType.UUID,
  })
  exerciseId: string;

  @BelongsTo(() => Exercise)
  exercise: Exercise;
}
