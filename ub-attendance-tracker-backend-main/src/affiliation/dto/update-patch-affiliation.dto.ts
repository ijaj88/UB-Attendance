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

export class PatchAffiliation {

  @ApiPropertyOptional({ example: [1,2,3] })
  @IsArray()
  @IsOptional()
  affilations?: number[];
}


