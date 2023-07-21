import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateReasonInput {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
