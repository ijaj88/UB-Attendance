import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ResendToken {
  @IsNotEmpty()
  @ApiProperty()
  username: string;
}
