import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Unique,
  IsDate,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/routes/user/entities/user.entity';

@Table({ tableName: 'Token' })
export class Token extends Model<Token> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Unique
  @Column
  token: string;

  @IsDate
  @Column
  issueDate: Date;

  @IsDate
  @Column
  expirationDate: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
