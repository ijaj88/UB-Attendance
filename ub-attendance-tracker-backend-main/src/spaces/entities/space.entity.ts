import { Events } from 'src/event/entities/event.entity';
import { EventToUserAttendance } from 'src/event/entities/eventToUserAttendance.entity';
import { User } from 'src/user/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { SpaceToUserAttendance } from './spaceToUserAttendance.entity';

@Entity('spaces')
export class Spaces {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  isActive: boolean;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  qr: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  organizedBy: string;

  @OneToMany(() => Events, (event) => event.spaces)
  events: Events[];

  @OneToMany(
    () => SpaceToUserAttendance,
    (spaceToAttendance) => spaceToAttendance.space,
  )
  spaceToUserAttendance: EventToUserAttendance[];

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
