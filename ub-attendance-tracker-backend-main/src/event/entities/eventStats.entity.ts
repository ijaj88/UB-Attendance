import { Post } from '@nestjs/common';
import { User } from 'src/user/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('event_stats')
export class EventStats {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  uiLocationMetadata: string;

  @Column({ length: 5000 })
  query: string;

  @Column()
  isActive: boolean;

  @Column()
  category: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;
}
