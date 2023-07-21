import { Affiliation } from 'src/affiliation/entities/affiliation.entity';
import { AffiliationToUser } from  'src/affiliation/entities/affiliation_to_user.entity';
import { Events } from 'src/event/entities/event.entity';
import { EventToUserAttendance } from 'src/event/entities/eventToUserAttendance.entity';
import { SpaceToUserAttendance } from 'src/spaces/entities/spaceToUserAttendance.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column({ nullable: true })
  ethnicity: string;

  @Column({ nullable: true })
  race: string;

  @Column({ nullable: true })
  level: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  age: number;

  @Unique('username', ['username'])
  @Column({ length: 200 })
  username: string;

  @Column('simple-array', { nullable: true })
  roles: string[];

  @Column({ nullable: true })
  isAccountDisabled: boolean;

  @Unique('email', ['email'])
  @Column({ length: 200, nullable: true })
  email: string;

  @ManyToMany(() => Affiliation, (affilation) => affilation.user)
  @JoinTable()
  affilation: Affiliation[];

  @OneToMany(
    () => EventToUserAttendance,
    (eventToUserAttendance) => eventToUserAttendance.user,
  )
  eventToUserAttendance: EventToUserAttendance[];

  @OneToMany(
    () => SpaceToUserAttendance,
    (spaceToUserAttendance) => spaceToUserAttendance.user,
  )
  spaceToUserAttendance: SpaceToUserAttendance[];
  @OneToMany(() => AffiliationToUser, (affiliation_to_user) => affiliation_to_user.user)
  public affiliation_to_user: AffiliationToUser[];
  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;
  @Column({ nullable: true })
  passToken: number;
}
