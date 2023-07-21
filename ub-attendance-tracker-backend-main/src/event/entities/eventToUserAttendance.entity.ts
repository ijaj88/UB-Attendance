import { Post } from '@nestjs/common';
import { User } from 'src/user/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Events } from './event.entity';

@Entity('event_to_user_attendance')
export class EventToUserAttendance {
  @PrimaryGeneratedColumn()
  public eventToUserAttendanceId?: number;

  @Column()
  public eventId?: number;

  @Column()
  public userId?: number;

  @Column({ type: 'bool' })
  public rsvp!: boolean;

  @Column({ type: 'bool' })
  public attended!: boolean;

  @ManyToOne(() => Events, (event) => event.eventToUserAttendance)
  public event!: Events;

  @ManyToOne(() => User, (user) => user.eventToUserAttendance)
  public user!: User;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;
}
