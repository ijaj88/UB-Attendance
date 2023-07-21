import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Spaces } from 'src/spaces/entities/space.entity';
import { User } from 'src/user/entities/users.entity';

import { ROLE } from '../../auth/constants/role.constant';
import { EventSeries } from '../entities/eventSeries.entity';

export class EventOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  from: string;

  @Expose()
  @ApiProperty()
  to: string;

  @Expose()
  @ApiProperty()
  createdBy: User;

  @Expose()
  @ApiProperty()
  spaces: Spaces;

  @Expose()
  @ApiProperty()
  series: EventSeries;
}
