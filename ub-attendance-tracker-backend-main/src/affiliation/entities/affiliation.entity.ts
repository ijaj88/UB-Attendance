import { User } from 'src/user/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AffiliationToUser } from './affiliation_to_user.entity';

@Entity('Affliation')
export class Affiliation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  isActive: boolean;

  @Column({ nullable: false })
  name: string;

  @ManyToMany(() => User, (user) => user.affilation)
  user: User[];
  
  @OneToMany(() => AffiliationToUser, (affiliation_to_user) => affiliation_to_user.affiliation)
  public affiliation_to_user: AffiliationToUser[];

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  userId: number;
}
