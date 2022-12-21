import { BaseModel } from './base.entity';
import {
  AfterInsert,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class PostgresBaseModel extends BaseModel {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', default: null })
  public deletedAt: Date;

  @AfterInsert()
  castIdToNumber() {
    this.id = typeof this.id === 'string' ? parseInt(this.id) : this.id;
  }
}
