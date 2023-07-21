import { Affiliation } from 'src/affiliation/entities/affiliation.entity';
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

@Entity('verifyuser')
export class VerifyUser { 
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


  @Column({ nullable: true })
  emailToken: number;

  @Column({ nullable: true })
  isVerified: boolean;

  //@OneToMany(() => Affiliation, (affilation) => affilation.verify_user)
  //@JoinTable()
  //affilation: Affiliation[];

  @Column('simple-array', { nullable: true })
  affindex: number[];

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;


}
