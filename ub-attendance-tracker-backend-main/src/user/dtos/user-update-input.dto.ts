import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ROLE } from 'src/auth/constants/role.constant';

export class UpdateUserInput {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @Length(6, 100)
  @IsString()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @Length(2, 100)
  @IsString()
  ethnicity: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(200)
  @IsNotEmpty()
  @IsString()
  level: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @Length(2, 100)
  @IsString()
  race: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @Length(3, 100)
  @IsString()
  gender: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(ROLE, { each: true })
  roles: ROLE[];
}

export class UpdateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  username: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(ROLE, { each: true })
  roles: ROLE[];
}
