import {
  Table,
  Column,
  Model,
  PrimaryKey,
  IsDate,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';

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
