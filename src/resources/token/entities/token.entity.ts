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
import { User } from 'src/resources/user/entities/user.entity';

@Table({ tableName: 'Token' })
export class Token extends Model<Token> {
  @PrimaryKey
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
