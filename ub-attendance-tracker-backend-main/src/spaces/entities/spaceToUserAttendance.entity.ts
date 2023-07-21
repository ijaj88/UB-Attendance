import { Post } from '@nestjs/common';
import { Reasons } from 'src/reasons/entities/reasons.entity';
import { User } from 'src/user/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Spaces } from './space.entity';

@Entity('space_to_user_attendance')
export class SpaceToUserAttendance {
  @PrimaryGeneratedColumn()
  public spaceToUserAttendanceId?: number;

  @Column()
  public spaceId?: number;

  @Column()
  public userId?: number;

  @Column({ type: 'bool' })
  public attended!: boolean;

  @ManyToOne(() => Reasons, (reason) => reason.spaceToUserAttendance, {
    nullable: true,
  })
  public reason!: Reasons;

  @ManyToOne(() => Spaces, (space) => space.spaceToUserAttendance)
  public space!: Spaces;

  @ManyToOne(() => User, (user) => user.spaceToUserAttendance)
  public user!: User;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;
}
