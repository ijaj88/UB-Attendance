import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEventSeries {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
