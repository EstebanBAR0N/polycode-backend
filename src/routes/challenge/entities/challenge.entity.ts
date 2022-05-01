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
import { Langage } from 'src/common/enum/langage';

@Table({ tableName: 'Challenge' })
export class Challenge extends Model<Challenge> {
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

  @Column({ defaultValue: '' })
  image: string;

  @Column
  langage: Langage;

  @Column({ defaultValue: true })
  isPractice: boolean;

  @HasMany(() => Exercise)
  exercise: Exercise[];
}
