import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

import { ROLE } from '../constants/role.constant';

export class RegisterInput {
  @ApiProperty({ example: 'hkakkad' })
  @MaxLength(200)
  @IsString()
  username: string;

  @ApiProperty({ example: 'pkpk1212' })
  @IsNotEmpty()
  @Length(6, 100)
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: [1,2,3] })
  @IsArray()
  @IsOptional()
  affilations?: number[];
 /* 
  @ApiProperty({ example: 1 })
  @IsNumber()
  old_registration = 1;
*/
  // These keys can only be set by ADMIN user.
  roles: ROLE[] = [ROLE.USER];
  isAccountDisabled: boolean;
}
