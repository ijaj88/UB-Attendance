import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum EventAction {
  RSVP = 'rsvp',
  ATTEND = 'attend',
}

export class MarkEventAttendanceInput {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  eventId: number;

  @ApiProperty()
  @IsEnum(EventAction)
  @IsNotEmpty()
  action: EventAction;
}
