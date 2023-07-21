import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
export class EventStatQuery {
  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  eventId: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  // @Type(() => Boolean)
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  file?: boolean;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  spaceId: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  seriesId: number;

  @ApiPropertyOptional({ example: '2023-04-09T01:51:45.650Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fromTimestamp: Date;

  @ApiPropertyOptional({ example: '2023-04-10T01:51:45.650Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  toTimestamp: Date;
}
export class EventStatParam {
  @ApiProperty({ example: 3 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  id: number;
}
