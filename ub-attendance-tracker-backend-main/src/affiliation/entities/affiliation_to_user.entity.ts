import { Post } from '@nestjs/common';
import { User } from 'src/user/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Affiliation } from './affiliation.entity';


@Entity('affiliationtouser')
export class AffiliationToUser {
  @PrimaryGeneratedColumn()
  public affiliation_to_userId?: number;

  @ManyToOne(() => Affiliation, (affiliation) => affiliation.affiliation_to_user)
  public affiliation!: Affiliation;

  @ManyToOne(() => User, (user) => user.affiliation_to_user)
  public user!: User;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

}
