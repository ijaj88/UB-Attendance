import {ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateEventInput {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @MaxLength(200)
  @IsOptional()
  @IsString()
  organizedBy: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  from: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  to: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  spacesId?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  series?: number;
}


export class DisableEventSpace {


  @ApiProperty()
  @IsNotEmpty()
  isActive?: boolean = false; // default value set to false
}

