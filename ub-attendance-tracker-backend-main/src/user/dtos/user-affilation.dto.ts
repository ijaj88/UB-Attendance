import { Affiliation } from 'src/affiliation/entities/affiliation.entity';
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

export class UserAffiliation {



  affilationUser: string;


}
