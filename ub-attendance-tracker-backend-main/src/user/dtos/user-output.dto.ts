import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Affiliation } from 'src/affiliation/entities/affiliation.entity';

import { ROLE } from '../../auth/constants/role.constant';

export class UserOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  ethnicity: string;

  @Expose()
  @ApiProperty()
  race: string;

  @Expose()
  @ApiProperty()
  age: string;

  @Expose()
  @ApiProperty()
  gender: string;

  @Expose()
  department: string;

  @Expose()
  level: string;

  @Expose()
  @ApiProperty()
  username: string;

  @Expose()
  @ApiProperty()
  affilation: Affiliation[];

  @Expose()
  @ApiProperty({ example: [ROLE.USER] })
  roles: ROLE[];

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  isAccountDisabled: boolean;

  @Expose()
  @ApiProperty()
  createdAt: string;

  @Expose()
  @ApiProperty()
  updatedAt: string;
}
