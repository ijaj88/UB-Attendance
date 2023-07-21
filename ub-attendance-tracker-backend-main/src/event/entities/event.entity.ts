import { Spaces } from 'src/spaces/entities/space.entity';
import { User } from 'src/user/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { EventSeries } from './eventSeries.entity';
import { EventToUserAttendance } from './eventToUserAttendance.entity';

@Entity('events')
export class Events {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  isActive: boolean;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  from: Date;

  @Column({ nullable: true })
  to: Date;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  qr: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  organizedBy: string;

  @ManyToOne(() => User, (user) => user.eventToUserAttendance)
  createdBy: User;

  @OneToMany(
    () => EventToUserAttendance,
    (eventToAttendance) => eventToAttendance.event,
  )
  eventToUserAttendance: EventToUserAttendance[];

  @ManyToOne(() => Spaces, (space) => space.events, { nullable: true })
  spaces: Spaces;

  @ManyToOne(() => EventSeries, (series) => series.events)
  series: EventSeries;

  @Column({ nullable: true })
  isAccountDisabled: boolean;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;
}
