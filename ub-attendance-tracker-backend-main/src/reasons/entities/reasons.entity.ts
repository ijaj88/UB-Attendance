import { SpaceToUserAttendance } from 'src/spaces/entities/spaceToUserAttendance.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('reasons')
export class Reasons {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  isActive: boolean;

  @Column({ nullable: false })
  name: string;

  @OneToMany(
    () => SpaceToUserAttendance,
    (spaceToUserAttendance) => spaceToUserAttendance.user,
  )
  spaceToUserAttendance: SpaceToUserAttendance[];

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;
}
